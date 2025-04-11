
# SpeakEasyAI Technical Prerequisites Checklist

This checklist covers all technical items that need to be completed before deploying SpeakEasyAI to production.

## Infrastructure
- [ ] Set up production hosting environment on Vercel
  - [ ] Configure custom domain (if applicable)
  - [ ] Set up staging environment for pre-production testing
- [ ] Configure domain and DNS settings
  - [ ] Set up A records or CNAME as required by Vercel
  - [ ] Ensure www subdomain redirects properly
- [ ] Set up SSL certificates
  - [ ] Verify SSL is working on all domains and subdomains
- [ ] Configure CDN for static assets
  - [ ] Set appropriate cache headers (1 year for immutable assets)
- [ ] Set up error logging with Sentry
  - [ ] Create Sentry project and obtain DSN
  - [ ] Configure error boundaries for React components

## Database & Authentication
- [ ] Create Supabase tables
  - [ ] `messages` table with columns: id, user_id, content, timestamp, analyzed
  - [ ] `user_profiles` table with columns: id, auth_id, username, email, created_at
  - [ ] `speech_metrics` table with columns: id, user_id, clarity_score, pace, filler_words, timestamp
  - [ ] `speech_history` table with columns: id, user_id, transcript, metrics_id, created_at
- [ ] Set up Row Level Security policies for each table
  - [ ] `messages`: only user can view/edit their own messages
  - [ ] `user_profiles`: users can only view/edit their own profile
  - [ ] `speech_metrics`: users can only view their own metrics
  - [ ] `speech_history`: users can only access their own history
- [ ] Configure authentication providers in Supabase
  - [ ] Email/password authentication
  - [ ] OAuth providers (Google, GitHub) if required
- [ ] Test user signup, login, and session persistence
  - [ ] Verify email verification flow
  - [ ] Test password reset functionality
- [ ] Verify protected routes work correctly
  - [ ] Redirect unauthorized users to login
  - [ ] Preserve intended destination after login

## Environment Configuration
- [ ] Set VITE_SUPABASE_URL in Vercel
- [ ] Set VITE_SUPABASE_ANON_KEY in Vercel
- [ ] Add Google Analytics ID (if using)
- [ ] Set up environment variables for any third-party services
  - [ ] Sentry DSN
  - [ ] API keys for additional services
- [ ] Test environment variables in staging deployment
  - [ ] Verify all API connections work with configured keys
  - [ ] Check for any exposed secrets or keys in client-side code
