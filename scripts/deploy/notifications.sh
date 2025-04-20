
#!/bin/bash
# notifications.sh - Deployment notifications

source "$(dirname "$0")/utils.sh"

# Post-deployment notification
send_notification() {
  log_task "Sending deployment notification (Checklist: Section 12)"
  # REPLACE with your Slack webhook URL before use (e.g., https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX)
  # Set LOG_URL to your CI/CD log URL (e.g., GitHub Actions artifact URL or Vercel log URL)
  SLACK_WEBHOOK="https://hooks.slack.com/services/your/slack/webhook"
  LOG_URL="[CI/CD Log URL]"
  APP_VERSION=$(jq -r '.version' package.json 2>/dev/null || echo "unknown")
  
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
}

# Update checklist
update_checklist() {
  log_task "Updating DEPLOYMENT_CHECKLIST.md (Checklist: Section 13)"
  # Manual update recommended: Create PR to mark deployment tasks complete
}
