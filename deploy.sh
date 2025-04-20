
#!/bin/bash
# deploy.sh - Main deployment script (Refactored v2.0)

# Exit on any error
set -e

# Source utility scripts
SCRIPTS_DIR="scripts/deploy"
source "$SCRIPTS_DIR/utils.sh"
source "$SCRIPTS_DIR/env-check.sh"
source "$SCRIPTS_DIR/repo-check.sh"
source "$SCRIPTS_DIR/build.sh"
source "$SCRIPTS_DIR/vercel.sh"
source "$SCRIPTS_DIR/notifications.sh"

# Initialize log file
initialize_log

# Make scripts executable
ensure_executable

# Verify configuration
check_beehiiv_config
check_slack_webhook

# Check environment variables
check_environment
if [ $? -eq 1 ]; then
  echo "ERROR: Missing or invalid environment variables. Check deployment.log for details. (Checklist: Section 7)"
  exit 1
fi

# Verify repository state
check_repository || exit 1

# Run build pipeline
install_dependencies || exit 1
run_linting || exit 1
run_tests || exit 1
build_production || exit 1
run_lighthouse

# Deploy to Vercel
check_vercel || exit 1
deploy_production || exit 1
verify_production || exit 1

# Post-deployment tasks
send_notification
update_checklist

# Print error summary if any
print_error_summary

# Log completion
log_task "Completed deployment successfully at $(date '+%Y-%m-%d %H:%M:%S')"
echo "Deployment complete! Check https://speakeasyai.com"
cat deployment.log
