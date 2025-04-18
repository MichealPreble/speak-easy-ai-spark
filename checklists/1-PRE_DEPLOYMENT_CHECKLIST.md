
# SpeakEasyAI Pre-Deployment Checklist

This checklist covers preparation tasks before deployment.

## Team and Environment Setup

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
  - [ ] Ensure `VITE_BEEHIIV_API_KEY` is set if using Beehiiv API.
- [ ] Prepare deployment script:
  - [ ] Make `deploy.sh` executable (`chmod +x deploy.sh`).
  - [ ] Update production URL in `deploy.sh` (`https://speakeasyai.com`).
  - [ ] Replace Slack webhook URL in `deploy.sh` (`https://hooks.slack.com/services/...`).
- [ ] Review checklist:
  - [ ] Share checklist files via GitHub or Slack.
  - [ ] Assign subtasks in GitHub Issues or project tool (e.g., Trello).

_Last updated: April 18, 2025_
