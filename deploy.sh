#!/bin/bash
# deploy.sh - v1.0

# Exit on any error
set -e

# Log tasks for progress tracking
log_task() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> deployment.log
}

# Track errors for summary
ERRORS=()

# Initialize log file with header
COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
APP_VERSION=$(jq -r '.version' package.json 2>/dev/null || echo "unknown")
CI_ENV=""
if [ "$CI" = "true" ] || [ "$GITHUB_ACTIONS" = "true" ]; then
  CI_ENV=" - CI: GitHub Actions"
fi

echo "SpeakEasyAI v$APP_VERSION Deployment Log - Started $(date '+%Y-%m-%d %H:%M:%S') - Script v1.0 - Commit $COMMIT_HASH - Branch $BRANCH_NAME$CI_ENV" > deployment.log
log_task "Initializing deployment process"

# Make script executable
log_task "Ensuring deploy.sh is executable (Checklist: Section 1)"
chmod +x deploy.sh

# Check Vercel CLI and version with retry
log_task "Verifying Vercel CLI installation (Checklist: Section 10)"
if ! command -v vercel &> /dev/null; then
  ERRORS+=("[$(date '+%Y-%m-%d %H:%M:%S')] - Vercel CLI not installed, run 'npm install -g vercel@latest' (Checklist: Section 10)")
  echo "${ERRORS[-1]}"
  exit 1
fi
VERCEL_VERSION=""
for attempt in 1 2; do
  VERCEL_VERSION=$(vercel --version 2>/dev/null | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+' || echo "0.0.0")
  if [ "$VERCEL_VERSION" != "0.0.0" ]; then
    break
  fi
  if [ $attempt -eq 1 ]; then
    log_task "Retrying Vercel CLI version check after 5 seconds (Checklist: Section 10)"
    sleep 5
  fi
done
if [ "$VERCEL_VERSION" = "0.0.0" ]; then
  ERRORS+=("[$(date '+%Y-%m-%d %H:%M:%S')] - Failed to retrieve Vercel CLI version, check network and retry (Checklist: Section 10)")
  echo "${ERRORS[-1]}"
  exit 1
fi
if ! echo "$VERCEL_VERSION 28.0.0" | sort -V | tail -n 1 | grep -q "28.0.0"; then
  ERRORS+=("[$(date '+%Y-%m-%d %H:%M:%S')] - Vercel CLI version $VERCEL_VERSION is outdated, requires >=28.0.0, run 'npm install -g vercel@latest' (Checklist: Section 10)")
  echo "${ERRORS[-1]}"
  exit 1
fi

# Check environment variables
log_task "Verifying environment variables (Checklist: Section 7)"
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  ERRORS+=("[$(date '+%Y-%m-%d %H:%M:%S')] - VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env.production (Checklist: Section 7)")
  echo "${ERRORS[-1]}"
  exit 1
fi
# Check Beehiiv API key (optional)
if [ ! -z "$VITE_BEEHIIV_API_KEY" ]; then
  log_task "Detecting Beehiiv API key (Checklist: Section 7)"
fi

# Verify Beehiiv iframe src in NewsletterSignup.tsx
log_task "Verifying Beehiiv iframe src (Checklist: Section 3)"
if ! grep -q "https://embeds.beehiiv.com/459544e2-b4ac-473d-b735-38470ab16e0c" src/components/newsletter/NewsletterSignup.tsx; then
  echo "Warning: Beehiiv iframe src not found in NewsletterSignup.tsx, verify configuration (Checklist: Section 3)"
fi

# Check Slack webhook URL
log_task "Verifying Slack webhook URL (Checklist: Section 10)"
if grep -q "https://hooks.slack.com/services/your/slack/webhook" deploy.sh; then
  echo "Warning: Slack webhook URL is still placeholder, replace with valid URL (e.g., https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX) (Checklist: Section 10)"
fi

# Verify repository state
log_task "Verifying repository state (Checklist: Section 1)"
git fetch origin
if [ -n "$(git status --porcelain)" ]; then
  ERRORS+=("[$(date '+%Y-%m-%d %H:%M:%S')] - Uncommitted changes detected (Checklist: Section 1)")
  echo "${ERRORS[-1]}"
  exit 1
fi

# Install dependencies
log_task "Installing dependencies (Checklist: Section 1)"
npm install || {
  ERRORS+=("[$(date '+%Y-%m-%d %H:%M:%S')] - Dependency installation failed (Checklist: Section 1)")
  echo "${ERRORS[-1]}"
  exit 1
}

# Run linting
log_task "Running linting (Checklist: Section 10)"
npm run lint || {
  ERRORS+=("[$(date '+%Y-%m-%d %H:%M:%S')] - Linting failed (Checklist: Section 10)")
  echo "${ERRORS[-1]}"
  exit 1
}

# Run tests
log_task "Running tests (Checklist: Section 10)"
npm run test || {
  ERRORS+=("[$(date '+%Y-%m-%d %H:%M:%S')] - Tests failed (Checklist: Section 10)")
  echo "${ERRORS[-1]}"
  exit 1
}

# Build for production
log_task "Building for production (Checklist: Section 10)"
npm run build || {
  ERRORS+=("[$(date '+%Y-%m-%d %H:%M:%S')] - Build failed (Checklist: Section 10)")
  echo "${ERRORS[-1]}"
  exit 1
}

# Verify build
log_task "Verifying build (Checklist: Section 10)"
if [ ! -f "dist/index.html" ]; then
  ERRORS+=("[$(date '+%Y-%m-%d %H:%M:%S')] - Build failed, dist/index.html not found (Checklist: Section 10)")
  echo "${ERRORS[-1]}"
  exit 1
fi

# Run Lighthouse audit
log_task "Running Lighthouse audit (Checklist: Section 10)"
npm run lighthouse || echo "Warning: Lighthouse audit failed, review lighthouse-report.html (Checklist: Section 4)"

# Deploy to production
log_task "Deploying to production (Checklist: Section 10)"
vercel --prod || {
  ERRORS+=("[$(date '+%Y-%m-%d %H:%M:%S')] - Deployment failed, check Vercel dashboard (Checklist: Section 10)")
  echo "${ERRORS[-1]}"
  exit 1
}

# Verify production with retries
log_task "Verifying production (Checklist: Section 10)"
sleep 5 # Wait for deployment propagation
curl --retry 3 --retry-delay 5 -s -o /dev/null -w "%{http_code}" https://speakeasyai.com | grep 200 || {
  ERRORS+=("[$(date '+%Y-%m-%d %H:%M:%S')] - Production verification failed, check https://speakeasyai.com and Vercel dashboard (Checklist: Section 11)")
  echo "${ERRORS[-1]}"
  exit 1
}

