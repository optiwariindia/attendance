# Project Management - Mini HRMS

## 1. Stakeholders
- **Lead Engineer:** Om Prakash Tiwari
- **HR Manager:** Responsibility for policy definition and leave approvals.
- **Field Researchers:** Primary users of the mobile-responsive attendance features.

## 2. Communication Plan
- **Daily Progress:** Tracked via commits and local task boards.
- **Requirement Updates:** Updates to `docs/SRS.md` as fieldwork needs evolve.

## 3. Engineering Standards & Policies
... (previous standards) ...
- **Server-Side Truth:** Timestamps and location validation must always occur on the backend.

## 4. Frontend Modular Architecture Suggestions
To maintain a scalable and maintainable frontend, the following module structure is proposed:

### Core Modules:
1.  **`auth`**: Tenant (Company) Registration, User Login, First-time Password Change.
2.  **`onboarding`**: Mandatory Profile Completion (Bank, Emergency Contact, Doc Upload).
3.  **`dashboard`**: Real-time Clock, GPS Clock-in/out, Daily Summary.
4.  **`attendance`**: Personal Attendance Records with Date Filtering.
5.  **`leaves`**: Leave Applications and Holiday Calendar Viewer.
6.  **`ess`**: Employee Self-Service (Download Appointment Letters, Salary Slips, Appraisals).
7.  **`organization`** (Admin): Branch/Site Management (GPS & Geofence), Depts, Designations.
8.  **`settings`** (Admin): Shift Policies, Late Arrival Rules, Leave Categorization.
9.  **`user-management`** (Admin): Employee CRUD and Reporting Hierarchy Setup.
10. **`verification`** (Admin): Check-Marks Panel for Attendance Auditing and Manual Overrides.
11. **`reports`** (Admin): Monthly Export and Performance Analytics.

### Shared Infrastructure:
- **`core`**: Global State (User/Tenant Context), API Client, Routing.
- **`shared`**: Reusable UI Components (Modals, Toasts, Layouts).

## 5. Risk Management
| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| Poor Connectivity | High | Implement offline storage and sync in Phase 4. |
| GPS Inaccuracy | Medium | Capture accuracy radius; allow admin overrides with reasons. |
| Data Privacy | High | Strict RBAC; encryption of sensitive employee IDs. |
| Device Time Tampering | Medium | Always use server-side timestamps for core logic. |

## 4. Quality Assurance
- **Unit Testing:** Focus on attendance calculation logic and shift policy validation.
- **UAT (User Acceptance Testing):** Field researchers to test GPS accuracy in various conditions.
- **Performance Testing:** Ensure dashboard loads quickly on mobile data.
