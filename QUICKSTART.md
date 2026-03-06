# Quick Start Guide

## 1. Database Setup

Create PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE internhub;
\q
```

## 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run dev
```

Backend runs on http://localhost:5000

## 3. Frontend Setup

```bash
cd frontend/internhub
npm install
npm run dev
```

Frontend runs on http://localhost:3000

## 4. Create Test Accounts

Visit http://localhost:3000/auth/signup

**University Account:**
- Email: uni@test.com
- Password: test123
- Role: university

**Company Account:**
- Email: company@test.com  
- Password: test123
- Role: company

## 5. Test the Flow

1. Login as University → Submit Application
2. Login as Company → Review Applications
3. Update status: Pending → Under Review → Shortlisted → Accepted

Done! 🎉
