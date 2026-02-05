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
  - Promise<{ trackingId: string }>

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
  - Promise<void>

---

### addAdminNote
- Caller: Admin
- Input:
  - id: string
  - note: string
- Returns:
  - Promise<void>

---

## Rules
- UI must NOT use Appwrite SDK directly.
- UI must NOT modify returned objects.
- No new API functions without updating this document.
