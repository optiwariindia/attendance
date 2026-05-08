# API Contract - Mini HRMS (Attendance System)

## Base URL
`https://{tenant-domain}/api/v1`

All requests should be sent to the tenant-specific domain. The backend will identify the tenant based on the `host` header.

## Authentication
Authentication is handled via JWT tokens. The token should be included in the `Authorization` header of all protected requests.

**Header:** `Authorization: Bearer <token>`

## Common Response Format
```json
{
  "status": "success" | "error",
  "message": "string", // Optional for success, mandatory for error
  "data": {} | [], // The payload
  "pagination": { // Only for list endpoints
    "page": number,
    "limit": number,
    "total": number,
    "pages": number
  }
}
```

---

## 1. Auth Module (`/auth`)

### Register (Company Self-Onboarding)
`POST /auth/register`
*   **Purpose:** Register a new company (tenant).
*   **Body:**
    ```json
    {
      "companyName": "string",
      "adminEmail": "string",
      "adminPassword": "string",
      "domain": "string" // The subdomain or domain assigned to this tenant
    }
    ```
*   **Response (201):** `{ "status": "success", "message": "Company registered successfully" }`

### Login
`POST /auth/login`
*   **Purpose:** Authenticate a user and receive a JWT.
*   **Body:**
    ```json
    {
      "username": "string", // Email or Employee ID
      "password": "string"
    }
    ```
*   **Response (200):** 
    ```json
    {
      "status": "success",
      "token": "string",
      "user": {
        "id": "string",
        "employeeID": "string",
        "name": "string",
        "role": "admin" | "user",
        "tenantID": "string"
      }
    }
    ```

### Get Current User Profile
`GET /auth/me`
*   **Purpose:** Get details of the authenticated user.
*   **Response (200):**
    ```json
    {
      "status": "success",
      "data": {
        "id": "string",
        "employeeID": "string",
        "name": "string",
        "email": "string",
        "role": "admin" | "user",
        "branch": { "id": "string", "name": "string" },
        "department": "string",
        "designation": "string",
        "profileComplete": boolean,
        "onboardingStatus": "pending" | "completed"
      }
    }
    ```

---

## 2. Attendance Module (`/attendance`)

### Get Attendance History (Personal)
`GET /attendance`
*   **Purpose:** Fetch attendance history for the logged-in user.
*   **Query Params:** `page`, `limit`, `startDate`, `endDate`
*   **Response (200):**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": "string",
          "action": "in" | "out",
          "timestamp": "ISO Date String",
          "gps": { "lat": number, "lng": number, "accuracy": number },
          "status": "On Time" | "Late In" | "Early Out" | "Overtime",
          "verified": boolean
        }
      ],
      "pagination": { ... }
    }
    ```

### Clock In/Out
`PUT /attendance`
*   **Purpose:** Record a clock-in or clock-out event.
*   **Body:**
    ```json
    {
      "type": "in" | "out",
      "gps": {
        "lat": number,
        "lng": number,
        "accuracy": number
      }
    }
    ```
*   **Response (200):** `{ "status": "success", "message": "Attendance recorded" }`

### Get Server Time
`GET /attendance/time`
*   **Purpose:** Get the current server time to prevent client-side time manipulation.
*   **Response (200):** `{ "status": "success", "serverTime": "ISO Date String" }`

### Get All Attendance Logs (Admin)
`GET /attendance/logs`
*   **Purpose:** List all attendance records for the tenant.
*   **Query Params:** `employeeID`, `branchID`, `startDate`, `endDate`, `status`, `page`, `limit`
*   **Response (200):** List of attendance objects with `employee` details.

### Verify Attendance Marks (Admin)
`POST /attendance/verify`
*   **Purpose:** Bulk-verify attendance records.
*   **Body:** `{ "ids": ["string"] }`
*   **Response (200):** `{ "status": "success" }`

---

## 3. Leave & Holiday Module (`/leaves`)

### Get Holiday List
`GET /leaves/holidays`
*   **Query Params:** `year`
*   **Response (200):**
    ```json
    {
      "status": "success",
      "data": [
        { "id": "string", "name": "string", "date": "YYYY-MM-DD", "type": "public" | "company" }
      ]
    }
    ```

### Apply for Leave
`POST /leaves/applications`
*   **Purpose:** Submit a new leave request.
*   **Body:**
    ```json
    {
      "leaveType": "sick" | "casual" | "earned",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "reason": "string"
    }
    ```
*   **Response (201):** `{ "status": "success", "applicationID": "string" }`

### Manage Leave Applications (Admin/Approver)
`GET /leaves/pending`
*   **Purpose:** List all pending leave requests for approval.
*   **Response (200):** List of leave applications.

`PUT /leaves/applications/:id/status`
*   **Purpose:** Approve or reject a leave application.
*   **Body:** `{ "status": "approved" | "rejected", "comment": "string" }`
*   **Response (200):** `{ "status": "success" }`

### Get Leave Balances
`GET /leaves/balances`
*   **Response (200):**
    ```json
    {
      "status": "success",
      "data": {
        "sick": { "total": number, "used": number, "available": number },
        "casual": { "total": number, "used": number, "available": number },
        "earned": { "total": number, "used": number, "available": number }
      }
    }
    ```

---

## 4. Organization Module (`/org`)

### Manage Branches (Sites)
`GET /org/branches`
`POST /org/branches`
`GET /org/branches/:id`
`PUT /org/branches/:id`
`DELETE /org/branches/:id`
*   **Geofencing Metadata:**
    ```json
    {
      "name": "string",
      "address": "string",
      "geofence": {
        "center": { "lat": number, "lng": number },
        "radius": number // meters
      }
    }
    ```

---

## 5. Employee Module (`/employees`)

### List Employees (Admin)
`GET /employees`
*   **Query Params:** `branchID`, `department`, `page`, `limit`
*   **Response (200):** List of employee summaries.

### Get/Update Employee Profile (Admin/Self)
`GET /employees/:id`
`PUT /employees/:id`
*   **Body:**
    ```json
    {
      "name": "string",
      "email": "string",
      "phone": "string",
      "bankDetails": {
        "accountNumber": "string",
        "ifsc": "string",
        "bankName": "string"
      },
      "emergencyContact": {
        "name": "string",
        "phone": "string",
        "relationship": "string"
      }
    }
    ```

### Get Salary Slips / Documents (ESS)
`GET /employees/:id/documents`
*   **Response (200):** List of available documents (Appointment Letter, Salary Slip May 2026, etc.)

`GET /employees/:id/documents/:docID/download`
*   **Purpose:** Securely download a specific document.
*   **Response:** File stream.

---

## 6. Settings Module (`/settings`)

### Get/Update Tenant Configuration
`GET /settings/config`
`PUT /settings/config`
*   **Purpose:** Manage grace periods, shift timings, and other policy settings.
*   **Data Schema:**
    ```json
    {
      "gracePeriod": number, // minutes
      "halfDayThreshold": number, // hours
      "shiftStart": "HH:mm",
      "shiftEnd": "HH:mm"
    }
    ```

---

## Common Error Codes
*   `400 Bad Request`: Validation errors.
*   `401 Unauthorized`: Missing or invalid token.
*   `403 Forbidden`: Insufficient permissions (RBAC).
*   `404 Not Found`: Resource not found.
*   `500 Internal Server Error`: Generic server error.
