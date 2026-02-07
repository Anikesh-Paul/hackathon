# API Contracts

This document defines the service-level API used by the frontend.
UI components MUST call only these functions.

---

## Auth Services

### login
- Caller: Admin
- Input:
  - email: string
  - password: string
- Returns:
  - Promise<void>

---

### logout
- Caller: Admin
- Input: none
- Returns:
  - Promise<void>

---

### getCurrentUser
- Caller: Admin
- Input: none
- Returns:
  - Promise<AdminUser | null>

---

## Complaint Services

### createComplaint
- Caller: Anonymous user
- Input:
  - title: string
  - description: string
  - category?: string
- Returns:
  - Promise<{ trackingId: string, recoveryPhrase: string }>
- Note: Generates a 4-word recovery phrase alongside the tracking ID. Both are returned only once.

---

### recoverByPhrase
- Caller: Anonymous user
- Input:
  - phrase: string (case-insensitive, dash-separated)
- Returns:
  - Promise<{ trackingId: string } | null>
- Note: Looks up a complaint by its recovery phrase and returns only the tracking ID. Returns null if not found. Does NOT expose any other complaint data.

---

### getComplaintByTrackingId
- Caller: Admin
- Input:
  - trackingId: string
- Returns:
  - Promise<Complaint | null>

---

### listComplaints
- Caller: Admin
- Input:
  - filters?: object
- Returns:
  - Promise<Complaint[]>

---

### updateComplaintStatus
- Caller: Admin
- Input:
  - id: string
  - status: "pending" | "reviewing" | "resolved" | "dismissed"
- Returns:
  - Promise<{ statusHistory: Array<{ status: string, timestamp: string }> }>
- Note: Updates complaint status and creates a new entry in the status-history collection.

---

### getStatusHistory
- Caller: Admin
- Input:
  - complaintId: string
- Returns:
  - Promise<Array<{ status: string, timestamp: string }>>
- Note: Fetches all status history entries for a complaint by document ID.

---

### getStatusHistoryByTrackingId
- Caller: Anonymous user
- Input:
  - trackingId: string
- Returns:
  - Promise<Array<{ status: string, timestamp: string }>>
- Note: Fetches all status history entries for a complaint by tracking ID.

---

### addAdminNote
- Caller: Admin
- Input:
  - id: string
  - note: string
- Returns:
  - Promise<void>
- Note: Internal only — never exposed to anonymous users.

---

### updatePublicMessage
- Caller: Admin
- Input:
  - id: string
  - message: string
- Returns:
  - Promise<void>
- Note: This message is visible to anonymous users when tracking complaints.

---

### sendFollowUp
- Caller: Admin or Anonymous user
- Input:
  - complaintId?: string (required for admin, optional for anonymous)
  - trackingId: string
  - sender: "admin" | "anonymous"
  - message: string (max 2000 chars)
- Returns:
  - Promise<{ id: string, sender: string, message: string, timestamp: string }>
- Note: Creates a new follow-up message. Anonymous users are rate-limited (60s cooldown) on the frontend.

---

### getFollowUps
- Caller: Admin
- Input:
  - complaintId: string
- Returns:
  - Promise<Array<{ id: string, sender: string, message: string, timestamp: string }>>
- Note: Fetches all follow-up messages for a complaint by document ID.

---

### getFollowUpsByTrackingId
- Caller: Anonymous user
- Input:
  - trackingId: string
- Returns:
  - Promise<Array<{ id: string, sender: string, message: string, timestamp: string }>>
- Note: Fetches all follow-up messages for a complaint by tracking ID.

---

## Rules
- UI must NOT use Appwrite SDK directly.
- UI must NOT modify returned objects.
- No new API functions without updating this document.
