# Attendance QA Plan

## Scope
Attendance covers employee dashboard, clock-in/out controls, GPS permission flow, attendance history route, date range review, and mutation safeguards.

## Test Approach
- Use Playwright to test the website as a user would use it.
- Default test run is read-mostly: page access, buttons, tables, and layout assertions.
- Clock-in/out mutation runs only when `E2E_ALLOW_MUTATION=true`.
- GPS is simulated through Playwright geolocation permissions for deterministic Ubuntu runs.

## Automated Cases
- Employee logs in and sees dashboard clock actions.
- Dashboard shows Clock In, Clock Out, and announcements.
- Attendance history route `/user/attendance` opens.
- Attendance table headings are visible: Date, In Time, Out Time, Attendance Status, Working Hours.
- With mutation enabled, Clock In sends an attendance API request with browser geolocation.

## Data Needed
- Employee test account with permission for `/user` routes.
- Optional clean attendance state when mutation test is enabled.

## Risks
- Clock In can be disabled depending on current day state; test skips mutation if the app marks it unavailable.
- Real attendance mutation should run only on a disposable test tenant.
