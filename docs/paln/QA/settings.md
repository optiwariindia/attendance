# Settings QA Plan

## Scope
Settings covers admin configuration screens for branches, departments, designations, shift policies, holidays, and leave categories.

## Test Approach
- Use Playwright with admin credentials.
- Validate tab navigation and table visibility first.
- Create/update/delete cases should be guarded behind `E2E_ALLOW_MUTATION=true` once stable test data rules are agreed.

## Automated Cases
- Admin can open `/admin/settings`.
- Settings tabs are visible: Branches, Departments, Designations, Shift Policies, Holidays, Leave Categories.
- Department table opens and displays Department Name.
- Shift Policies table opens and displays Shift Name and Grace columns.

## Future Mutation Cases
- Add, edit, and delete a department with a unique E2E prefix.
- Add, edit, and delete a branch with geofence metadata.
- Add, edit, and delete a shift policy.
- Add, edit, and delete a holiday.
- Add, edit, and delete a leave category.

## Data Needed
- Admin test account.
- Disposable tenant/database or cleanup hooks for mutation tests.

## Risks
- Admin menu and settings routes may change with PBAC permissions; test account must have full settings access.
- Delete tests should not run against production-like tenant data.
