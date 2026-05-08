# Pricing Strategy - Mini HRMS (SaaS Edition)

This document outlines the proposed monetization models for the Mini HRMS SaaS platform. These strategies are designed to be discussed and finalized with the Sales and Marketing teams.

## 1. Subscription Models

### A. Per-User (Seat) Pricing
- **Description:** Charge a fixed fee per active employee per month/year.
- **Logic:** Scalable revenue that grows automatically as the client company expands.
- **Technical Requirement:** Billing logic linked to the active user count in the `user` module.

### B. Tiered Feature Plans
- **Basic (Core Attendance):** GPS Clock-in/out, Daily Dashboard, Basic Profiles.
- **Professional (Full HRMS):** Leave Management, Holiday Calendar, Mandatory Onboarding, ESS (Document Downloads).
- **Enterprise (Advanced Compliance):** Geofencing, Admin Verification (Check-marks), Advanced Reporting, Audit Trails.

## 2. Usage & Value-Based Add-ons

### C. Site/Branch-Based Pricing
- **Description:** Limits on the number of Branches (Sites) a tenant can create.
- **Value:** Ideal for research firms managing multiple field sites simultaneously.

### D. Geofencing Premium
- **Description:** Charging an additional fee for real-time geographic boundary enforcement.
- **Value:** High-value feature for ensuring researchers are physically present at field locations.

### E. Storage-Based Tiers
- **Description:** Tiered storage limits for employee documents (IDs, Contracts, Salary Slips).
- **Logic:** Base storage (e.g., 2GB) included; premium tiers for long-term document archiving.

## 3. Specialized Fieldwork Pricing

### F. Active-User Model (Seasonal)
- **Description:** Charge only for users who have recorded at least one attendance event in the billing cycle.
- **Value:** Highly attractive for fieldwork solutions with seasonal or project-based hiring.

## 4. Technical Integration Points
- **Tenant Plan Mapping:** Each `tenant` record will store a `planID` and `status`.
- **Feature Flags:** The backend and frontend will use feature flags to enable/disable modules based on the subscription tier.
- **Billing Middleware:** A dedicated service to track usage metrics (user count, storage used, active branches) for automated invoicing.

---
**Note:** Final pricing points and bundles to be defined in collaboration with the Sales Team.
