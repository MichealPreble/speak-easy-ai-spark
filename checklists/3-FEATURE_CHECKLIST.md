
# SpeakEasyAI Feature Verification Checklist

This checklist covers core feature testing.

## Speech Recognition

- [ ] Verify Web Speech API:
  - [ ] Test in Chrome, Firefox, Safari, Edge.
  - [ ] Test on iOS Safari, Android Chrome (use BrowserStack).
- [ ] Real-time speech analysis:
  - [ ] Check accuracy (pitch, pace detection).
  - [ ] Test on low-end devices (Chrome DevTools: 6x CPU slowdown).

## Newsletter Features

- [ ] Test `NewsletterLatestIssue.tsx`:
  - [ ] Confirm rendering of `issue.title`, `preview_text`, `featured_image`.
  - [ ] Verify navigation to `/newsletter/:slug`.
  - [ ] Check `trackEvent("view_latest_issue", "Newsletter", issue.title)`.
- [ ] Test `NewsletterArchive.tsx`:
  - [ ] Verify pagination and filtering.
  - [ ] Test search functionality.
  - [ ] Check analytics events.
- [ ] Test `NewsletterSignup.tsx`:
  - [ ] Verify Beehiiv iframe.
  - [ ] Test subscription flow.
  - [ ] Check analytics tracking.

## UI/UX Features

- [ ] Test responsive design:
  - [ ] Check layouts on mobile, tablet, desktop.
  - [ ] Ensure glassmorphic aesthetic (mint #A8E6CE).
- [ ] Verify dark/light mode:
  - [ ] Test theme switching.
  - [ ] Verify persistence.

_Last updated: April 18, 2025_
