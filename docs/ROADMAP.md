# Project Roadmap - Mini HRMS (SaaS Edition)
## Phase 0: Infrastructure, Multi-tenancy & Foundation (Completed)
- [x] Dockerized Dev Environment (Backend & DB).
- [x] Nginx Gateway & Custom Networks.
- [x] **SaaS Core:**
    - [x] Self-registration form for Companies (Tenants).
    - [x] Data isolation logic (Origin-aware middleware).
    - [x] PBAC Security Guard & Permission Matrix.
- [x] **Secure Auth:**
    - [x] Cookie-based JWT Authentication.
    - [x] Multi-tenant Seeding logic.

## Phase 1: Organization & Attendance (Current)
- [ ] **Organization Setup:**
    - Branch/Site management with geofence support.
    - Department & Designation configuration.
- [ ] **Onboarding & ESS:**
    - Mandatory Profile Completion (Bank, Docs, Emergency Contacts).
    - ESS Portal for downloading HR letters and salary slips.
- [ ] **GPS-Verified Attendance:**
    - High-accuracy location capture.
    - Server-side timestamping.
- [ ] **Admin Verification:**
    - "Check-Marks" workflow for attendance auditing.

## Phase 2: Leave & Holiday Management
...
- [ ] **Holiday Calendar:**
    - Tenant-specific holiday lists.
    - Calendar view for employees.
- [ ] **Leave Workflow:**
    - Application submission and manager approval hierarchy.
    - Automated balance tracking.

## Phase 3: Reporting & Analytics
- [ ] **Automated Reports:**
    - Monthly attendance export (Excel/PDF).
    - Workforce performance metrics.

## Phase 4: Mobile & Field Optimization
- [ ] **Capacitor.js Integration:**
    - Native Android/iOS variants.
- [ ] **Offline Resilience:**
    - Local buffering of clock events for field researchers.

## Phase 5: Advanced Features
- [ ] **Dynamic Shift Scheduling:**
    - Weekly/Monthly roasters per branch.
- [ ] **Payroll Integration:**
    - Salary calculation based on verified attendance and leave policies.
