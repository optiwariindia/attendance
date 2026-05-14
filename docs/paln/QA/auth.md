# Auth QA Plan

## Scope
Authentication covers login page availability, required field validation, invalid credential handling, successful employee login, successful admin login, session loading, and logout.

## Test Approach
- Use Playwright as a black-box browser test runner against the Dockerized website.
- Base URL comes from `E2E_BASE_URL`; default is `https://attendance.sampledge.duckdns.org`.
- Valid users are injected through environment variables, not hard-coded in tests.
- Run on Chromium, Firefox, and mobile Chromium on Ubuntu.

## Automated Cases
- Login page renders with username and password fields.
- Empty login submit shows required field validation.
- Invalid login stays on `/` and does not enter member routes.
- Employee credentials redirect to `/user` dashboard.
- Admin credentials can enter protected admin routes through the same login flow.

## Data Needed
- `E2E_USER_USERNAME`
- `E2E_USER_PASSWORD`
- `E2E_ADMIN_USERNAME`
- `E2E_ADMIN_PASSWORD`

## Risks
- If seed data changes, successful login tests will skip unless matching env credentials are provided.
- Error message text may vary by backend; invalid login assertion focuses mainly on staying on login.
