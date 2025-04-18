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
CI_ENV=""
if [ "$CI" = "true" ] || [ "$GITHUB_ACTIONS" = "true" ]; then
  CI_ENV=" - CI: GitHub Actions"
fi
echo "SpeakEasyAI Deployment Log - Started $(date '+%Y-%m-%d %H:%M:%S') - Script v1.0 - Commit $COMMIT_HASH - Branch $BRANCH_NAME$CI_ENV" > deployment.log

# Make script executable
log_task "Ensuring deploy.sh is executable (Checklist: Section 1)"
chmod +x deploy.sh

# Check Vercel CLI and version
log_task "Verifying Vercel CLI installation (Checklist: Section 10)"
if ! command -v vercel &> /dev/null; then
  ERRORS+=("[$(date '+%Y-%m-%d %H:%M:%S')] Vercel CLI not installed, run 'npm install -g vercel@latest' (Checklist: Section 10)")
  echo "${ERRORS[-1]}"
  exit 1
fi
VERCEL_VERSION=$(vercel --version 2>/dev/null | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+' || echo "0.0.0")
if ! echo "$VERCEL_VERSION 28.0.0" | sort -V | tail -n 1 | grep -q "28.0.0"; then
  ERRORS+=("[$(date '+%Y-%m-%d %H:%M:%S')] Vercel CLI version $VERCEL_VERSION is outdated, run 'npm install -g vercel@latest' (Checklist: Section 10)")
  echo "${ERRORS[-1]}"
  exit 1
fi

# Check environment variables
log_task "Verifying environment variables (Checklist: Section 1)"
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  ERRORS+=("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env.production (Checklist: Section 1)")
  echo "${ERRORS[-1]}"
  exit 1
fi

# Check Beehiiv API key (optional)
if [ ! -z "$VITE_BEEHIIV_API_KEY" ]; then
  log_task "Verifying Beehiiv API key (Checklist: Section 1)"
fi

# Verify Beehiiv iframe src in NewsletterSignup.tsx
log_task "Verifying Beehiiv iframe configuration (Checklist: Section 3)"
if ! grep -q "https://embeds.beehiiv.com/459544e2-b4ac-473d-b735-38470ab16e0c" src/components/newsletter/NewsletterSignup.tsx; then
  echo "Warning: Beehiiv iframe src not found in NewsletterSignup.tsx, verify configuration (Checklist: Section 3)"
fi

# Check Slack webhook URL
log_task "Verifying Slack webhook configuration (Checklist: Section 10)"
if grep -q "https://hooks.slack.com/services/your/slack/webhook" deploy.sh; then
  echo "Warning: Slack webhook URL is still using placeholder. Replace with actual URL (e.g., https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX) (Checklist: Section 10)"
fi

# Verify repository state
log_task "Verifying repository state (Checklist: Section 1)"
git fetch origin
if [ -n "$(git status --porcelain)" ]; then
  ERRORS+=("Uncommitted changes detected (Checklist: Section 1)")
  echo "${ERRORS[-1]}"
  exit 1
fi

# Install dependencies
log_task "Installing dependencies (Checklist: Section 1)"
npm install

# Run linting
log_task "Running linting checks (Checklist: Section 10)"
npm run lint || {
  ERRORS+=("Linting failed (Checklist: Section 10)")
  echo "${ERRORS[-1]}"
  exit 1
}

# Run tests
log_task "Executing test suite (Checklist: Section 10)"
npm run test || {
  ERRORS+=("Tests failed (Checklist: Section 10)")
  echo "${ERRORS[-1]}"
  exit 1
}

# Build for production
log_task "Building production bundle (Checklist: Section 10)"
npm run build || {
  ERRORS+=("Build failed (Checklist: Section 10)")
  echo "${ERRORS[-1]}"
  exit 1
}

# Verify build
log_task "Verifying build output (Checklist: Section 10)"
if [ ! -f "dist/index.html" ]; then
  ERRORS+=("Build verification failed, dist/index.html not found (Checklist: Section 10)")
  echo "${ERRORS[-1]}"
  exit 1
fi

# Run Lighthouse audit
log_task "Running Lighthouse performance audit (Checklist: Section 4)"
npm run lighthouse || echo "Warning: Lighthouse audit failed, review lighthouse-report.html (Checklist: Section 4)"

# Deploy to production
log_task "Deploying to production (Checklist: Section 10)"
vercel --prod || {
  ERRORS+=("Deployment failed, check Vercel dashboard (Checklist: Section 10)")
  echo "${ERRORS[-1]}"
  exit 1
}

# Verify production with retries
log_task "Verifying production deployment (Checklist: Section 10)"
for i in {1..3}; do
  echo "Attempt $i of 3 to verify production URL..."
  if curl --max-time 10 -s -o /dev/null -w "%{http_code}" https://speakeasyai.com | grep -q "200"; then
    break
  fi
  if [ $i -eq 3 ]; then
    ERRORS+=("Production verification failed after 3 attempts. Check Vercel dashboard and https://speakeasyai.com (Checklist: Section 11)")
    echo "${ERRORS[-1]}"
    exit 1
  fi
  sleep 5
done

# Post-deployment notification
log_task "Sending deployment notification (Checklist: Section 12)"
if [ "$CI" = "true" ] || [ "$GITHUB_ACTIONS" = "true" ]; then
  # REPLACE with your Slack webhook URL before use (e.g., https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX)
  # Set LOG_URL to your CI/CD log URL (e.g., GitHub Actions artifact URL or Vercel log URL)
  SLACK_WEBHOOK="https://hooks.slack.com/services/your/slack/webhook"
  LOG_URL="[CI/CD Log URL]"
  if [ ! -z "$SLACK_WEBHOOK" ] && [ "$SLACK_WEBHOOK" != "https://hooks.slack.com/services/your/slack/webhook" ]; then
    curl -X POST -H 'Content-type: application/json' \
      --data "{\"text\":\"SpeakEasyAI deployed successfully at $(date '+%Y-%m-%d %H:%M:%S')! Check https://speakeasyai.com. Log: $LOG_URL\"}" \
      "$SLACK_WEBHOOK" || {
        log_task "Warning: Slack notification failed, verify webhook URL (Checklist: Section 10)"
      }
  else
    log_task "Skipping Slack notification in CI/CD environment (webhook not configured)"
  fi
else
  log_task "Skipping Slack notification (not in CI/CD environment)"
fi

# Log error summary if any
if [ ${#ERRORS[@]} -gt 0 ]; then
  echo "Error Summary: Check deployment.log and Vercel dashboard for details (Checklist: Section 11)" >> deployment.log
  for error in "${ERRORS[@]}"; do
    echo "- $error" >> deployment.log
  done
fi

echo "Deployment completed successfully at $(date '+%Y-%m-%d %H:%M:%S')! Check https://speakeasyai.com"
cat deployment.log
