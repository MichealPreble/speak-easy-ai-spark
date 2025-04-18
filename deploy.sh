
#!/bin/bash
# deploy.sh

# Exit on any error
set -e

# Log tasks for progress tracking
log_task() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> deployment.log
}

# Check environment variables
log_task "Checking environment variables"
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env.production"
  exit 1
fi
# Placeholder for Beehiiv API key check
if [ ! -z "$VITE_BEEHIIV_API_KEY" ]; then
  log_task "Beehiiv API key detected"
fi

# Verify repository state
log_task "Checking repository state"
git fetch origin
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: Uncommitted changes detected"
  exit 1
fi

# Install dependencies
log_task "Installing dependencies"
npm install

# Run linting
log_task "Running linting"
npm run lint

# Run tests
log_task "Running tests"
npm run test

# Build for production
log_task "Building for production"
npm run build

# Verify build
log_task "Verifying build"
if [ ! -f "dist/index.html" ]; then
  echo "Error: Build failed, dist/index.html not found"
  exit 1
fi

# Run Lighthouse audit
log_task "Running Lighthouse audit"
npm run lighthouse || echo "Warning: Lighthouse audit failed, review lighthouse-report.html"

# Deploy to production
log_task "Deploying to production"
vercel --prod

# Verify production
log_task "Verifying production"
sleep 5 # Wait for deployment propagation
curl -s -o /dev/null -w "%{http_code}" https://your-production-url.com | grep 200 || {
  echo "Error: Production verification failed, consider rollback"
  exit 1
}

# Update checklist
log_task "Updating DEPLOYMENT_CHECKLIST.md"
# Manual update recommended: Create PR to mark deployment tasks complete
echo "Deployment complete! Check https://your-production-url.com"
cat deployment.log
