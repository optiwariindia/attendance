# Backend Modular Architecture Suggestions - Mini HRMS

Following the **Modular Monolith** and **SaaS Multi-tenant** principles, the backend is proposed to be organized into the following domain-driven modules.

## 1. Core Service Modules

### `tenant` (SaaS Foundation & Configuration)
- **Responsibility:** Company onboarding, identity, and behavioral settings.
- **Key Logic:** 
    - **Self-Registration:** Public API for new company onboarding.
    - **Tenant Config:** Managing tenant-specific settings (Grace periods, Shift rules, Leave policies) directly linked to the `tenantID`.
    - **Global Config:** Handling the minimal global system settings (Superadmin level) required for bootstrapping, fulfilling the "Zero-Dependency on .env" policy.
    - **Dynamic Loading:** Logic to load and cache tenant settings during the request lifecycle.

### `org` (Organizational Structure)
- **Responsibility:** Defining the physical and logical structure of a tenant.
- **Key Logic:** **Branch Management (GPS Centers & Geofencing metadata)**, Department and Designation CRUD.

### `user` (Workforce Management)
- **Responsibility:** Employee lifecycle and profile data.
- **Key Logic:** Employee CRUD, **Reporting Hierarchy management**, **Mandatory Profile Verification** (Bank details, Emergency contacts).

## 2. Business Logic Modules

### `attendance` (The Engine)
- **Responsibility:** Real-time time tracking and location auditing.
- **Key Logic:** GPS-verified Clock-in/out, **Server-side timestamping**, **Check-Marks (Admin Verification)** workflow, Manual adjustment audit trails.

### `leave` (Time-Off Management)
- **Responsibility:** Managing absences and holidays.
- **Key Logic:** Leave request/approval workflow, **Holiday-aware duration calculation**, Tenant-specific Holiday List management.

### `ess-docs` (Document & Payroll Services)
- **Responsibility:** Delivering value-added documents to employees.
- **Key Logic:** Secure File Streaming (User A cannot access User B's files), PDF generation for Appointment Letters, Appraisal Letters, and Salary Slips.

### `reporting` (Data Analytics)
- **Responsibility:** Aggregating data for management.
- **Key Logic:** Monthly Attendance aggregation, CSV/Excel export engines, Workforce analytics.

## 3. Shared Infrastructure (`core/`)
These are global utilities and middlewares used across all modules:
- **`Tenant Isolation Middleware`**: Mandatory layer that injects `tenantID` into every database query to ensure data privacy.
- **`Database Connector`**: Centralized Mongoose connection logic.
- **`Global Error Handler`**: Consistent API error response formatting.
- **`Common Utils`**: GPS distance calculators, Date manipulators (using Node 26 Temporal API).
