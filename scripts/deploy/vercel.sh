
#!/bin/bash
# vercel.sh - Vercel deployment script with retry logic

source "$(dirname "$0")/utils.sh"

# Retry configuration
MAX_ATTEMPTS=3
INITIAL_WAIT=5
MAX_WAIT=30

# Exponential backoff wait calculator
calculate_wait_time() {
  local attempt=$1
  local wait_time=$((INITIAL_WAIT * 2 ** (attempt - 1)))
  echo $((wait_time > MAX_WAIT ? MAX_WAIT : wait_time))
}

# Check Vercel CLI and version with retry
check_vercel() {
  log_task "Verifying Vercel CLI installation (Checklist: Section 10)"
  if ! command -v vercel &> /dev/null; then
    add_error "Vercel CLI not installed, run 'npm install -g vercel@latest' (Checklist: Section 10)"
    return 1
  fi
  
  VERCEL_VERSION=""
  for attempt in $(seq 1 $MAX_ATTEMPTS); do
    VERCEL_VERSION=$(vercel --version 2>/dev/null | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+' || echo "0.0.0")
    if [ "$VERCEL_VERSION" != "0.0.0" ]; then
      break
    fi
    if [ $attempt -lt $MAX_ATTEMPTS ]; then
      local wait_time=$(calculate_wait_time $attempt)
      log_task "Attempt $attempt failed. Retrying Vercel CLI version check after ${wait_time}s (Checklist: Section 10)"
      sleep $wait_time
    fi
  done
  
  if [ "$VERCEL_VERSION" = "0.0.0" ]; then
    add_error "Failed to retrieve Vercel CLI version after $MAX_ATTEMPTS attempts (Checklist: Section 10)"
    return 1
  fi
  
  if ! echo "$VERCEL_VERSION 28.0.0" | sort -V | tail -n 1 | grep -q "28.0.0"; then
    add_error "Vercel CLI version $VERCEL_VERSION is outdated, requires >=28.0.0, run 'npm install -g vercel@latest' (Checklist: Section 10)"
    return 1
  fi
  
  return 0
}

# Deploy to production with retries
deploy_production() {
  log_task "Deploying to production (Checklist: Section 10)"
  
  for attempt in $(seq 1 $MAX_ATTEMPTS); do
    if vercel --prod; then
      log_task "Deployment successful on attempt $attempt"
      return 0
    fi
    
    if [ $attempt -lt $MAX_ATTEMPTS ]; then
      local wait_time=$(calculate_wait_time $attempt)
      log_task "Attempt $attempt failed. Retrying deployment after ${wait_time}s (Checklist: Section 10)"
      sleep $wait_time
    else
      add_error "Deployment failed after $MAX_ATTEMPTS attempts, check Vercel dashboard (Checklist: Section 10)"
      return 1
    fi
  done
}

# Verify production with retries and exponential backoff
verify_production() {
  log_task "Verifying production (Checklist: Section 10)"
  
  # Initial wait for deployment propagation
  sleep $INITIAL_WAIT
  
  for attempt in $(seq 1 $MAX_ATTEMPTS); do
    if curl -s -o /dev/null -w "%{http_code}" https://speakeasyai.com | grep -q "200"; then
      log_task "Production verification successful on attempt $attempt"
      return 0
    fi
    
    if [ $attempt -lt $MAX_ATTEMPTS ]; then
      local wait_time=$(calculate_wait_time $attempt)
      log_task "Attempt $attempt failed. Retrying verification after ${wait_time}s (Checklist: Section 11)"
      sleep $wait_time
    else
      add_error "Production verification failed after $MAX_ATTEMPTS attempts, check https://speakeasyai.com and Vercel dashboard (Checklist: Section 11)"
      return 1
    fi
  done
  
  return 1
}

