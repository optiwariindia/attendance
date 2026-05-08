# Directory Structure Blueprint - Mini HRMS (v2 - Docker & Modular)

This blueprint follows a containerized, modular monolith architecture with a unified build pipeline.
## 1. Project Root & Containerization
```text
/
├── docker-compose.yml       # Orchestrates Dev environment
├── docs/                    # Documentation
├── tasks/                   # Milestone tracking
├── src/
│   ├── backend/             # Node.js Modular Backend
│   │   ├── core/            # Shared core logic (controllers, routes, etc.)
│   │   ├── modules/         # Domain-driven modules (attendance, auth, leaves, etc.)
│   │   └── Dockerfile       # Multi-stage: Dev (watch) & Prod (static serve)
│   └── frontend/            # React Frontend
│       ├── Dockerfile       # Multi-stage: Dev (Vite) & Prod (Build)
│       └── src/             # Frontend source
└── scripts/                 # Build & Sync automation scripts
```

## 2. Backend Structure (Actual)
The backend is organized into core shared logic and domain-specific modules.
```text
src/backend/
├── core/                    # Global/Shared logic
│   ├── server.js            # Express server initialization
├── modules/                 # Functional modules
│   ├── auth/                # Authentication & User sessions
│   │   ├── controllers/     # Framework-agnostic logic
│   │   ├── guards/          # Security (Auth, Role, Permission)
│   │   ├── models/          # Mongoose schemas (compiled)
│   │   └── routes/          # Express route definitions
│   ├── attendance/
│   ├── leaves/
│   ├── organization/
│   └── settings/
└── seeders/                 # Database initialization scripts
```

## 3. Frontend Structure (Actual)
Current frontend layout as seen in `src/frontend/src/`.
```text
src/frontend/src/
├── componentsATD/           # HRMS-specific UI components
├── context/                 # React Context providers (State Management)
├── hooks/                   # Custom hooks (GPS, Toast, etc.)
├── pages/                   # Route components (User, Admin, Visitor)
├── utils/                   # Utility functions (API, Ajax, Push)
├── App.jsx                  # Main routing
└── index.js                 # Entry point
```


## 3. Build & Deployment Workflow
### Development Mode
- `docker-compose up` starts both frontend and backend.
- **Frontend:** Vite dev server with HMR.
- **Backend:** Nodemon/Watch mode.
- Both services communicate over the Docker network.

### Production Build Sequence
1.  **Frontend Build:** Multi-stage Dockerfile builds the React SPA into static assets.
2.  **Backend Integration:** The build stage of the Backend Dockerfile copies the frontend assets into `src/backend/webroot/`.
3.  **Static Serving:** Express `app.js` is configured to:
    - Serve assets from `webroot/`.
    - Handle API routes under `/api/v1/*`.
    - **Fallback:** Redirect all undefined routes to `webroot/index.html` (SPA support).
4.  **Native Sync:** Build script executes `npx cap sync` to propagate changes to Android/iOS native codebases.

## 4. Key Engineering Standards
- **Zero-Dependency on `.env`:** No configuration files are to be stored on disk. Critical bootstrap variables are injected via Docker Compose; all other settings live in the database.
- **Environment Parity:** Docker ensures identical environments from local dev to production.
- **Surgical Static Serving:** Express serves the SPA, eliminating the need for a separate Nginx container in simple deployments.
- **Native Automation:** Capacitor sync is an integral part of the production pipeline, ensuring web and mobile stay in lockstep.
```text
