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
| recoveryPhrase | string | no      | 4-word dash-separated phrase for ID recovery. Shown once at submission. |
| adminNotes  | string   | no       | Internal admin-only notes (never shown to anonymous users) |
| publicMessage | string | no       | Public message visible to anonymous users via tracking |
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

---

## StatusHistoryEntry (Collection: status-history)

| Field Name   | Type   | Required | Notes |
|------------|--------|----------|-------|
| id          | string | yes      | Appwrite document ID |
| complaintId | string | yes      | References Complaint document ID |
| trackingId  | string | yes      | References Complaint trackingId (for anonymous lookups) |
| status      | string | yes      | pending \| reviewing \| resolved \| dismissed |
| timestamp   | string | yes      | ISO 8601 datetime of the status change |

### Notes
- Each status change creates a new document.
- Old complaints without history entries still work (empty timeline with fallback).
- Indexed on `complaintId` and `trackingId` for fast lookups.

---

## FollowUpMessage (Collection: follow-ups)

| Field Name   | Type   | Required | Notes |
|------------|--------|----------|-------|
| id          | string | yes      | Appwrite document ID |
| complaintId | string | yes      | References Complaint document ID |
| trackingId  | string | yes      | References Complaint trackingId (for anonymous lookups) |
| sender      | string | yes      | "admin" or "anonymous" |
| message     | string | yes      | Text-only reply, max 2000 chars |
| timestamp   | string | yes      | ISO 8601 datetime |

### Notes
- No identity is stored for anonymous senders.
- Text-only — no attachments allowed.
- Frontend rate-limited: anonymous users can reply once per 60 seconds.
- Indexed on `complaintId` and `trackingId` for fast lookups.
