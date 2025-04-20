
#!/bin/bash
# env-check.sh - Environment validation script

source "$(dirname "$0")/utils.sh"

# Check environment variables with improved validation
check_environment() {
  log_task "Verifying environment variables (Checklist: Section 7)"
  ENV_ERROR=0

  # Check for VITE_SUPABASE_URL
  if [ -z "${VITE_SUPABASE_URL}" ]; then
    log_task "ERROR: VITE_SUPABASE_URL is not set"
    add_error "VITE_SUPABASE_URL is not set (Checklist: Section 7)"
    ENV_ERROR=1
  else
    # Validate URL format
    if ! echo "${VITE_SUPABASE_URL}" | grep -q "^https://.*\.supabase\.co$"; then
      log_task "WARNING: VITE_SUPABASE_URL does not match expected format (https://example.supabase.co)"
    else
      log_task "VITE_SUPABASE_URL is valid"
    fi
  fi

  # Check for VITE_SUPABASE_ANON_KEY
  if [ -z "${VITE_SUPABASE_ANON_KEY}" ]; then
    log_task "ERROR: VITE_SUPABASE_ANON_KEY is not set"
    add_error "VITE_SUPABASE_ANON_KEY is not set (Checklist: Section 7)"
    ENV_ERROR=1
  else
    # Validate key format (basic check for eyJhbGciOi format)
    if ! echo "${VITE_SUPABASE_ANON_KEY}" | grep -q "^eyJh"; then
      log_task "WARNING: VITE_SUPABASE_ANON_KEY does not match expected format"
    else
      log_task "VITE_SUPABASE_ANON_KEY is valid"
    fi
  fi

  # Verify Beehiiv API key (optional)
  if [ ! -z "$VITE_BEEHIIV_API_KEY" ]; then
    log_task "Detecting Beehiiv API key (Checklist: Section 7)"
  fi

  return $ENV_ERROR
}

# Verify Beehiiv iframe src in NewsletterSignup.tsx
check_beehiiv_config() {
  log_task "Verifying Beehiiv iframe src (Checklist: Section 3)"
  if ! grep -q "https://embeds.beehiiv.com/459544e2-b4ac-473d-b735-38470ab16e0c" src/components/newsletter/NewsletterSignup.tsx; then
    echo "Warning: Beehiiv iframe src not found in NewsletterSignup.tsx, verify configuration (Checklist: Section 3)"
  fi
}

# Check Slack webhook URL
check_slack_webhook() {
  log_task "Verifying Slack webhook URL (Checklist: Section 10)"
  SCRIPTS_DIR="$(dirname "$0")"
  if grep -q "https://hooks.slack.com/services/your/slack/webhook" "$SCRIPTS_DIR/notifications.sh"; then
    echo "Warning: Slack webhook URL is still placeholder, replace with valid URL (e.g., https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX) (Checklist: Section 10)"
  fi
}
