# Technical Architecture - Mini HRMS

## 1. Architectural Style: Multi-tenant Modular Monolith (Containerized)
The system is built as a **SaaS-ready Multi-tenant Modular Monolith** encapsulated entirely within **Docker**.

### Core Architectural Principles
- **SaaS Multi-tenancy:** Uses a "Shared Database, Isolated Data" model. Every record is associated with an `origin` (Tenant Identifier).
- **Tenant Isolation:** A mandatory `setOrigin` middleware and `auth` guard ensure that all database operations are scoped to the authenticated tenant.
- **PBAC Security Model:** Implements Permission-Based Access Control (PBAC). Access is granted based on a granular mapping of `role:name` or `user:id` to specific `module:feature:action` combinations, defined in a dedicated `Permission` model.
- **Cookie-Based Authentication:** Uses `httpOnly` secure cookies for JWT transport, providing robust protection against XSS. Supports standard `Authorization` headers for mobile and external API fallback.
- **Asynchronous Error Handling:** All routes and guards utilize the `asyncHandler` utility to ensure that asynchronous errors are automatically caught and passed to the centralized Express error middleware, preventing server crashes and maintaining consistent JSON error responses.
- **Framework-Agnostic Controllers:** Core business logic is encapsulated in class-based controllers that are decoupled from the Express `req/res` objects, ensuring long-term portability and testability.
- **Docker-First Development:** The entire development environment is managed via Docker Compose.
- **Unified Production Pipeline:** The frontend is built and then served as static content by the Express backend. This simplifies deployment and eliminates CORS issues in production.
- **SPA Fallback Routing:** The backend handles all undefined routes by serving the frontend's `index.html`, supporting modern SPA routing.
- **Capacitor Synchronization:** Native mobile variants (Android/iOS) are updated as part of the unified build process via Capacitor's sync/copy mechanism.

## 2. Core Modules
The system is divided into high-level logical modules:
1.  **Auth Module:** JWT-based authentication, RBAC, and session management.
2.  **Attendance Module:** GPS capture, shift validation, clock-in/out logic, and verification workflows.
3.  **Leave & Holiday Module:** Holiday calendar management, leave applications, and balance tracking.
4.  **Organization Module:** Configuration of **Branches (Sites)**, Departments, Designations, and Policies.
5.  **User Module:** Employee profile management and reporting hierarchy.

## 3. Technology Stack
- **Frontend:** React (SPA) with Material UI for a mobile-first responsive design.
- **Mobile Variant:** **Capacitor.js** (To wrap the React SPA into native Android/iOS applications).
- **Backend:** Node.js / Express.js (Modular structure).
- **Database:** MongoDB (Preferred for flexible schema and Geospatial indexing for GPS data).
- **Caching:** Redis (Optional, for real-time server clock and session caching).
- **Communication:** RESTful APIs for client-server interaction.

## 4. Data Flow & Integration
- **API First:** All frontend actions are driven by a unified REST API layer.
- **Geospatial Queries:** Using MongoDB's `$near` or `$geoWithin` for future geofencing features.
- **Event Bus (Internal):** Use an internal event emitter to decouple modules (e.g., when a Leave is approved, the Attendance module is notified to mark those days).

## 5. Deployment & Configuration Strategy
- **Containerization:** Dockerized application for consistent environments.
- **Environment Management:** 
    - **No `.env` Files:** As a project-wide policy, `.env` or similar files are strictly prohibited.
    - **Essential Bootstrap:** Critical infrastructure secrets (DB URIs, Port mappings) are injected directly via `docker-compose.yml` and managed by the host OS/orchestrator.
    - **Config Database:** All application-level settings (Grace periods, Notification templates, Leave policies) are stored in a dedicated configuration database/collection, ensuring central management and real-time updates without service restarts.
- **Scaling:** Horizontal scaling of the monolithic instance behind a Load Balancer.
