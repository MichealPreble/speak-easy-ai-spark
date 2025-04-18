# SpeakEasyAI Deployment Checklist

This checklist ensures a successful production launch of SpeakEasyAI, covering preparation, authentication, features, performance, security, infrastructure, user experience, documentation, deployment, rollback, monitoring, and progress tracking. Tasks are organized hierarchically for maintainability, team collaboration, and version control.

## 1. Pre-Deployment Preparation

Prepare the team and environment for deployment.

- [ ] Assign team roles:
  - [ ] Designate deployment lead (runs `deploy.sh`).
  - [ ] Assign testers for auth, newsletter, speech features.
  - [ ] Identify rollback coordinator.
- [ ] Verify repository state:
  - [ ] Pull latest `main` (`git pull origin main`).
  - [ ] Check for uncommitted changes (`git status --porcelain`).
- [ ] Set up local environment:
  - [ ] Install dependencies (`npm install`).
  - [ ] Verify `.env.production` (`cat .env.production | grep VITE_SUPABASE`).
- [ ] Review checklist:
  - [ ] Share `DEPLOYMENT_CHECKLIST.md` via GitHub or Slack.
  - [ ] Assign subtasks in GitHub Issues or project tool (e.g., Trello).

## 2. Authentication

Validate the refactored auth system (`src/context/auth/*`, `src/hooks/useAuth.tsx`) with Supabase.

- [ ] Verify auth flows in `AuthProvider.tsx`:
  - [ ] Sign in: Test valid/invalid email/password via UI.
  - [ ] Sign up: Confirm user in Supabase (`supabase auth list`).
  - [ ] Password reset: Verify email delivery (Supabase logs).
- [ ] Test email verification:
  - [ ] Enable in Supabase dashboard (Auth > Settings).
  - [ ] Test verification link in email client.
- [ ] Ensure error handling:
  - [ ] Display errors (e.g., "Invalid credentials") in UI.
  - [ ] Log to Sentry (`Sentry.captureException(error)`).
- [ ] Confirm user profile updates:
  - [ ] Set `is_admin` in Supabase (`UPDATE users SET user_metadata = jsonb_set(user_metadata, '{is_admin}', 'true')`).
  - [ ] Verify admin features in `NewsletterUpload.tsx` (e.g., upload button).
- [ ] Test session persistence:
  - [ ] Refresh page; confirm `user` via `useAuth`.
  - [ ] Check `supabase.auth.getSession()` in `AuthProvider.tsx`.
- [ ] Verify `is_admin` type safety:
  - [ ] Confirm `user?.user_metadata?.is_admin` in `NewsletterUpload.tsx` causes no TS errors.

## 3. Feature Verification

Test core features, including speech recognition and newsletter functionality.

- [ ] Test speech recognition:
  - [ ] Verify Web Speech API in Chrome, Firefox, Safari, Edge.
  - [ ] Test on iOS Safari, Android Chrome (use BrowserStack).
- [ ] Confirm real-time speech analysis:
  - [ ] Check accuracy (e.g., pitch, pace detection).
  - [ ] Test on low-end devices (Chrome DevTools: 6x CPU slowdown).
- [ ] Verify newsletter functionality:
  - [ ] Test `NewsletterLatestIssue.tsx`:
    - [ ] Confirm rendering of `issue.title`, `preview_text`, `featured_image`.
    - [ ] Verify navigation to `/newsletter/:slug` on button click.
    - [ ] Check `trackEvent("view_latest_issue", { title: issue.title })`.
  - [ ] Test `NewsletterArchive.tsx`:
    - [ ] Verify pagination (`page`, `limit`) and total pages.
    - [ ] Test search by title (`setSearchQuery`) and `blogTag` filtering (`setBlogTag`).
    - [ ] Check `trackEvent("click_archive_issue", { title })`, `search_archive`, `filter_archive`.
  - [ ] Test `NewsletterSignup.tsx`:
    - [ ] Verify Beehiiv iframe (`https://embeds.beehiiv.com/459544e2-b4ac-473d-b735-38470ab16e0c`).
    - [ ] Confirm `onSubscribe: () => void` triggers on iframe load.
    - [ ] Check `trackEvent("subscribe", { source: "newsletter_signup" })`, `load_newsletter_iframe`.
