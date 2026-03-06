# Accepted Students & Advisor Assignment Feature

## Overview
Companies can now view all accepted students in a dedicated "Interns" page and assign advisors to them.

## Access
Navigate to: **Company Dashboard → Interns** (from sidebar)

## Features

### 1. Accepted Students Display
- Shows only students with "ACCEPTED" status
- Card-based grid layout (responsive: 1-3 columns)
- Each card displays:
  - Student avatar with initials
  - Full name
  - Accepted status badge (green checkmark)
  - Email address
  - Department
  - Academic year
  - Advisor assignment status

### 2. Student Information
Each student card includes:
- **Personal Info**: Name, email, department, academic year
- **Profile Links**: GitHub and LinkedIn buttons
- **Documents**: Download CV and Resume buttons
- **Advisor Section**: Shows assigned advisor or assignment button

### 3. Advisor Assignment
- Click "Assign Advisor" button on any student card
- Modal popup appears with:
  - Student name confirmation
  - Advisor name input field
  - Assign and Cancel buttons
- Once assigned, advisor name displays in the card
- Visual indicator with UserCheck icon

### 4. Search Functionality
- Search bar at the top
- Filter students by:
  - First name
  - Last name
  - Email
  - Department
- Real-time filtering as you type

### 5. Statistics
- Total accepted students count displayed in header
- Updates automatically when students are accepted

## UI Design

### Color Scheme
- Primary: Orange (matching company theme)
- Success: Green (for accepted status)
- Cards: White with orange borders
- Hover effects on all interactive elements

### Layout
- Sidebar navigation (fixed left)
- Main content area with:
  - Page header with title and stats
  - Search bar
  - Grid of student cards
  - Assign advisor modal (when triggered)

### Student Card Components
1. **Header Section**
   - Avatar circle with initials
   - Student name
   - Accepted status badge

2. **Info Section**
   - Email (with mail icon)
   - Department (with book icon)
   - Academic year (with calendar icon)

3. **Advisor Section**
   - Orange background box
   - Shows advisor name if assigned
   - "Assign Advisor" button if not assigned

4. **Action Buttons**
   - GitHub link (dark gray)
   - LinkedIn link (blue)
   - Download CV (orange)
   - Download Resume (orange)

## Technical Implementation

### Frontend
**File**: `internhub/frontend/internhub/app/dashboard/company/intern/page.tsx`

**Key Functions**:
- `fetchAcceptedStudents()` - Fetches students with ACCEPTED status
- `assignAdvisor()` - Assigns advisor to selected student
- `downloadFile()` - Downloads CV/Resume files
- `filteredStudents` - Filters students based on search term

**State Management**:
- `students` - Array of accepted students
- `searchTerm` - Current search query
- `selectedStudent` - Student selected for advisor assignment
- `showAssignModal` - Controls modal visibility
- `advisorName` - Advisor name input value

### Backend API
**Endpoint**: `GET /api/applications/company?status=ACCEPTED&limit=100`

**Response**:
```json
{
  "applications": [
    {
      "id": "uuid",
      "application_id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "department": "Computer Science",
      "academic_year": "3rd Year",
      "github_link": "https://github.com/johndoe",
      "linkedin_link": "https://linkedin.com/in/johndoe",
      "cv_url": "/uploads/cv_xxx.pdf",
      "resume_url": "/uploads/resume_xxx.pdf",
      "status": "ACCEPTED",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Sidebar Navigation
**File**: `internhub/frontend/internhub/components/sidebar/CompanySidebar.tsx`

**Menu Items**:
1. Dashboard - `/dashboard/company`
2. Applications - `/dashboard/company/application`
3. **Interns** - `/dashboard/company/intern` ← New page

## Future Enhancements

### Recommended Additions:
1. **Persist Advisor Assignments**
   - Add `advisor` column to database
   - Create API endpoint to save advisor assignments
   - Update backend model to handle advisor data

2. **Advisor Management**
   - List of available advisors
   - Dropdown selection instead of text input
   - Advisor profiles and capacity limits

3. **Student Progress Tracking**
   - Internship start/end dates
   - Progress reports
   - Performance evaluations

4. **Communication Features**
   - Send messages to students
   - Email notifications
   - Meeting scheduling

5. **Export Functionality**
   - Export student list to CSV/Excel
   - Generate reports
   - Print student cards

## Usage Flow

1. Company accepts student applications
2. Navigate to "Interns" from sidebar
3. View all accepted students in grid layout
4. Use search to find specific students
5. Click "Assign Advisor" on student card
6. Enter advisor name in modal
7. Click "Assign" to save
8. Advisor name appears on student card
9. Download CV/Resume or visit GitHub/LinkedIn as needed

## Notes
- Currently, advisor assignments are stored in local state (frontend only)
- For production, implement backend API to persist advisor assignments
- Consider adding role-based access control for advisor management
- Implement pagination if student count exceeds 100
