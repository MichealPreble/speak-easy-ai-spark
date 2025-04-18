
# SpeakEasyAI Authentication Checklist

This checklist covers authentication system verification.

## Authentication System Validation

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

_Last updated: April 18, 2025_
