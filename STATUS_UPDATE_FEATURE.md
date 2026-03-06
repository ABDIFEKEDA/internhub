# Application Status Update Feature

## Overview
Companies can now Accept or Reject applications directly from the company dashboard. Status updates are automatically synchronized across both university and company databases.

## Company Dashboard Buttons

### Available Actions by Status:

**PENDING Applications:**
- ✅ **Accept** (Green button) - Directly accept the application
- ❌ **Reject** (Red button) - Directly reject the application
- 🔍 **Review** (Blue button) - Move to under review
- 👁️ **View Details** (Gray button) - View full application details

**UNDER_REVIEW Applications:**
- ✅ **Accept** (Green button) - Directly accept the application
- ❌ **Reject** (Red button) - Directly reject the application
- ⭐ **Shortlist** (Purple button) - Move to shortlisted
- 👁️ **View Details** (Gray button) - View full application details

**SHORTLISTED Applications:**
- ✅ **Accept** (Green button) - Directly accept the application
- ❌ **Reject** (Red button) - Directly reject the application
- 👁️ **View Details** (Gray button) - View full application details

**ACCEPTED Applications:**
- ✅ Status indicator showing "Application Accepted"

**REJECTED Applications:**
- ❌ Status indicator showing "Application Rejected"

## Button Styling
- **Accept Button**: Green background, white text, shadow effect
- **Reject Button**: Red background, white text, shadow effect
- **Review Button**: Blue background, white text, shadow effect
- **Shortlist Button**: Purple background, white text, shadow effect
- **View Details Button**: Gray background, white text, shadow effect
- All buttons have hover effects and smooth transitions

## Backend Synchronization

### When a company updates an application status:

1. **API Endpoint**: `PUT /api/applications/:id/review`
2. **Request Body**: 
   ```json
   {
     "status": "accepted" | "rejected" | "under_review" | "shortlisted" | "pending",
     "feedback": "Optional feedback text"
   }
   ```

3. **Database Updates**:
   - Updates `universityapplications` table (by `id`)
   - Updates `universityapplications` table (by `application_id`)
   - Updates `companyapplications` table (by `application_id`)

4. **Response**:
   ```json
   {
     "message": "Application accepted",
     "application": { ... }
   }
   ```

### Status Flow:
```
PENDING → UNDER_REVIEW → SHORTLISTED → ACCEPTED
   ↓           ↓              ↓
REJECTED    REJECTED       REJECTED
```

## Frontend Features

### Immediate UI Updates:
- After status update, the page automatically refreshes
- Stats cards update to reflect new counts
- Application list updates with new status badges

### Auto-Refresh:
- Both company and university dashboards auto-refresh every 30 seconds
- Ensures both sides see the latest status changes

## University Dashboard

### Status Display:
- University dashboard shows all applications with current status
- Status badges with color coding:
  - 🟡 Pending (Amber)
  - ✅ Accepted (Green)
  - ❌ Rejected (Red)

### Real-time Sync:
- When company updates status, university dashboard reflects the change
- Auto-refresh ensures status is always current

## Code Locations

### Frontend:
- Company buttons: `internhub/frontend/internhub/app/dashboard/company/application/page.tsx`
  - Function: `getStatusActions()`
  - Function: `updateApplicationStatus()`

### Backend:
- Controller: `internhub/backend/controller/application.js`
  - Function: `reviewApplication()`
- Model: `internhub/backend/models/application.js`
  - Function: `updateStatus()`
- Routes: `internhub/backend/routes/application.js`
  - Route: `PUT /:id/review`

## Security
- ✅ Authentication required (JWT token)
- ✅ Company role verification
- ✅ Application existence check
- ✅ Valid status validation

## Error Handling
- Invalid status values are rejected
- Missing authentication returns 401
- Application not found returns 404
- Server errors return 500 with error message
