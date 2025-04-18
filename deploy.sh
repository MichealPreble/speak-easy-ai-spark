
#!/bin/bash
# deploy.sh

# Exit on any error
set -e

# Log tasks for progress tracking
log_task() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> deployment.log
}

# Make script executable
log_task "Ensuring deploy.sh is executable (Checklist: Pre-Deployment Preparation)"
chmod +x deploy.sh

# Check environment variables
log_task "Checking environment variables (Checklist: Pre-Deployment Preparation)"
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env.production (Checklist: Pre-Deployment Preparation)"
  exit 1
fi
# Check Beehiiv API key (optional)
if [ ! -z "$VITE_BEEHIIV_API_KEY" ]; then
  log_task "Beehiiv API key detected (Checklist: Pre-Deployment Preparation)"
fi

# Verify Beehiiv iframe src in NewsletterSignup.tsx
log_task "Verifying Beehiiv iframe src (Checklist: Feature Verification)"
if ! grep -q "https://embeds.beehiiv.com/459544e2-b4ac-473d-b735-38470ab16e0c" src/components/newsletter/NewsletterSignup.tsx; then
  echo "Warning: Beehiiv iframe src not found in NewsletterSignup.tsx, verify configuration"
fi

# Verify production URL
log_task "Verifying production URL (Checklist: Deployment Day)"
if ! curl --output /dev/null --silent --head --fail https://speakeasyai.com; then
  echo "Error: Production URL https://speakeasyai.com is not accessible"
  exit 1
fi

# Verify repository state
log_task "Checking repository state (Checklist: Pre-Deployment Preparation)"
git fetch origin
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: Uncommitted changes detected (Checklist: Pre-Deployment Preparation)"
  exit 1
fi

# Install dependencies
log_task "Installing dependencies (Checklist: Pre-Deployment Preparation)"
npm install

# Run linting
log_task "Running linting (Checklist: Deployment Day)"
npm run lint

# Run tests
log_task "Running tests (Checklist: Deployment Day)"
npm run test

# Build for production
log_task "Building for production (Checklist: Deployment Day)"
npm run build

# Verify build
log_task "Verifying build (Checklist: Deployment Day)"
if [ ! -f "dist/index.html" ]; then
  echo "Error: Build failed, dist/index.html not found (Checklist: Deployment Day)"
  exit 1
fi

# Run Lighthouse audit
log_task "Running Lighthouse audit (Checklist: Performance and Security)"
npm run lighthouse || echo "Warning: Lighthouse audit failed, review lighthouse-report.html"

# Deploy to production
log_task "Deploying to production (Checklist: Deployment Day)"
vercel --prod

# Verify production
log_task "Verifying production (Checklist: Deployment Day)"
sleep 5 # Wait for deployment propagation
curl -s -o /dev/null -w "%{http_code}" https://speakeasyai.com | grep 200 || {
  echo "Error: Production verification failed, consider rollback (Checklist: Rollback Plan)"
  exit 1
}

# Post-deployment notification
log_task "Sending deployment notification (Checklist: Post-Deployment Monitoring)"
# REPLACE with your Slack webhook URL before use
SLACK_WEBHOOK="https://hooks.slack.com/services/your/slack/webhook"
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"SpeakEasyAI deployed successfully! Check https://speakeasyai.com"}' \
  "$SLACK_WEBHOOK" || echo "Warning: Slack notification failed, verify webhook URL"

# Update checklist
log_task "Updating deployment progress (Checklist: Progress Tracking)"
echo "Deployment complete! Check https://speakeasyai.com"
cat deployment.log
