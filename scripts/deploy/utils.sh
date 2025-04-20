
#!/bin/bash
# utils.sh - Common utilities for deployment scripts

# Log tasks for progress tracking
log_task() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> deployment.log
}

# Initialize log file with header
initialize_log() {
  COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
  BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
  APP_VERSION=$(jq -r '.version' package.json 2>/dev/null || echo "unknown")
  CI_ENV=""
  if [ "$CI" = "true" ] || [ "$GITHUB_ACTIONS" = "true" ]; then
    CI_ENV=" - CI: GitHub Actions"
  fi

  echo "SpeakEasyAI v$APP_VERSION Deployment Log - Started $(date '+%Y-%m-%d %H:%M:%S') - Script v1.1 - Commit $COMMIT_HASH - Branch $BRANCH_NAME$CI_ENV" > deployment.log
  log_task "Initializing deployment process"
}

# Track errors for summary
ERRORS=()

# Add error to the tracked list
add_error() {
  ERRORS+=("[$(date '+%Y-%m-%d %H:%M:%S')] - $1")
  echo "${ERRORS[-1]}"
}

# Print error summary if any errors occurred
print_error_summary() {
  if [ ${#ERRORS[@]} -gt 0 ]; then
    echo "Error Summary: Check deployment.log and Vercel dashboard for details (Checklist: Section 11)" >> deployment.log
    for error in "${ERRORS[@]}"; do
      echo "- $error" >> deployment.log
    done
    echo "Total Errors: ${#ERRORS[@]}" >> deployment.log
  fi
}
