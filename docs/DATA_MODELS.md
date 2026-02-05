# Data Models

This document defines the final data structures used in the application.
These models are frozen for the duration of the hackathon.

---

## Complaint

| Field Name   | Type     | Required | Notes |
|------------|----------|----------|-------|
| id          | string   | yes      | Appwrite document ID |
| trackingId  | string   | yes      | Public-facing UUID for anonymous tracking |
| title       | string   | yes      | Brief subject |
| description | string   | yes      | Full complaint text |
| category    | string   | no       | e.g. harassment, fraud |
| status      | string   | yes      | pending \| reviewing \| resolved \| dismissed |
| adminNotes  | string   | no       | Internal admin-only notes |
| createdAt  | datetime | yes      | Auto-generated |
| updatedAt  | datetime | no       | Auto-updated on change |

---

## AdminUser

| Field Name | Type   | Required | Notes |
|-----------|--------|----------|-------|
| id        | string | yes      | Appwrite user ID |
| email     | string | yes      | Used for admin authentication |

---

## Notes
- Anonymous users are NOT stored.
- No personal or identifying data is collected.
- Admin role is managed via Appwrite Teams.