# Post-deployment notification
log_task "Sending deployment notification (Checklist: Section 12)"
# REPLACE with your Slack webhook URL before use (e.g., https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX)
# Set LOG_URL to your CI/CD log URL (e.g., GitHub Actions artifact URL or Vercel log URL)
SLACK_WEBHOOK="https://hooks.slack.com/services/your/slack/webhook"
LOG_URL="[CI/CD Log URL]"
if [ -n "$SLACK_WEBHOOK" ] && [ "$SLACK_WEBHOOK" != "https://hooks.slack.com/services/your/slack/webhook" ] && { [ "$CI" = "true" ] || [ "$GITHUB_ACTIONS" = "true" ]; }; then
  curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"SpeakEasyAI v$APP_VERSION deployed successfully at $(date '+%Y-%m-%d %H:%M:%S')! Check https://speakeasyai.com. Log: $LOG_URL\"}" \
    "$SLACK_WEBHOOK" || {
    log_task "Warning: Slack notification failed, verify webhook URL (Checklist: Section 10)"
  }
elif [ -n "$SLACK_WEBHOOK" ] && [ "$SLACK_WEBHOOK" != "https://hooks.slack.com/services/your/slack/webhook" ]; then
  log_task "Warning: Slack notification skipped, invalid webhook URL in non-CI/CD environment (Checklist: Section 10)"
else
  log_task "Skipping Slack notification in non-CI/CD environment or unset webhook (Checklist: Section 10)"
fi

# Update checklist
log_task "Updating DEPLOYMENT_CHECKLIST.md (Checklist: Section 13)"
# Manual update recommended: Create PR to mark deployment tasks complete

# Log error summary if any
if [ ${#ERRORS[@]} -gt 0 ]; then
  echo "Error Summary: Check deployment.log and Vercel dashboard for details (Checklist: Section 11)" >> deployment.log
  for error in "${ERRORS[@]}"; do
    echo "- $error" >> deployment.log
  done
  echo "Total Errors: ${#ERRORS[@]}" >> deployment.log
fi

# Log completion
log_task "Completed deployment successfully at $(date '+%Y-%m-%d %H:%M:%S')"
echo "Deployment complete! Check https://speakeasyai.com"
cat deployment.log
