# Deployment Checklist

## Pre-Deployment

### Environment Variables
- [ ] Update JWT_SECRET to strong random value
- [ ] Set production database credentials
- [ ] Configure CORS for production domain
- [ ] Set NODE_ENV=production

### Security
- [ ] Review and update CORS settings
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Add rate limiting
- [ ] Implement request validation
- [ ] Add helmet.js for security headers

### Database
- [ ] Run database migrations
- [ ] Create database backups
- [ ] Set up connection pooling
- [ ] Configure database indexes
- [ ] Test database performance

### File Storage
- [ ] Configure cloud storage (AWS S3, etc.)
- [ ] Set up CDN for file delivery
- [ ] Implement file size limits
- [ ] Add virus scanning for uploads

## Deployment Steps

### Backend
```bash
cd backend
npm install --production
npm run build  # if applicable
pm2 start app.js --name internhub-api
```

### Frontend
```bash
cd frontend/internhub
npm install
npm run build
npm start
# or deploy to Vercel/Netlify
```

### Database
```bash
psql -U postgres -d internhub_prod < schema.sql
```

## Post-Deployment

### Testing
- [ ] Test user registration
- [ ] Test login for all roles
- [ ] Test application submission
- [ ] Test file uploads
- [ ] Test status updates
- [ ] Verify email notifications (if implemented)

### Monitoring
- [ ] Set up error logging (Sentry, etc.)
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring
- [ ] Enable database query logging
- [ ] Configure backup schedules

### Documentation
- [ ] Update API documentation
- [ ] Create user guides
- [ ] Document deployment process
- [ ] Create troubleshooting guide

## Production URLs

- Frontend: https://your-domain.com
- Backend API: https://api.your-domain.com
- Database: (internal only)

## Rollback Plan

1. Keep previous version tagged in git
2. Database backup before deployment
3. Quick rollback script ready
4. Monitor logs for 24 hours post-deployment
