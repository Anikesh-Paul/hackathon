## Plan: Whistleblower Architecture (Hackathon)

**TL;DR**: Two-role system (anonymous submitters, authenticated admins) using React + Appwrite. Anonymous users submit complaints via public endpoint; admins authenticate and manage via dashboard. All Appwrite logic isolated in `/services` layer. Prioritizes demo-readiness over polish.

---

## 1. High-Level System Architecture

- **Frontend**: React (Vite) SPA
  - Public routes: complaint form, submission confirmation
  - Protected routes: admin login, admin dashboard
- **Backend**: Appwrite Cloud/Self-hosted
  - Auth: Email/password (admin only)
  - Database: Single `complaints` collection
  - Storage: File attachments bucket (optional, time permitting)
- **Data Flow**:
  - Anonymous → Service Layer → Appwrite DB (guest permissions)
  - Admin → Auth → Service Layer → Appwrite DB (role-based)

---

## 2. React App Folder Structure

```
src/
├── components/
│   ├── ComplaintForm.jsx       # Anonymous submission form
│   ├── ComplaintCard.jsx       # Single complaint display (admin)
│   ├── ComplaintList.jsx       # List wrapper (admin)
│   ├── StatusBadge.jsx         # Status indicator
│   └── ProtectedRoute.jsx      # Auth guard wrapper
├── pages/
│   ├── SubmitPage.jsx          # Public: complaint form
│   ├── ConfirmationPage.jsx    # Public: success message + tracking ID
│   ├── LoginPage.jsx           # Admin login
│   └── DashboardPage.jsx       # Admin complaint management
├── services/
│   ├── appwrite.js             # Appwrite client init
│   ├── complaintService.js     # CRUD for complaints
│   └── authService.js          # Admin auth functions
├── context/
│   └── AuthContext.jsx         # Admin auth state (optional)
├── hooks/
│   └── useAuth.js              # Auth state hook
├── App.jsx                     # Router setup
├── main.jsx                    # Entry point
└── config.js                   # Appwrite endpoint/project IDs
```

---

## 3. Appwrite Setup

### Required Services

- **Authentication**: Email/password (admins only)
- **Database**: 1 database, 1 collection
- **Storage**: 1 bucket (optional, for attachments)

### Collections

#### `complaints`

| Attribute     | Type          | Required | Notes                       |
| ------------- | ------------- | -------- | --------------------------- |
| `trackingId`  | string (36)   | Yes      | UUID for anonymous tracking |
| `title`       | string (100)  | Yes      | Brief subject               |
| `description` | string (5000) | Yes      | Full complaint text         |
| `category`    | string (50)   | No       | e.g., "harassment", "fraud" |
| `status`      | string (20)   | Yes      | Default: "pending"          |
| `adminNotes`  | string (2000) | No       | Internal notes              |
| `createdAt`   | datetime      | Yes      | Auto-set                    |
| `updatedAt`   | datetime      | No       | Auto-set on update          |

**Status values**: `pending` | `reviewing` | `resolved` | `dismissed`

### Permissions Strategy

| Role                | Create | Read | Update | Delete |
| ------------------- | ------ | ---- | ------ | ------ |
| Guests (anonymous)  | ✅     | ❌   | ❌     | ❌     |
| Admins (role:admin) | ✅     | ✅   | ✅     | ❌     |

- **Why no delete**: Audit trail integrity
- **Guest create**: Enables anonymous submission without auth
- **Implementation**: Use Appwrite's `Permission.create(Role.guests())` + `Permission.read(Role.team("admin"))`

---

## 4. Data Models

### Complaint

```
{
  $id: string              // Appwrite doc ID
  trackingId: string       // Public-facing UUID
  title: string
  description: string
  category: string | null
  status: "pending" | "reviewing" | "resolved" | "dismissed"
  adminNotes: string | null
  createdAt: ISO8601
  updatedAt: ISO8601 | null
}
```

### Admin User (Minimal)

```
{
  $id: string              // Appwrite user ID
  email: string
  // No custom attributes needed — use Appwrite's built-in auth
  // Team membership: "admin" team for role-based access
}
```

---

## 5. Service Function List

### `authService.js`

| Function                 | Purpose                      |
| ------------------------ | ---------------------------- |
| `login(email, password)` | Admin login, returns session |
| `logout()`               | End admin session            |
| `getCurrentUser()`       | Get logged-in admin or null  |

### `complaintService.js`

| Function                               | Purpose                        |
| -------------------------------------- | ------------------------------ |
| `createComplaint(data)`                | Submit new complaint (guest)   |
| `getComplaintByTrackingId(trackingId)` | Fetch single complaint (admin) |
| `listComplaints(filters?)`             | List all complaints (admin)    |
| `updateComplaintStatus(id, status)`    | Change status (admin)          |
| `addAdminNote(id, note)`               | Append notes (admin)           |

---

## 6. Core User Flows

### Flow 1: Anonymous Complaint Submission

1. User visits `/submit`
2. Fills `ComplaintForm` (title, description, category)
3. Component calls `complaintService.createComplaint()`
4. Service generates UUID `trackingId`, POSTs to Appwrite
5. Redirect to `/confirmation/:trackingId`
6. User sees tracking ID (copy/save for later)

### Flow 2: Admin Login

1. Admin visits `/login`
2. Enters email/password
3. Component calls `authService.login()`
4. On success: store session in context, redirect to `/dashboard`
5. On failure: show error message

### Flow 3: Admin Dashboard View

1. Admin navigates to `/dashboard` (protected route)
2. `DashboardPage` calls `complaintService.listComplaints()`
3. Renders `ComplaintList` → `ComplaintCard` for each
4. Cards show: title, category, status badge, created date
5. Click card → expand details + admin notes

### Flow 4: Status Update

1. Admin clicks status dropdown on `ComplaintCard`
2. Selects new status (reviewing/resolved/dismissed)
3. Component calls `complaintService.updateComplaintStatus(id, newStatus)`
4. UI updates optimistically, confirms on success

---

## 7. Explicit NON-GOALS

**NOT building:**

- ❌ User registration (only pre-seeded admins)
- ❌ Email notifications
- ❌ File attachments (defer unless time permits)
- ❌ Real-time updates (polling only if needed)
- ❌ Search/filter on dashboard (list all, manual scroll)
- ❌ Complaint editing by submitter
- ❌ Multi-language support
- ❌ Accessibility audit (basic semantic HTML only)
- ❌ Mobile-responsive refinement (basic Tailwind responsiveness)
- ❌ Rate limiting (rely on Appwrite defaults)

---

## 8. Assumptions (Hackathon Constraints)

1. **Single admin account**: Pre-created in Appwrite console, no registration flow
2. **No encryption beyond HTTPS**: Complaint content stored in plain text
3. **Tracking ID as security**: Obscurity-based access (acceptable for demo)
4. **Appwrite Cloud**: Faster setup than self-hosted
5. **No CSS framework setup**: Direct Tailwind CDN in `index.html`
6. **No testing**: Manual QA only
7. **No CI/CD**: Local dev → manual deploy (Vercel/Netlify)
8. **Categories hardcoded**: Static list in frontend, not DB-driven
9. **Session persistence**: Rely on Appwrite's default session handling
10. **Error handling**: Basic try/catch with console logs + user alerts

---

## Unresolved Questions

1. **Anonymous status lookup**: Should submitters be able to check status via tracking ID? (Adds 1 extra route + service method)
2. **Attachments**: Worth the 15-min setup? (Appwrite Storage bucket + upload component)
3. **Admin team setup**: Create team in console manually, or script it?
4. **Deployment target**: Vercel (simpler) or Netlify?
