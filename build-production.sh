#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "========================================="
echo "Starting Production Build Process"
echo "========================================="

# Define cleanup handler
cleanup() {
    echo "========================================="
    echo "Cleaning up temporary build files..."
    if [ -d "src/backend/public" ]; then
        rm -rf src/backend/public
        echo "Cleaned up src/backend/public"
    fi
    echo "Cleanup complete."
    echo "========================================="
}

# Register the cleanup handler on script exit
trap cleanup EXIT

# 1. Run npm run build on frontend container
echo "Step 1: Running frontend build inside frontend container..."
docker compose run --rm frontend npm run build

# 2. Verify that ./public exists and contains files
if [ ! -d "public" ] || [ -z "$(ls -A public)" ]; then
    echo "Error: ./public directory is missing or empty after frontend build." >&2
    exit 1
fi
echo "Frontend build successfully generated/updated ./public directory."

# 3. Copy ./public directory to ./src/backend/public
echo "Step 2: Copying ./public to ./src/backend/public..."
# Remove any existing destination public directory to avoid mixing files
rm -rf src/backend/public
cp -r public src/backend/public
echo "Copied ./public to ./src/backend/public."

# 4. Create production build of backend
echo "Step 3: Creating production build of backend Docker image..."
docker build --target production -t backend ./src/backend

# 5. Change tag of backend from backend to registry.sampledge.com/hrms/attendance:1.0.0
echo "Step 4: Tagging backend image as registry.sampledge.com/hrms/attendance:1.0.0..."
docker tag backend registry.sampledge.com/hrms/attendance:1.0.0

# 6. Publish it to repository
echo "Step 5: Publishing image to repository..."
docker push registry.sampledge.com/hrms/attendance:1.0.0

echo "========================================="
echo "Production Build and Publish Completed Successfully!"
echo "========================================="
