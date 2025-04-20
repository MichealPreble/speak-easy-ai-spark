
#!/bin/bash
# vercel.sh - Vercel deployment script

source "$(dirname "$0")/utils.sh"

# Check Vercel CLI and version with retry
check_vercel() {
  log_task "Verifying Vercel CLI installation (Checklist: Section 10)"
  if ! command -v vercel &> /dev/null; then
    add_error "Vercel CLI not installed, run 'npm install -g vercel@latest' (Checklist: Section 10)"
    return 1
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
    add_error "Failed to retrieve Vercel CLI version, check network and retry (Checklist: Section 10)"
    return 1
  fi
  
  if ! echo "$VERCEL_VERSION 28.0.0" | sort -V | tail -n 1 | grep -q "28.0.0"; then
    add_error "Vercel CLI version $VERCEL_VERSION is outdated, requires >=28.0.0, run 'npm install -g vercel@latest' (Checklist: Section 10)"
    return 1
  fi
  
  return 0
}

# Deploy to production
deploy_production() {
  log_task "Deploying to production (Checklist: Section 10)"
  vercel --prod || {
    add_error "Deployment failed, check Vercel dashboard (Checklist: Section 10)"
    return 1
  }
  return 0
}

# Verify production with retries
verify_production() {
  log_task "Verifying production (Checklist: Section 10)"
  sleep 5 # Wait for deployment propagation
  curl --retry 3 --retry-delay 5 -s -o /dev/null -w "%{http_code}" https://speakeasyai.com | grep 200 || {
    add_error "Production verification failed, check https://speakeasyai.com and Vercel dashboard (Checklist: Section 11)"
    return 1
  }
  return 0
}
