
#!/bin/bash
# build.sh - Build and testing script

source "$(dirname "$0")/utils.sh"

# Install dependencies
install_dependencies() {
  log_task "Installing dependencies (Checklist: Section 1)"
  npm install || {
    add_error "Dependency installation failed (Checklist: Section 1)"
    return 1
  }
  return 0
}

# Run linting
run_linting() {
  log_task "Running linting (Checklist: Section 10)"
  npm run lint || {
    add_error "Linting failed (Checklist: Section 10)"
    return 1
  }
  return 0
}

# Run tests
run_tests() {
  log_task "Running tests (Checklist: Section 10)"
  npm run test || {
    add_error "Tests failed (Checklist: Section 10)"
    return 1
  }
  return 0
}

# Build for production
build_production() {
  log_task "Building for production (Checklist: Section 10)"
  npm run build || {
    add_error "Build failed (Checklist: Section 10)"
    return 1
  }
  
  # Verify build
  log_task "Verifying build (Checklist: Section 10)"
  if [ ! -f "dist/index.html" ]; then
    add_error "Build failed, dist/index.html not found (Checklist: Section 10)"
    return 1
  fi
  
  return 0
}

# Run Lighthouse audit
run_lighthouse() {
  log_task "Running Lighthouse audit (Checklist: Section 10)"
  npm run lighthouse || echo "Warning: Lighthouse audit failed, review lighthouse-report.html (Checklist: Section 4)"
}
