
#!/bin/bash
# repo-check.sh - Repository state validation

source "$(dirname "$0")/utils.sh"

# Verify repository state
check_repository() {
  log_task "Verifying repository state (Checklist: Section 1)"
  git fetch origin
  if [ -n "$(git status --porcelain)" ]; then
    add_error "Uncommitted changes detected (Checklist: Section 1)"
    return 1
  fi
  return 0
}

# Ensure script is executable
ensure_executable() {
  log_task "Ensuring deploy.sh is executable (Checklist: Section 1)"
  chmod +x deploy.sh
  
  # Also make all deployment scripts executable
  find "$(dirname "$0")" -name "*.sh" -exec chmod +x {} \;
}
