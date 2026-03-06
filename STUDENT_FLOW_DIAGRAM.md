# Student Application to Intern Flow

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    UNIVERSITY SUBMITS APPLICATION                    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND PROCESSING                           │
│  POST /api/applications                                              │
│                                                                       │
│  1. Validate application data                                        │
│  2. Upload CV and Resume files                                       │
│  3. Generate unique application_id                                   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│  universityapplications      │  │  companyapplications         │
│  (Database Table)            │  │  (Database Table)            │
│                              │  │                              │
│  INSERT new record:          │  │  INSERT new record:          │
│  - id: uuid                  │  │  - id: uuid                  │
│  - application_id: shared    │  │  - application_id: shared    │
│  - university_id             │  │  - university_id             │
│  - company_id                │  │  - company_id                │
│  - student info              │  │  - student info              │
│  - status: "pending"         │  │  - status: "pending"         │
└──────────────────────────────┘  └──────────────────────────────┘
                    │                               │
                    ▼                               ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│  UNIVERSITY DASHBOARD        │  │  COMPANY DASHBOARD           │
│  /dashboard/university/      │  │  /dashboard/company/         │
│  application                 │  │  application                 │
│                              │  │                              │
│  Shows ALL applications      │  │  Shows ALL applications      │
│  Status: PENDING             │  │  Status: PENDING             │
│  Auto-refresh: 30s           │  │  Auto-refresh: 30s           │
└──────────────────────────────┘  └──────────────────────────────┘
                                                    │
                                                    ▼
                            ┌───────────────────────────────────────┐
                            │  COMPANY REVIEWS APPLICATION          │
                            │                                       │
                            │  Options:                             │
                            │  1. Accept → status = "accepted"      │
                            │  2. Reject → status = "rejected"      │
                            │  3. Review → status = "under_review"  │
                            │  4. Shortlist → status = "shortlisted"│
                            └───────────────────────────────────────┘
                                                    │
                                    ┌───────────────┴───────────────┐
                                    ▼                               ▼
                    ┌──────────────────────────────┐  ┌──────────────────────────────┐
                    │  UPDATE STATUS               │  │  UPDATE STATUS               │
                    │  universityapplications      │  │  companyapplications         │
                    │                              │  │                              │
                    │  SET status = "accepted"     │  │  SET status = "accepted"     │
                    │  WHERE application_id = X    │  │  WHERE application_id = X    │
                    └──────────────────────────────┘  └──────────────────────────────┘
                                    │                               │
                                    ▼                               ▼
                    ┌──────────────────────────────┐  ┌──────────────────────────────┐
                    │  UNIVERSITY DASHBOARD        │  │  COMPANY DASHBOARD           │
                    │  Status: ACCEPTED ✅         │  │  Status: ACCEPTED ✅         │
                    │  (Auto-updated)              │  │  (Auto-updated)              │
                    └──────────────────────────────┘  └──────────────────────────────┘
                                                                    │
                                                                    ▼
                                            ┌───────────────────────────────────────┐
                                            │  STUDENT AUTOMATICALLY APPEARS IN     │
                                            │  INTERNS PAGE                         │
                                            │  /dashboard/company/intern            │
                                            │                                       │
                                            │  Query:                               │
                                            │  SELECT * FROM companyapplications    │
                                            │  WHERE status = 'ACCEPTED'            │
                                            └───────────────────────────────────────┘
                                                                    │
                                                                    ▼
                                            ┌───────────────────────────────────────┐
                                            │  COMPANY ASSIGNS ADVISOR              │
                                            │                                       │
                                            │  1. Click "Assign Advisor"            │
                                            │  2. Enter advisor name                │
                                            │  3. Save assignment                   │
                                            │  4. Advisor appears on student card   │
                                            └───────────────────────────────────────┘
```

## Key Points

### 1. Automatic Database Synchronization
- When university submits application → Both tables updated
- When company changes status → Both tables updated
- Both dashboards always show synchronized data

### 2. Status Flow
```
PENDING → UNDER_REVIEW → SHORTLISTED → ACCEPTED
   ↓           ↓              ↓
REJECTED    REJECTED       REJECTED
```

### 3. Automatic Student Page Population
- **Trigger**: Company accepts application (status = "ACCEPTED")
- **Action**: Student automatically appears in Interns page
- **Query**: Filters `companyapplications` table by `status = 'ACCEPTED'`
- **No manual action needed**: System handles everything automatically

### 4. Real-time Updates
- University dashboard: Auto-refresh every 30 seconds
- Company dashboard: Auto-refresh every 30 seconds
- Interns page: Fetches on page load
- All pages show current database state

## API Endpoints

### Submit Application
```
POST /api/applications
Body: { student_info, cv, resume, company_id }
Result: Creates records in BOTH tables
```

### Get Company Applications
```
GET /api/applications/company?status=ACCEPTED
Result: Returns accepted students from companyapplications table
```

### Update Application Status
```
PUT /api/applications/:id/review
Body: { status: "accepted" }
Result: Updates status in BOTH tables
```

## Database Tables

### universityapplications
- Stores all applications from university perspective
- Updated when: Application submitted, Status changed
- Used by: University dashboard

### companyapplications
- Stores all applications from company perspective
- Updated when: Application submitted, Status changed
- Used by: Company dashboard, Interns page

### Synchronization
- Both tables share the same `application_id`
- Status updates affect both tables simultaneously
- Ensures data consistency across all views

## User Journey

1. **University**: Submit student application
2. **System**: Create records in both databases
3. **Company**: View application in Applications page
4. **Company**: Click "Accept" button
5. **System**: Update status to "ACCEPTED" in both databases
6. **University**: See "ACCEPTED" status in their dashboard
7. **Company**: Student automatically appears in Interns page
8. **Company**: Assign advisor to student
9. **Company**: Manage intern throughout internship period

## Benefits

✅ **Automatic**: No manual data entry needed
✅ **Synchronized**: Both sides always see same data
✅ **Real-time**: Updates appear within 30 seconds
✅ **Efficient**: Single action updates multiple views
✅ **Reliable**: Database constraints ensure data integrity
