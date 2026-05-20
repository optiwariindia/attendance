**Subject:** Strategic Transition Plan: Migration to Enhanced Attendance & Leave Management System

**Dear Sir,**

I am writing to provide an update on the deployment strategy for our new Attendance and Leave Management application. 

After a thorough technical assessment, I have decided against a direct upgrade of the existing version on the live server. Instead, we are proceeding with a clean, staged deployment of the new architecture. The primary reason for this is that the previous version lacks the foundational data structures required to support our new high-precision features.

To ensure the integrity of our workforce data and the accuracy of our reporting (especially for payroll and compliance), we must first collect and configure the following information, which was **not present or trackable** in the previous system:

1.  **Shift Management:** The new system allows for variable shift timings per branch/department. We need the specific shift hours to enable accurate tracking.
2.  **Reporting Structure:** We have introduced a hierarchical approval engine. We must map every employee to their respective manager to enable leave approvals and attendance audits.
3.  **Late Arrival & Early Leaving Detection:** The new engine automatically flags discipline issues. This requires predefined grace periods and shift start/end buffers that were not previously stored.
4.  **Branch & Geofence Information:** To prevent proxy attendance, we now use GPS verification. We require the precise latitude, longitude, and radius for every physical site.
5.  **WFH (Work From Home) Tracking:** The new system distinguishes between office-based and remote work, ensuring different validation rules apply.
6.  **Leave, Holiday, and Weekly Off Tracking:** Unlike the previous version, the new system maintains live balances and localized holiday calendars. This data must be initialized to prevent errors in employee leave applications.

Furthermore, the new architecture is not backward compatible in all respects due to these significant enhancements. Attempting to "patch" the old server would lead to data inconsistencies and system failures because the legacy database cannot support these advanced modules. 

**Deployment Strategy Update:**
- **Current Access:** I have configured the new system on **https://new-attendance.frequentresearch.com**. Please note that a final server restart is required to publish it on the web, after which the link will be fully accessible.
- **Credential Parity:** I am using the **same credentials** as the current system, so everyone can log in and access the platform immediately without needing new passwords.
- **Go-Live Trigger:** We shall move the platform to the primary domain (**https://attendance.frequentresearch.com**) only once:
    1.  All **historical data** has been successfully migrated.
    2.  All **Shifts** (including grace periods) have been defined.
    3.  All **Users** have been assigned to their respective shifts and reporting managers.

Therefore, we must perform a dedicated migration of historical data into the new schema before moving to the upgraded version, ensuring a seamless transition that preserves past records while enabling the more robust tracking capabilities. By preparing this information now, we ensure that the moment we go live, the system is 100% accurate and provides the management with the deep insights (Late flags, WFH status, Leave balances) that were previously missing.

**Commercial Readiness & Client Onboarding:**
I would also like to inform you that as we begin pitching this product to external clients, each new tenant must provide the following critical configuration data to ensure a successful and automated rollout:
1.  **Branch Geofencing Data:** Precise Latitude/Longitude and required Radius (in meters) for all physical work sites.
2.  **Employee Master Data:** Full list of employees with unique IDs and correct `reportingTo` (Manager) assignments for approval hierarchies.
3.  **Leave Policy Definition:** Entitlement quotas for each leave category (Casual, Sick, Earned, etc.) for the current calendar year.
4.  **Corporate Calendar:** List of gazetted and restricted holidays for the tenant.
5.  **Shift & Weekly-Off Patterns:** Standard working hours and default rest days for different departments.

I will be sharing a data collection template shortly to help us gather this information from each department.

**Regards,**

**Om Prakash Tiwari**

