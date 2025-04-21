
# ✅ Lovable Testing Codex: Speech Practice MVP

**Goal:** Ensure reliable, test-driven launch readiness. Focus only on what's critical for a functional, high-quality MVP.

## 🔍 Critical Functionality Testing

### ✅ Supabase Connection
- [ ] `testSupabaseConnection()` returns expected response
- [ ] `.env` contains:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`

### 🔐 Authentication Flow
- [ ] Can sign up with new email/password
- [ ] Can log in with known credentials
- [ ] Protected routes redirect unauthenticated users
- [ ] Logout clears auth session

### 🗣️ Core Speech Practice Features
- [ ] Microphone access prompt appears on first run
- [ ] Recording initializes properly
- [ ] Transcription completes for short speech sample
- [ ] Basic feedback is displayed

### 💬 Message Persistence
- [ ] Messages are saved to Supabase or fallback to localStorage
- [ ] Data persists on refresh
- [ ] Message clearing resets state

## 🔁 End-to-End Journeys

### 🧪 Registration Flow
- [ ] Navigate to `/`
- [ ] Sign up
- [ ] Redirect to dashboard/chat

### 🎙️ Practice Session Flow
- [ ] Login → Go to `/practice`
- [ ] Select speech type
- [ ] Record & submit speech
- [ ] Receive feedback

### 🙋 Profile Flow
- [ ] Go to `/profile`
- [ ] Edit and save profile info
- [ ] Refresh → data persists

### 🚀 Deployment Readiness
- [ ] `npm run build` completes with no errors
- [ ] Local static preview works
- [ ] Production Supabase connection confirmed

## 👤 Test User Accounts

| Email | Password | Purpose |
|-------|----------|---------|
| test@practice.dev | Test1234! | General user testing |
| admin@practice.dev | Admin123! | Admin-only routes |

🔐 *Rotate these or move to .env if deploying live*

## ⏱️ Performance Expectations

| Feature | Target Response Time |
|---------|----------------------|
| Auth (signup/login) | ≤ 2 seconds |
| Speech feedback display | ≤ 3 seconds post-submit |
| Message load on refresh | ≤ 1 second |

## ⚠️ Known MVP Limitations
- Safari transcription may not work (Web Speech API unsupported)
- No offline speech caching
- Profile images are not yet supported

## 🧭 Recommended Test Order
1. Supabase Connection
2. Auth Flow
3. Speech Features
4. End-to-End Flows
5. Build & Deploy
