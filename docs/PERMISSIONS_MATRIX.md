# Permissions Matrix - Mini HRMS

This document lists all available modules, features, and actions within the system. These are used in the `Permission` model to grant access via `role: name` or `user: employeeID`.

## 1. Module: `attendance` (Status: ✅ Active)
*Feature for tracking daily attendance and GPS-verified events.*

| Feature | Actions | Description | Mapped Routes |
| :--- | :--- | :--- | :--- |
| `tracking` | `view` | View personal attendance history. | `GET /attendance/` |
| | `clock` | Perform Clock-In and Clock-Out actions. | `PUT /attendance/` |
| | `manage` | Manual corrections and admin log viewing. | `GET /attendance/logs`, `POST /attendance/correction` |
| | `verify` | Bulk verification (Check-Marks) workflow. | `POST /attendance/verify` |

---

## 2. Module: `leaves` (Status: ⏳ Planned)
*Feature for managing leave applications and holiday calendars.*

| Feature | Actions | Description |
| :--- | :--- | :--- |
| `requests` | `view` | View personal/team leave applications. |
| | `apply` | Submit a new leave application. |
| | `approve` | Approve or Reject pending leave requests. |
| | `manage` | Administrative control over leave balances. |
| `holidays` | `view` | View the company holiday calendar. |
| | `manage` | Add or update company-wide holidays. |

---

## 3. Module: `users` (Status: ✅ Active)
*Feature for managing employee profiles and self-service.*

| Feature | Actions | Description | Mapped Routes |
| :--- | :--- | :--- | :--- |
| `profiles` | `view` | View employee list or personal profile. | `GET /auth/users`, `GET /auth/me` |
| | `manage` | Admin control: Reset pass, Roles, Status, Activation. | `PATCH /auth/users/:id/*`, `POST /auth/users/:id/reset-password` |
| | `ess` | Access to self-service docs (Salary slips, Letters). | `GET /employees/:id/documents` |
| | `onboard` | Access to the onboarding wizard/profile completion. | `PUT /auth/me` |

---

## 4. Module: `organization` (Status: ✅ Active)
*Feature for configuring the company structure.*

| Feature | Actions | Description | Mapped Routes |
| :--- | :--- | :--- | :--- |
| `structure` | `view` | View branches, departments, and designations. | `GET /organization/branches`, `/departments`, `/designations` |
| | `manage` | Add, update, or delete organizational entities. | `POST/PUT/DELETE /organization/*` |

---

## 5. Module: `config` (Status: ✅ Active)
*Feature for system-wide policies and settings.*

| Feature | Actions | Description | Mapped Routes |
| :--- | :--- | :--- | :--- |
| `policies` | `view` | View current system configuration, Roles, Permissions. | `GET /auth/roles`, `GET /auth/permissions` |
| | `manage` | Update policies and RBAC mappings. | `POST/PUT/DELETE /auth/roles`, `/auth/permissions` |

---

## Implementation Note
When querying via the `permission` guard:
```javascript
permissionGuard("module", "feature", "action")
```
Example:
```javascript
permissionGuard("attendance", "tracking", "verify")
```
