# Application Synchronization Implementation

## Overview
When a university submits a student application, it is automatically synchronized across both university and company dashboards.

## Backend Implementation

### Database Tables
- **universityapplications**: Stores all applications from university perspective
- **companyapplications**: Stores all applications from company perspective

### Synchronization Process
When an application is submitted via `/api/applications` (POST):

1. **Creates entry in universityapplications table**
   - Includes: student info, academic details, CV, resume, status
   - Uses shared `application_id` for linking

2. **Creates entry in companyapplications table**
   - Same data as universityapplications
   - Uses same `application_id` for synchronization
   - Allows companies to see all applications

### Code Location
- Controller: `internhub/backend/controller/application.js` (lines 90-125)
- Models: `internhub/backend/models/application.js`
  - `createApplication()` - inserts into universityapplications
  - `createCompanyApplication()` - inserts into companyapplications

## Frontend Implementation

### University Dashboard
**Location**: `internhub/frontend/internhub/app/dashboard/university/application/page.tsx`

**Features**:
1. **Immediate UI Update**: When application is submitted, it appears instantly in the list
2. **Database Refresh**: After 500ms, fetches fresh data from database
3. **Auto-refresh**: Every 30 seconds, automatically fetches new applications
4. **Shows ALL applications**: Not filtered by university_id

### Company Dashboard
**Location**: `internhub/frontend/internhub/app/dashboard/company/application/page.tsx`

**Features**:
1. **Auto-refresh**: Every 30 seconds, automatically fetches new applications
2. **Stats Update**: Refreshes statistics along with applications
3. **Filtered by company**: Shows only applications for that company

## Data Flow

```
University Submits Application
         ↓
Backend API (/api/applications POST)
         ↓
    ┌────────────────────┐
    ↓                    ↓
universityapplications  companyapplications
    (database)          (database)
         ↓                    ↓
University Dashboard    Company Dashboard
  (auto-refresh)        (auto-refresh)
```

## Status Synchronization
When a company updates an application status:
- Updates both `universityapplications` and `companyapplications` tables
- Uses `application_id` to find matching records
- Ensures both dashboards show consistent status

## Key Features
✅ Real-time UI updates on submission
✅ Automatic database synchronization
✅ Auto-refresh every 30 seconds
✅ Consistent data across both dashboards
✅ Shared application_id for linking records
✅ Status updates synchronized across tables
