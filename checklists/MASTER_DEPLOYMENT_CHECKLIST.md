
# SpeakEasyAI Master Deployment Checklist

This comprehensive checklist serves as a single source of truth for the SpeakEasyAI deployment process. It consolidates all tasks from specialized checklists into a structured workflow.

## Pre-Deployment Preparation (Day -1)

Prepare the team and environment before deployment day.

- [ ] **Team Roles and Responsibilities**
  - [ ] Designate deployment lead (runs `deploy.sh`)
  - [ ] Assign feature testers (auth, newsletter, speech)
  - [ ] Identify rollback coordinator
  - [ ] Schedule deployment window with team

- [ ] **Repository and Environment Preparation**
  - [ ] Pull latest `main` (`git pull origin main`)
  - [ ] Verify no uncommitted changes (`git status --porcelain`)
  - [ ] Install dependencies (`npm install`)
  - [ ] Verify environment configuration (`.env.production`)
    - [ ] Check Supabase variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
    - [ ] Confirm Beehiiv API key if using (`VITE_BEEHIIV_API_KEY`)
  
- [ ] **Deployment Script Preparation**
  - [ ] Make `deploy.sh` executable (`chmod +x deploy.sh`)
  - [ ] Verify production URL (`https://speakeasyai.com`)
  - [ ] Update Slack webhook URL for notifications

## Authentication System Verification (Day -1)

Validate all authentication flows before deployment.

- [ ] **Core Authentication Flows**
  - [ ] Test sign in with valid/invalid credentials
  - [ ] Verify sign up creates user in Supabase
  - [ ] Confirm password reset functionality and email delivery
  
- [ ] **Email Verification Process**
  - [ ] Enable email verification in Supabase dashboard
  - [ ] Test verification email delivery and link functionality
  
- [ ] **Error Handling and User Experience**
  - [ ] Verify appropriate error messages display in UI
  - [ ] Confirm errors are logged to monitoring system
  
- [ ] **User Profile and Admin Features**
  - [ ] Test updating user profile information
  - [ ] Verify admin role assignment works (`is_admin` in user metadata)
  - [ ] Confirm admin-only features are properly restricted

## Feature Verification (Day -1)

Test core application functionality across devices and browsers.

- [ ] **Speech Recognition and Analysis**
  - [ ] Test Web Speech API compatibility in major browsers
    - [ ] Chrome
    - [ ] Edge
    - [ ] Firefox
    - [ ] Safari
  - [ ] Verify on mobile devices
    - [ ] iOS Safari
    - [ ] Android Chrome
  - [ ] Test speech analysis accuracy
    - [ ] Pitch detection
    - [ ] Pace analysis
    - [ ] Volume measurement
  
- [ ] **Newsletter Functionality**
  - [ ] Verify latest issue display
    - [ ] Confirm proper rendering of content
    - [ ] Test navigation to full issue
    - [ ] Validate analytics tracking
  - [ ] Test archive functionality
    - [ ] Pagination
    - [ ] Search
    - [ ] Filtering
  - [ ] Confirm subscription process
    - [ ] Beehiiv iframe integration
    - [ ] Callback handling

## Performance and Security (Day -1)

Ensure application meets performance and security standards.

- [ ] **Performance Testing**
  - [ ] Run Lighthouse audit (target scores >90)
  - [ ] Test on low-end devices
  - [ ] Verify load times (<3 seconds target)
  
- [ ] **Security Verification**
  - [ ] Confirm Supabase Row Level Security policies
  - [ ] Check for exposed secrets or API keys
  - [ ] Verify proper authentication guards on protected routes

## Deployment Day (Day 0)

Execute the deployment process with careful verification.

- [ ] **Pre-Deploy Checks**
  - [ ] Run linting (`npm run lint`)
  - [ ] Execute all tests (`npm run test`)
  - [ ] Verify CI/CD pipeline status
  
- [ ] **Build Process**
  - [ ] Generate production build (`npm run build`)
  - [ ] Verify build output (`dist/index.html` exists)
  
- [ ] **Deployment Execution**
  - [ ] Run deployment script (`./deploy.sh`)
  - [ ] Monitor deployment logs
  
- [ ] **Post-Deployment Verification**
  - [ ] Confirm production site is accessible
  - [ ] Test core user flows end-to-end
    - [ ] Authentication (sign up, verify email, sign in)
    - [ ] Speech recognition and analysis
    - [ ] Newsletter subscription
  - [ ] Verify external integrations (Supabase, Beehiiv)
  - [ ] Check monitoring systems for errors

## Rollback Plan (If Needed)

Defined process for reverting to previous stable version.

- [ ] **Criteria for Rollback Decision**
  - [ ] Critical functionality broken
  - [ ] Security vulnerability identified
  - [ ] Unacceptable performance degradation
  
- [ ] **Rollback Process**
  - [ ] Frontend: Revert to previous deployment
    - [ ] Vercel: `vercel rollback` or dashboard
    - [ ] Netlify: Re-deploy previous build
  - [ ] Database: Restore if needed
    - [ ] Use Supabase Point-in-Time Recovery
    - [ ] Verify data integrity post-restore
  
- [ ] **Post-Rollback Tasks**
  - [ ] Notify team of rollback
  - [ ] Document rollback reason and impact
  - [ ] Create plan to address root cause

## Post-Deployment Monitoring (Days 0-7)

Ongoing verification of application health.

- [ ] **Performance Monitoring**
  - [ ] Track page load metrics
  - [ ] Monitor API response times
  - [ ] Check resource usage
  
- [ ] **Error Tracking**
  - [ ] Review error logs (Supabase, Sentry)
  - [ ] Address any new errors
  
- [ ] **User Feedback**
  - [ ] Monitor support channels
  - [ ] Track user-reported issues
  - [ ] Prioritize fixes for critical issues

## Progress Tracking

Document deployment progress and results.

- [ ] **Task Management**
  - [ ] Create GitHub Issues for pending tasks
  - [ ] Assign issues to team members
  - [ ] Update status in project management tool
  
- [ ] **Documentation**
  - [ ] Record deployment outcomes
  - [ ] Document any issues encountered
  - [ ] Update checklist for future deployments

## References

- Deployment script: `./deploy.sh`
- Authentication: `src/context/auth/*`, `src/hooks/useAuth.tsx`
- Newsletter components: `src/components/newsletter/*`
- Speech analysis: `src/hooks/useVoiceRecognition.ts`, `src/utils/speech/*`

_Last updated: April 18, 2025_
