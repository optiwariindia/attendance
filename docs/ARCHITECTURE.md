# Technical Architecture - Mini HRMS

## 1. Architectural Style: Multi-tenant Modular Monolith (Containerized)
The system is built as a **SaaS-ready Multi-tenant Modular Monolith** encapsulated entirely within **Docker**.

### Core Architectural Principles
- **SaaS Multi-tenancy:** Uses a "Shared Database, Isolated Data" model. Every record is associated with an `origin` (Tenant Identifier).
- **Tenant Isolation:** A mandatory `setOrigin` middleware identifies the tenant based on the `host` header. The `MongooseModel` wrapper from `express-web-tools` ensures that all database operations are automatically scoped to the `origin`.
- **PBAC Security Model:** Implements Permission-Based Access Control (PBAC). Access is granted based on a granular mapping of `role:name` or `user:id` to specific `module:feature:action` combinations, defined in a dedicated `Permission` model.
- **Cookie-Based Authentication:** Uses `httpOnly` secure cookies for JWT transport, providing robust protection against XSS.
- **Asynchronous Error Handling:** All routes and guards utilize the `asyncHandler` utility to ensure consistent JSON error responses and prevent server crashes.
- **Real-time Event Architecture:**
    - **Internal Event Bus:** A centralized `EventEmitter` (`src/backend/core/events.js`) facilitates decoupled communication between modules (e.g., Attendance emitting a clock event which the SSE module then broadcasts).
    - **Server-Sent Events (SSE):** Provides a unidirectional real-time stream from server to client. Used for:
        - **Clock Synchronization:** A 1-second heartbeat (`tick`) ensures clients stay synchronized with server time.
        - **Instant UI Updates:** Real-time feedback for attendance actions and status changes.
        - **Security:** Forced logouts can be initiated by the server via the SSE stream.
- **Framework-Agnostic Controllers:** Core business logic is encapsulated in class-based controllers (extending `CrudController`) that are decoupled from the Express `req/res` objects.
- **Docker-First Development:** The entire development environment is managed via Docker Compose.
- **Unified Production Pipeline:** The frontend is built and then served as static content by the Express backend.
- **SPA Fallback Routing:** The backend handles all undefined routes by serving the frontend's `index.html`.

## 2. Core Modules
The system is divided into high-level logical modules:
1.  **Auth Module:** JWT-based authentication, PBAC guards, and session management.
2.  **Attendance Module:** GPS capture, clock-in/out logic, and verification workflows.
3.  **Organization Module:** Configuration of **Branches (Sites)**, Departments, and Designations.
4.  **Leaves Module:** Holiday management and leave application workflows (Work in Progress).
5.  **SSE Module:** Manages authenticated real-time connections and event broadcasting.

## 3. Technology Stack
- **Frontend:** React (SPA) with Material UI.
- **Backend:** Node.js / Express.js using `express-web-tools` for boilerplate-free CRUD and multi-tenancy.
- **Database:** MongoDB (via Mongoose).
- **Real-time:** Server-Sent Events (SSE).
- **Mobile:** Capacitor.js (planned).

## 4. Data Flow & Integration
- **Event-Driven:** Modules communicate via the internal `eventStream`.
- **Origin-Aware:** The `origin` (tenant ID) is injected by middleware and enforced at the model level.
- **Standardized API:** All modules follow a consistent RESTful pattern for CRUD operations.
