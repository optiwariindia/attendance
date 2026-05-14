# Leaves QA Plan

## Scope
Leaves covers employee leave list, leave status visibility, application form opening, required form fields, attachment control presence, and cancel/back navigation.

## Test Approach
- Use Playwright after employee login.
- Keep normal automated tests non-mutating.
- Validate that the user can reach the form and interact with main controls without submitting real leave requests.

## Automated Cases
- `/user/leave` opens for an employee.
- My Leaves table is visible with Request Date and Approval Status.
- Apply opens the Leave Application Form.
- Form shows recipient, leave type, date fields, description, reason, attachment, Cancel, and Submit controls.
- Cancel returns to My Leaves.

## Data Needed
- Employee test account.
- Existing leave records are optional; tests assert table and form structure, not exact row count.

## Risks
- Date picker rendering can vary by viewport; assertions avoid brittle calendar internals.
- Submit behavior should be added after backend leave workflow is finalized and test tenant data is available.
