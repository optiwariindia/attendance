Events in this Human Resource Management System (HRMS) can be categorized into several domains, each representing a specific area of HR operations. Below are the key events for each domain:
    Employee Management:
        - EmployeeCreated: Triggered when a new employee is added to the system.
        - EmployeeUpdated: Triggered when an existing employee's information is updated.
        - EmployeeDeleted: Triggered when an employee is removed from the system.
        - EmployeeOffboardingInitiated: Triggered when the offboarding process is initiated for an employee.
        - EmployeeOffboardingCompleted: Triggered when the offboarding process is completed for an employee.
        - EmployeeDepartmentChanged: Triggered when an employee's department is changed.
        - EmployeeRoleChanged: Triggered when an employee's role is changed.
        - EmployeePromotion: Triggered when an employee is promoted to a higher position.
        - EmployeeCompensationChanged: Triggered when an employee's compensation is updated.
        - EmployeeStatusChanged: Triggered when an employee's status (e.g., active, on leave, terminated) is changed.
    Leave Management:
        - LeaveRequestSubmitted: Triggered when an employee submits a leave request.
        - LeaveRequestApproved: Triggered when a leave request is approved by the manager.
        - LeaveRequestRejected: Triggered when a leave request is rejected by the manager.
        - LeaveRequestCancelled: Triggered when an employee cancels a previously submitted leave request.
        - LeaveBalanceUpdated: Triggered when an employee's leave balance is updated after a leave request is processed.
    Time and Attendance:
        - TimeEntrySubmitted: Triggered when an employee submits a time entry.
        - TimeEntryApproved: Triggered when a time entry is approved by the manager.
        - TimeEntryRejected: Triggered when a time entry is rejected by the manager.
        - LateArrivalRecorded: Triggered when an employee records a late arrival.
        - EarlyDepartureRecorded: Triggered when an employee records an early departure.
    Shift Time Management:
        - ShiftScheduled: Triggered when a shift is scheduled for an employee.
        - ShiftUpdated: Triggered when a scheduled shift is updated.
        - ShiftCancelled: Triggered when a scheduled shift is cancelled.
----------------------
Notification Methods:
    - EmailNotification: Sends notifications via email to employees and managers. (NodeMailer)
    - InAppNotification: Displays notifications within the HRMS application for employees and managers. (SSE)
    - PushNotification: Sends push notifications to mobile devices for employees and managers. (Web Push API)
    - SMSNotification: Sends notifications via SMS to employees and managers. (to be decided)
    - WhatsappNotification: Sends notifications via WhatsApp to employees and managers. (whatsapp-js)