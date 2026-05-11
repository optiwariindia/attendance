# Technical Debt & Implementation Gaps

This document tracks discrepancies between the current implementation and the planned architecture/API contract, as well as areas requiring refactoring or further development.

## 1. API Contract Discrepancies
- **Auth Module:**
    - `POST /auth/register` (Company Self-Onboarding) is defined in the contract but implementation details (Tenant creation logic) are currently simplified or handled via seeders.
    - `GET /auth/me` response structure in code uses `_id` and nested `name` object, while contract specifies `id` and flat fields.
- **Attendance Module:**
    - `PUT /attendance` (Clock In/Out) implementation uses `type` in body, contract uses `type` but refers to it as `action` in some descriptions. Implementation uses GeoJSON `Point` for GPS, while contract implies a flatter structure.
- **Organization Module:**
    - Routes are mounted under `/api/v1/organization` but contract uses `/org`.
    - Geofencing implementation in `Branch` model uses `location` (Point) and `radius`, while contract specifies a `geofence` object with `center` and `radius`.

## 2. Infrastructure & Patterns
- **Origin Identification:** `server.js` currently uses `req.headers.host` for `setOrigin`. This should be refined to support `referer` or explicit `origin` headers for better cross-origin support in development.
- **SSE Connection Management:** SSE connections are currently mapped in-memory. For horizontal scaling, this will need to be transitioned to a shared state (e.g., Redis).
- **Error Handling:** While `asyncHandler` is used, some controllers still throw generic `Error` objects instead of `HttpError` with specific status codes.

## 3. Pending Features (Phase 1)
- **Mandatory Profile Completion:** Logic to block actions until profile is 100% complete is not yet enforced in the `auth` guard.
- **Geofence Enforcement:** Backend supports storing location data, but validation to prevent clock-ins outside the branch radius is not yet active in `AttendanceController`.
- **ESS Document Service:** The file storage and retrieval system for HR letters and salary slips is not yet implemented.
