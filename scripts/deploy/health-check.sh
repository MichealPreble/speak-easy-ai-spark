
#!/bin/bash
# health-check.sh - Post-deployment health verification

source "$(dirname "$0")/utils.sh"

# Inherit retry configuration from vercel.sh
MAX_ATTEMPTS=5
INITIAL_WAIT=5
MAX_WAIT=30

# Exponential backoff calculator (reused pattern)
calculate_wait_time() {
  local attempt=$1
  local wait_time=$((INITIAL_WAIT * 2 ** (attempt - 1)))
  echo $((wait_time > MAX_WAIT ? MAX_WAIT : wait_time))
}

# Check Supabase connection
check_supabase_connection() {
  log_task "Verifying Supabase connectivity (Checklist: Section 11)"
  local response=$(curl -s -o /dev/null -w "%{http_code}" https://speakeasyai.com/api/health/supabase)
  if [ "$response" = "200" ]; then
    return 0
  fi
  return 1
}

# Verify API routes
check_api_routes() {
  log_task "Verifying API routes (Checklist: Section 11)"
  local response=$(curl -s -o /dev/null -w "%{http_code}" https://speakeasyai.com/api/health)
  if [ "$response" = "200" ]; then
    return 0
  fi
  return 1
}

# Main health check function with retries
verify_health() {
  log_task "Running post-deployment health checks (Checklist: Section 11)"
  
  # Initial wait for deployment stabilization
  sleep $INITIAL_WAIT
  
  for attempt in $(seq 1 $MAX_ATTEMPTS); do
    # Check main app loads
    if ! curl -s -o /dev/null -w "%{http_code}" https://speakeasyai.com | grep -q "200"; then
      if [ $attempt -lt $MAX_ATTEMPTS ]; then
        local wait_time=$(calculate_wait_time $attempt)
        log_task "Main app check failed. Attempt $attempt. Retrying in ${wait_time}s..."
        sleep $wait_time
        continue
      fi
      add_error "Main application health check failed after $MAX_ATTEMPTS attempts"
      return 1
    fi
    
    # Check Supabase connection
    if ! check_supabase_connection; then
      if [ $attempt -lt $MAX_ATTEMPTS ]; then
        local wait_time=$(calculate_wait_time $attempt)
        log_task "Supabase connection check failed. Attempt $attempt. Retrying in ${wait_time}s..."
        sleep $wait_time
        continue
      fi
      add_error "Supabase connection check failed after $MAX_ATTEMPTS attempts"
      return 1
    fi
    
    # Check API routes
    if ! check_api_routes; then
      if [ $attempt -lt $MAX_ATTEMPTS ]; then
        local wait_time=$(calculate_wait_time $attempt)
        log_task "API routes check failed. Attempt $attempt. Retrying in ${wait_time}s..."
        sleep $wait_time
        continue
      fi
      add_error "API routes check failed after $MAX_ATTEMPTS attempts"
      return 1
    fi
    
    log_task "All health checks passed successfully on attempt $attempt"
    return 0
  done
  
  return 1
}

# Make the script executable when sourced
chmod +x "$0"
