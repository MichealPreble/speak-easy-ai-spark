# SpeakEasyAI Deployment Checklist

This checklist covers the deployment process for SpeakEasyAI.

## Section 1: Pre-Deployment Preparation

- [ ] Verify environment setup:
  - [ ] Check environment variables in .env.production:
    - [ ] VITE_SUPABASE_URL
    - [ ] VITE_SUPABASE_ANON_KEY
    - [ ] VITE_BEEHIIV_API_KEY (optional)
  - [ ] Replace Slack webhook URL in deploy.sh (e.g., https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX)
  - [ ] Make deploy.sh executable (chmod +x deploy.sh)
- [ ] Verify repository state:
  - [ ] Pull latest changes
  - [ ] Check for uncommitted changes
- [ ] Install dependencies:
  - [ ] Run npm install
  - [ ] Verify package versions

## Section 2: Authentication Verification

- [ ] Test authentication flows:
  - [ ] Sign in with valid/invalid credentials
  - [ ] Verify user creation in Supabase
  - [ ] Test password reset functionality
  - [ ] Confirm email verification process
- [ ] Verify user roles:
  - [ ] Test admin access
  - [ ] Verify protected routes

## Section 3: Feature Verification

- [ ] Test newsletter functionality:
  - [ ] Verify Beehiiv iframe integration
  - [ ] Test subscription process
  - [ ] Check issue display and navigation
- [ ] Validate core features:
  - [ ] Speech recognition
  - [ ] Newsletter management
  - [ ] User profiles

## Section 4: Performance Checks

- [ ] Run performance audits:
  - [ ] Execute Lighthouse audit
  - [ ] Check load times
  - [ ] Verify responsive design

- [ ] Test browser compatibility:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

## Section 7: Environment Configuration
- [ ] Set up `.env.production`:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_BEEHIIV_API_KEY` (optional)
- [ ] Configure CI/CD:
  - [ ] If using CI/CD (e.g., GitHub Actions), verify `CI=true` or `GITHUB_ACTIONS=true` in the environment
  - [ ] Configure log storage for `deployment.log`

## Section 10: Deployment Process
- [ ] Run pre-deployment checks:
  - [ ] Verify Vercel CLI installation (`vercel --version`; install with `npm install -g vercel@latest` if missing)
  - [ ] Validate Slack webhook URL is not the placeholder
  - [ ] Run linting and tests
- [ ] Execute deployment:
  - [ ] Build production bundle
  - [ ] Verify build output
  - [ ] Deploy to Vercel
- [ ] Verify deployment:
  - [ ] Run `curl --retry 3 --retry-delay 5 -s -o /dev/null -w "%{http_code}" https://speakeasyai.com` to verify with 3 retries and 5-second delays, ensuring HTTP 200 status
  - [ ] Check Vercel deployment logs
  - [ ] Verify Slack notifications

## Section 11: Rollback Plan

- [ ] Document rollback steps:
  - [ ] Identify previous stable version
  - [ ] Test rollback procedure
- [ ] Monitor deployment:
  - [ ] Check error logs
  - [ ] Monitor performance
  - [ ] Track user feedback

## Section 12: Post-Deployment Monitoring
- [ ] Monitor performance:
  - [ ] Check Lighthouse scores
  - [ ] Track load times
- [ ] Monitor errors:
  - [ ] Review error logs
  - [ ] Review `deployment.log` for errors, verify completion timestamp, and check Git commit hash for traceability
  - [ ] Track user feedback

_Last updated: April 18, 2025_
