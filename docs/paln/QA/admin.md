# Admin QA Plan

## Scope
Admin coverage includes protected route access, admin navigation, settings access, user-management readiness, leave management readiness, and reporting/check-mark workflow placeholders from SRS.

## Test Approach
- Use admin login in Playwright.
- Start with route and navigation smoke tests.
- Add deeper CRUD and approval tests after stable seed fixtures exist.

## Automated Cases
- Admin credentials can login through the common login page.
- Admin can open `/admin/settings`.
- Admin-only settings tabs are visible.
- Admin can navigate between settings modules.

## Planned Cases
- User management: add employee, deactivate employee, reset password.
- Leave approval: list pending leaves, approve/reject with comment.
- Attendance verification: filter logs, select records, verify check-marks.
- Reports: open monthly attendance report and verify generated columns.

## Data Needed
- Admin test account.
- Employee fixture account.
- Pending leave fixture for approval flow.
- Attendance records fixture for verification/reporting.

## Risks
- Some admin routes listed in docs are future/planned and may not exist yet.
- Tests should separate current implemented routes from roadmap workflows.
