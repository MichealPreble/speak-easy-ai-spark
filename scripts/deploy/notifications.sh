
#!/bin/bash
# notifications.sh - Enhanced deployment notifications

source "$(dirname "$0")/utils.sh"

# Post-deployment notification with slash commands
send_notification() {
  log_task "Sending deployment notification (Checklist: Section 12)"
  SLACK_WEBHOOK="https://hooks.slack.com/services/your/slack/webhook"
  LOG_URL="[CI/CD Log URL]"
  APP_VERSION=$(jq -r '.version' package.json 2>/dev/null || echo "unknown")
  COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
  
  if [ -n "$SLACK_WEBHOOK" ] && [ "$SLACK_WEBHOOK" != "https://hooks.slack.com/services/your/slack/webhook" ] && { [ "$CI" = "true" ] || [ "$GITHUB_ACTIONS" = "true" ]; }; then
    local MESSAGE="{
      \"text\": \"🚀 SpeakEasyAI v$APP_VERSION deployed successfully!\",
      \"blocks\": [
        {
          \"type\": \"section\",
          \"text\": {
            \"type\": \"mrkdwn\",
            \"text\": \"*🚀 SpeakEasyAI v$APP_VERSION Deployed!*\\n• Commit: \`$COMMIT_HASH\`\\n• Time: $(date '+%Y-%m-%d %H:%M:%S')\\n• URL: https://speakeasyai.com\"
          }
        },
        {
          \"type\": \"actions\",
          \"elements\": [
            {
              \"type\": \"button\",
              \"text\": {
                \"type\": \"plain_text\",
                \"text\": \"View Logs\"
              },
              \"url\": \"$LOG_URL\"
            }
          ]
        }
      ]
    }"
    
    curl -X POST -H 'Content-type: application/json' \
      --data "$MESSAGE" \
      "$SLACK_WEBHOOK" || {
      log_task "Warning: Slack notification failed, verify webhook URL (Checklist: Section 10)"
    }
  elif [ -n "$SLACK_WEBHOOK" ] && [ "$SLACK_WEBHOOK" != "https://hooks.slack.com/services/your/slack/webhook" ]; then
    log_task "Warning: Slack notification skipped, invalid webhook URL in non-CI/CD environment (Checklist: Section 10)"
  else
    log_task "Skipping Slack notification in non-CI/CD environment or unset webhook (Checklist: Section 10)"
  fi
}

# Update deployment checklist with completion time
update_checklist() {
  log_task "Updating DEPLOYMENT_CHECKLIST.md (Checklist: Section 13)"
  DEPLOY_TIME=$(date '+%Y-%m-%d %H:%M:%S')
  DEPLOY_STATUS=$?
  
  if [ -f "DEPLOYMENT_CHECKLIST.md" ]; then
    sed -i.bak "s/Last deployment: .*/Last deployment: $DEPLOY_TIME - Status: $([ $DEPLOY_STATUS -eq 0 ] && echo '✅ Success' || echo '❌ Failed')/" DEPLOYMENT_CHECKLIST.md
  fi
}

