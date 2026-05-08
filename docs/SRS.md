# Software Requirements Specification (SRS) - Mini HRMS

## 1. Introduction
### 1.1 Purpose
The purpose of this document is to provide a detailed description of the Mini Human Resource Management System (HRMS). This system is designed to streamline HR operations specifically for frequent research fieldwork solutions, focusing on attendance tracking, shift management, leave processing, and employee records.

### 1.2 Scope
The Mini HRMS is a web-based application that allows employees to record their attendance via GPS-enabled clock-in/out features and manage their leave requests. Administrators can manage employee data, configure organizational structures, set shift policies, and generate attendance reports.

## 2. Overall Description
### 2.1 User Classes and Characteristics
*   **Employee (User):** Can clock in/out, view personal attendance history, and apply for leaves.
*   **Administrator (Admin):** Has full access to the system, including user management, organizational settings, leave approvals, and manual attendance corrections.

### 2.2 Operating Environment
*   **Infrastructure:** Dockerized environment for both development and production.
*   **Frontend:** React.js (SPA) with Material UI, modular structure.
*   **Backend:** Node.js (Express) serving the frontend assets.
*   **Mobile:** Native Android/iOS via Capacitor.js.

## 3. Functional Requirements

### 3.1 Authentication & Authorization
*   **Secure Login:** JWT-based authentication via `httpOnly` secure cookies.
*   **PBAC (Permission-Based Access Control):** Granular access control at the module, feature, and action levels, allowing for dynamic role/user-based permissions without code changes.
*   **Multi-tenant Isolation:** Strict data separation at the database and middleware levels using the `origin` identifier.
*   **Password Policies:** Secure hashing via `bcryptjs` on the backend.

### 3.2 GPS-Verified Attendance (Fieldwork Focused)
*   **Precision Tracking:** Capture Latitude, Longitude, and Accuracy level using high-accuracy mode.
*   **Geo-tagging:** Automatically link GPS coordinates to every 'Clock In' and 'Clock Out' event.
*   **Timestamp Integrity:** Use server-side timestamps for recording events to prevent local device time manipulation.
*   **Audit Trail:** Maintain a history of location data for audit and verification purposes.

### 3.3 Attendance Management & Verification
*   **Real-time Synchronization:** Immediate update of attendance status across admin panels.
*   **Manual Adjustments:** Admins can override or add attendance records with mandatory 'Reason for Change' logging.
*   **Shift-based Validation:** Automatic calculation of 'Late In', 'Early Out', and 'Overtime' based on the assigned Shift Policy.
*   **Check-Marks Workflow:** A multi-step verification process where admins 'Verify' marks before they are finalized for payroll/reporting.

### 3.4 Leave & Holiday Management
*   **Dynamic Leave Types:** Support for Sick Leave, Casual Leave, Earned Leave, etc.
*   **Balance Tracking:** (Proposed) Real-time tracking of available leave balances.
*   **Holiday Calendar:** A centralized calendar to manage public and company holidays.
*   **Holiday List Management:** Admins can define and manage a list of company-wide holidays.
*   **Calendar Integration:** Holidays should be automatically excluded from attendance status calculations and leave duration calculations.

### 3.5 Organizational & Policy Configuration
*   **Multi-Branch Support:** Configure settings for different geographic locations.
*   **Flexible Shift Policies:** Define grace periods (e.g., 15 mins late allowance) and half-day thresholds.
*   **Reporting Hierarchy:** Define 'Reporting To' relationships for leave approvals and team management.

### 3.6 Notifications & Communication
*   **Web Push Notifications:** Real-time alerts for leave approvals, status changes, and system announcements.
*   **Connectivity Alerts:** Visual feedback (Popups) when server connection is lost, ensuring users are aware of synchronization status.

## 4. Non-Functional Requirements

### 4.1 Performance & Scalability
*   **Response Time:** API responses for clock-in/out should be under 500ms to ensure smooth field use.
*   **Concurrency:** Support for hundreds of simultaneous clock-ins during shift start times.
*   **Lightweight Payload:** Minimize data transfer for field workers on limited or 3G/4G connections.

### 4.2 Security & Data Privacy
*   **Data Encryption:** Use HTTPS for all communications; encrypt sensitive employee data at rest.
*   **Location Privacy:** GPS data must only be captured during explicit attendance actions (no background tracking without consent).
*   **Session Management:** Automatic session expiration and secure token handling.

### 4.3 Reliability & Availability
*   **Offline Resilience:** Graceful handling of network failures; visual indicators for "Connection Lost".
*   **Data Integrity:** Ensure no duplicate attendance records can be created for the same shift/user.

### 4.4 Usability & Accessibility
*   **Mobile-First Design:** Responsive UI optimized for one-handed use on mobile devices.
*   **Intuitive Feedback:** Clear color-coded status (Success/Error) and action-oriented buttons.
*   **Cross-Browser Compatibility:** Support for latest versions of Chrome, Safari, and Firefox.

### 4.5 Maintainability
*   **Modular Architecture:** Separation of concerns between UI components, hooks, and API utilities.
*   **Centralized Configuration:** Use of settings panels for easy adjustment of organizational policies without code changes.

## 5. Ideal & Future Requirements
*   **Automated Reports:** Generate and export attendance and leave reports in PDF/Excel formats.
*   **Push Notifications:** Integration of Web Push Notifications for leave approvals and attendance reminders.
*   **Mobile App Integration:** Native mobile application (Android/iOS) developed using **Capacitor.js** to wrap the React SPA, providing access to native GPS and push notification APIs.
*   **Dynamic Shift Scheduling:** Ability to assign shifts to employees on a weekly or monthly basis.
*   **Payroll Integration:** Basic salary calculation based on attendance and leave records.
*   **Document Management:** Upload and manage employee documents (Identity proofs, contracts, etc.).
*   **Face Recognition / Biometric:** Integration with biometric devices or face recognition for verified attendance.

## 6. System Architecture (High Level)
The system follows a **Containerized Modular Monolith** architecture:
*   **Encapsulation:** All services run within Docker containers.
*   **Unified Serving:** The Express backend serves the React SPA assets and provides a fallback to `/` for all undefined routes.
*   **Modular Design:** Both Frontend and Backend are organized into domain-specific modules (Auth, Attendance, Leave, etc.).
*   **Mobile Sync:** Capacitor.js integrates the SPA build into native mobile platforms.
