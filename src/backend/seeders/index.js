import mongoose from "mongoose";
import { seedAuth } from "./auth.js";
import { seedOrganization } from "./organization.js";

const dbUri = process.env.DB || "mongodb://localhost:27017/attendance";

const runSeeders = async () => {
    try {
        console.log("🚀 Starting Database Seeding...");
        await mongoose.connect(dbUri);
        console.log("🔌 Connected to MongoDB. State:", mongoose.connection.readyState);

        await seedAuth();
        await seedOrganization();

        console.log("\n🏁 All seeders completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error.message);
        process.exit(1);
    }
};

runSeeders();