- [ ] Test responsive design:
  - [ ] Check layouts on mobile, tablet, desktop (Chrome DevTools).
  - [ ] Ensure glassmorphic aesthetic (mint #A8E6CE) with shadcn/ui.
- [ ] Verify dark/light mode toggle:
  - [ ] Test Tailwind CSS classes (`dark:` prefix).
  - [ ] Confirm persistence (`localStorage.getItem("theme")`).

## 4. Performance Optimization

Ensure fast load times and smooth performance.

- [ ] Run Lighthouse audit:
  - [ ] Target scores >90 (Performance, Accessibility, Best Practices, SEO).
  - [ ] Run `vite build && vite preview`; test `http://localhost:4173`.
- [ ] Optimize images:
  - [ ] Convert newsletter assets to WebP (`npx squoosh-cli --webp`).
  - [ ] Use `srcset` in `<img>` tags (e.g., `NewsletterLatestIssue.tsx`).
- [ ] Implement code splitting:
  - [ ] Apply `React.lazy`/`Suspense` for `NewsletterUpload.tsx`, `AuthProvider.tsx`.
  - [ ] Analyze bundle (`vite build --analyze`).
- [ ] Verify load time <3 seconds:
  - [ ] Test production build on Vercel (`vercel --prod`).
- [ ] Test on low-end devices:
  - [ ] Simulate low CPU/memory (Chrome DevTools).

## 5. Security

Secure the application and user data.

- [ ] Configure Supabase Row Level Security (RLS):
  - [ ] Verify policies for `newsletter_issues`, `users` (`supabase db dump --schema public`).
  - [ ] Test `is_admin` in RLS (`SELECT * FROM newsletter_issues WHERE auth.uid() = ...`).
- [ ] Secure API endpoints:
  - [ ] Confirm auth for Supabase queries in `useNewsletter.ts`.
- [ ] Check for exposed secrets:
  - [ ] Scan `dist/` for `VITE_SUPABASE_*` (`grep -r "supabase" dist/`).
  - [ ] Use `vite-plugin-env` for secure env handling.
- [ ] Configure Content Security Policy (CSP):
  - [ ] Allow `https://embeds.beehiiv.com`, Supabase in `vercel.json` or `netlify.toml`.
- [ ] Run dependency audit:
  - [ ] Run `npm audit --production`; fix critical issues.

## 6. Database & Infrastructure

Set up and optimize database and hosting.

- [ ] Verify database tables:
  - [ ] Check `users`, `newsletter_issues` schemas (`supabase db dump`).
  - [ ] Confirm `is_admin` in `users.user_metadata`.
- [ ] Optimize queries:
  - [ ] Analyze `useNewsletter.ts` with Supabase query planner.
  - [ ] Add indexes (`CREATE INDEX ON newsletter_issues (created_at)`).
- [ ] Configure caching:
  - [ ] Use `react-query` with `staleTime` for newsletter data.
  - [ ] Set cache headers in `vercel.json` (`Cache-Control: max-age=31536000`).
- [ ] Set up monitoring/logging:
  - [ ] Enable Supabase logs or Sentry (`Sentry.init()`).
- [ ] Create backup strategy:
  - [ ] Enable daily PITR in Supabase dashboard.

## 7. Environment Configuration

Configure production environment.

- [ ] Set up `.env.production`:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_BEEHIIV_API_KEY` (if provided for POST /posts).
- [ ] Configure domain/DNS:
  - [ ] Set up domain in Vercel (`vercel domains add`).
  - [ ] Update DNS (A/CNAME via registrar).
- [ ] Set up SSL:
  - [ ] Enable auto-SSL in Vercel dashboard.
- [ ] Configure CI/CD:
  - [ ] Create `.github/workflows/deploy.yml` for `vite build`, deploy.
  - [ ] Reference `deploy.sh` in CI/CD.

## 8. User Experience

Ensure polished, accessible UI.

- [ ] Test form validations:
  - [ ] Verify `NewsletterSignup.tsx`, auth forms (client-side validation).
  - [ ] Use `<button onClick>` for Beehiiv (avoid `<form>` `onSubmit`).
- [ ] Confirm error messages:
  - [ ] Check auth, newsletter errors (e.g., "Failed to subscribe").
- [ ] Ensure loading states:
  - [ ] Add spinners (`lucide-react` icons) for queries, speech analysis.
- [ ] Test accessibility:
  - [ ] Verify keyboard navigation, ARIA labels (shadcn/ui).
  - [ ] Run `axe-core` audit (`npx axe http://localhost:4173`).
- [ ] Confirm links:
  - [ ] Test `Navbar.tsx`, newsletter archive, external links.

## 9. Documentation & Legal

Complete documentation and legal requirements.

- [ ] Update `README.md`:
  - [ ] Add deployment instructions (`./deploy.sh`).
  - [ ] Document Supabase setup (Lovable’s green button).
- [ ] Finalize Privacy Policy:
  - [ ] Cover Supabase, Beehiiv data handling.
- [ ] Complete Terms of Service:
  - [ ] Include newsletter, speech analysis terms.
- [ ] Document limitations:
  - [ ] Note speech recognition support (e.g., no IE).
- [ ] Create user documentation:
  - [ ] Guide for newsletter subscription, speech analysis (PDF/Markdown).

## 10. Deployment Process

Execute production deployment.

- [ ] Run pre-deployment checks:
  - [ ] Run `npm run test` (unit/end-to-end, `vitest run`).
  - [ ] Run `npm run lint` (`eslint src`).
  - [ ] Verify `.env.production` (`cat .env.production`).
- [ ] Build application:
  - [ ] Run `vite build` to generate `dist/`.
  - [ ] Check `dist/index.html`, assets (`ls dist/assets`).
- [ ] Run Lighthouse audit:
  - [ ] Run `npm run lighthouse` (`lighthouse http://localhost:4173`).
  - [ ] Confirm scores >90; document deviations.
- [ ] Deploy to production:
  - [ ] Run `./deploy.sh` (automates build, deploy).
  - [ ] Confirm deployment (`vercel --prod` or `netlify deploy --prod`).
- [ ] Verify production:
  - [ ] Test flows: Sign up → Email verification → Sign in → Newsletter upload → Subscription.
  - [ ] Check logs (Supabase dashboard, Sentry).
  - [ ] Run `curl -s -o /dev/null -w "%{http_code}" https://your-production-url.com` (expect 200).

## 11. Rollback Plan

Handle deployment issues.

### Triggers
- Critical security vulnerability detected
- Severe performance degradation
- Critical functionality failure
- Newsletter or auth system outage

### Process
1. Evaluate Issue Severity
   - [ ] Monitor error rates and user impact
   - [ ] Check Sentry for error spikes
   - [ ] Review Supabase logs for auth/database issues
   - [ ] Verify Beehiiv iframe functionality

2. Execute Rollback
   - [ ] Revert deployment:
     - [ ] Run `vercel rollback` or use dashboard
     - [ ] Confirm previous version is live
   - [ ] Restore database if needed:
     - [ ] Use Supabase Point-in-Time Recovery
     - [ ] Verify data integrity post-restore

3. Verify System Stability
   - [ ] Check core functionality:
     - [ ] Auth flows (sign in, sign up)
     - [ ] Newsletter features
     - [ ] Speech recognition
   - [ ] Monitor performance metrics
   - [ ] Verify third-party integrations

4. Communication
   - [ ] Notify stakeholders of issue and rollback
   - [ ] Update status page if available
   - [ ] Document incident for post-mortem

### Recovery
1. Root Cause Analysis
   - [ ] Review deployment logs
   - [ ] Analyze error patterns
   - [ ] Document findings

2. Fix Implementation
   - [ ] Create hotfix branch
   - [ ] Test fixes thoroughly
   - [ ] Deploy with additional monitoring

3. Prevention
   - [ ] Update deployment checklist
   - [ ] Enhance monitoring
   - [ ] Add new test cases

## 12. Post-Deployment Monitoring

Monitor application health and performance.

- [ ] Track Error Rates
  - [ ] Monitor Sentry for runtime errors
  - [ ] Check Supabase logs for backend issues
  - [ ] Track newsletter subscription failures

- [ ] Performance Metrics
  - [ ] Monitor page load times
  - [ ] Track API response times
  - [ ] Measure speech recognition latency

- [ ] User Engagement
  - [ ] Track successful logins
  - [ ] Monitor newsletter subscriptions
  - [ ] Measure speech practice sessions

- [ ] System Health
  - [ ] Database connection status
  - [ ] Third-party integration health
  - [ ] SSL certificate validity

## Build & Deploy Script Reference

```bash
#!/bin/bash
# deploy.sh

set -e

# Environment check
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "Error: Required environment variables not set"
  exit 1
fi

# Deploy steps
npm install
npm run test
npm run build
npm run lighthouse

# Deploy command (customize based on platform)
vercel --prod

echo "Deployment complete!"
```

*Last Updated: 2025-04-18*
