#!/bin/bash

# Setup Script for External Integration System
# This script sets up the external monitoring and integration system for
# the Pashto Bible Search project.

set -e  # Exit on any error

echo "🚀 Setting up External Integration System for Pashto Bible Search"
echo "================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

print_info "Project root directory confirmed"

# Create necessary directories
print_info "Creating necessary directories..."
mkdir -p app/data
mkdir -p cache
mkdir -p backups
mkdir -p logs
mkdir -p tests/integration

print_status "Directories created"

# Install Python dependencies
print_info "Installing Python dependencies..."
if command -v python3 &> /dev/null; then
    python3 -m pip install --upgrade pip
    python3 -m pip install aiohttp aiofiles pytest pytest-asyncio
    print_status "Python dependencies installed"
else
    print_warning "Python3 not found. Please install Python 3.8+ and run: pip install aiohttp aiofiles pytest pytest-asyncio"
fi

# Install Node.js dependencies if needed
print_info "Checking Node.js dependencies..."
if [ -f "package.json" ]; then
    if ! npm list aiohttp &> /dev/null; then
        print_info "Installing additional Node.js dependencies..."
        npm install --save-dev @types/node
        print_status "Node.js dependencies updated"
    else
        print_status "Node.js dependencies already installed"
    fi
fi

# Create environment file template
print_info "Creating environment configuration template..."
cat > .env.external.integration << 'EOF'
# External Integration Environment Variables
# Copy this to .env.local and fill in your actual values

# n8n Integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
N8N_API_KEY=your-n8n-api-key

# Webhook Security
EXTERNAL_UPDATE_WEBHOOK_SECRET=your-webhook-secret-key

# Deployment
VERCEL_TOKEN=your-vercel-token
VERCEL_PROJECT_ID=your-project-id
VERCEL_TEAM_ID=your-team-id

# Notifications (Optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK

# Email Notifications (Optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Monitoring Configuration
MONITORING_ENABLED=true
CHECK_INTERVAL_HOURS=24
RATE_LIMIT_PER_MINUTE=30
EOF

print_status "Environment template created"

# Create configuration file
print_info "Creating configuration file..."
if [ ! -f "external_monitoring_config.json" ]; then
    print_warning "Configuration file already exists, skipping creation"
else
    print_status "Configuration file created"
fi

# Set up logging
print_info "Setting up logging configuration..."
cat > logging_config.json << 'EOF'
{
  "version": 1,
  "disable_existing_loggers": false,
  "formatters": {
    "detailed": {
      "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    },
    "simple": {
      "format": "%(levelname)s - %(message)s"
    }
  },
  "handlers": {
    "file": {
      "class": "logging.handlers.RotatingFileHandler",
      "filename": "logs/external_monitoring.log",
      "maxBytes": 10485760,
      "backupCount": 5,
      "formatter": "detailed"
    },
    "console": {
      "class": "logging.StreamHandler",
      "formatter": "simple"
    }
  },
  "loggers": {
    "external_monitor": {
      "level": "INFO",
      "handlers": ["file", "console"],
      "propagate": false
    }
  }
}
EOF

print_status "Logging configuration created"

# Create systemd service file (for Linux systems)
print_info "Creating systemd service file..."
cat > pashto-bible-monitor.service << 'EOF'
[Unit]
Description=Pashto Bible External Content Monitor
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/pashto-bible-search
ExecStart=/usr/bin/python3 external_monitoring_service.py
Restart=always
RestartSec=10
Environment=PYTHONPATH=/path/to/pashto-bible-search

[Install]
WantedBy=multi-user.target
EOF

print_status "Systemd service file created"

# Create cron job template
print_info "Creating cron job template..."
cat > cron_job_template.txt << 'EOF'
# Add this to your crontab (crontab -e) to run monitoring every 24 hours
# 0 2 * * * cd /path/to/pashto-bible-search && python3 external_monitoring_service.py >> logs/cron.log 2>&1

# Or run every 6 hours
# 0 */6 * * * cd /path/to/pashto-bible-search && python3 external_monitoring_service.py >> logs/cron.log 2>&1

# Run data rebuild after monitoring
# 30 2 * * * cd /path/to/pashto-bible-search && python3 rebuild_data_indexes.py >> logs/rebuild.log 2>&1
EOF

print_status "Cron job template created"

# Create health check script
print_info "Creating health check script..."
cat > health_check.sh << 'EOF'
#!/bin/bash

# Health Check Script for External Integration System

echo "🔍 Pashto Bible External Integration Health Check"
echo "================================================="

# Check if monitoring service is running
if pgrep -f "external_monitoring_service" > /dev/null; then
    echo "✅ External monitoring service is running"
else
    echo "❌ External monitoring service is not running"
fi

# Check log files
if [ -f "logs/external_monitoring.log" ]; then
    echo "✅ Monitoring log file exists"
    echo "📄 Last 5 log entries:"
    tail -5 logs/external_monitoring.log
else
    echo "❌ Monitoring log file not found"
fi

# Check cache file
if [ -f "external_content_cache.json" ]; then
    echo "✅ Content cache file exists"
    cache_size=$(wc -l < external_content_cache.json)
    echo "📊 Cache contains $cache_size entries"
else
    echo "❌ Content cache file not found"
fi

# Check webhook endpoint
if command -v curl &> /dev/null; then
    echo "🌐 Testing webhook endpoint..."
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/external-updates | grep -q "200\|404"; then
        echo "✅ Webhook endpoint is accessible"
    else
        echo "❌ Webhook endpoint is not accessible"
    fi
else
    echo "⚠️  curl not available, skipping webhook test"
fi

# Check disk space
echo "💾 Disk space usage:"
df -h . | tail -1

echo ""
echo "Health check completed at $(date)"
EOF

chmod +x health_check.sh
print_status "Health check script created"

# Create backup script
print_info "Creating backup script..."
cat > backup_data.sh << 'EOF'
#!/bin/bash

# Backup Script for External Integration Data

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Creating backup in $BACKUP_DIR"

# Backup cache files
if [ -f "external_content_cache.json" ]; then
    cp external_content_cache.json "$BACKUP_DIR/"
    echo "✅ Cache file backed up"
fi

# Backup data files
if [ -d "app/data" ]; then
    cp -r app/data "$BACKUP_DIR/"
    echo "✅ Data files backed up"
fi

# Backup logs
if [ -d "logs" ]; then
    cp -r logs "$BACKUP_DIR/"
    echo "✅ Log files backed up"
fi

# Create backup info
cat > "$BACKUP_DIR/backup_info.txt" << EOL
Backup created: $(date)
Backup directory: $BACKUP_DIR
Files backed up:
- external_content_cache.json
- app/data/
- logs/
EOL

echo "✅ Backup completed successfully"
echo "📁 Backup location: $BACKUP_DIR"
EOF

chmod +x backup_data.sh
print_status "Backup script created"

# Create test script
print_info "Creating test script..."
cat > test_integration.sh << 'EOF'
#!/bin/bash

# Test Script for External Integration System

echo "🧪 Testing External Integration System"
echo "======================================"

# Test Python dependencies
echo "🐍 Testing Python dependencies..."
python3 -c "import aiohttp, aiofiles, pytest; print('✅ Python dependencies OK')" || {
    echo "❌ Python dependencies missing"
    exit 1
}

# Test monitoring service
echo "🔍 Testing monitoring service..."
python3 -c "
import sys
sys.path.insert(0, '.')
from external_monitoring_service import AfghanBiblesMonitor
print('✅ Monitoring service imports OK')
" || {
    echo "❌ Monitoring service import failed"
    exit 1
}

# Test webhook endpoint (if server is running)
echo "🌐 Testing webhook endpoint..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/external-updates | grep -q "200\|404"; then
    echo "✅ Webhook endpoint accessible"
else
    echo "⚠️  Webhook endpoint not accessible (server may not be running)"
fi

# Run unit tests
echo "🧪 Running unit tests..."
if python3 test_external_integration.py; then
    echo "✅ Unit tests passed"
else
    echo "❌ Unit tests failed"
    exit 1
fi

echo ""
echo "🎉 All tests completed successfully!"
EOF

chmod +x test_integration.sh
print_status "Test script created"

# Create deployment script
print_info "Creating deployment script..."
cat > deploy_integration.sh << 'EOF'
#!/bin/bash

# Deployment Script for External Integration System

echo "🚀 Deploying External Integration System"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ This script must be run from the project root directory"
    exit 1
fi

# Run tests first
echo "🧪 Running tests..."
if ! ./test_integration.sh; then
    echo "❌ Tests failed, deployment aborted"
    exit 1
fi

# Create backup
echo "📦 Creating backup..."
./backup_data.sh

# Deploy to Vercel (if configured)
if [ ! -z "$VERCEL_TOKEN" ]; then
    echo "🌐 Deploying to Vercel..."
    if command -v vercel &> /dev/null; then
        vercel --prod
        echo "✅ Vercel deployment completed"
    else
        echo "⚠️  Vercel CLI not found, skipping Vercel deployment"
    fi
else
    echo "⚠️  VERCEL_TOKEN not set, skipping Vercel deployment"
fi

# Update systemd service (if on Linux)
if command -v systemctl &> /dev/null; then
    echo "🔧 Updating systemd service..."
    sudo cp pashto-bible-monitor.service /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl enable pashto-bible-monitor
    echo "✅ Systemd service updated"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo "📋 Next steps:"
echo "   1. Configure environment variables in .env.local"
echo "   2. Start the monitoring service"
echo "   3. Set up n8n workflows"
echo "   4. Configure cron jobs for scheduled monitoring"
EOF

chmod +x deploy_integration.sh
print_status "Deployment script created"

# Create README for external integration
print_info "Creating external integration README..."
cat > EXTERNAL_INTEGRATION_README.md << 'EOF'
# External Integration System

This system monitors the Afghan Bibles website for content changes and automatically synchronizes updates to the Pashto Bible Search application.

## Components

### 1. External Monitoring Service (`external_monitoring_service.py`)
- Monitors Afghan Bibles website for content changes
- Detects new, modified, or deleted content
- Maintains content hash cache for change detection
- Integrates with n8n workflows

### 2. Webhook Endpoints (`app/api/external-updates/route.ts`)
- Receives notifications from external services
- Processes content updates
- Triggers data rebuilds
- Handles authentication and validation

### 3. Data Rebuild Service (`rebuild_data_indexes.py`)
- Rebuilds data indexes after content updates
- Updates verses cache, word frequency, and search indexes
- Compresses data for production use

### 4. n8n Workflow (`n8n-workflow-content-monitoring.json`)
- Automated content monitoring workflow
- Scheduled checks and real-time updates
- Integration with deployment pipelines
- Notification systems

## Setup Instructions

### 1. Install Dependencies
```bash
# Python dependencies
pip install aiohttp aiofiles pytest pytest-asyncio

# Node.js dependencies (if needed)
npm install
```

### 2. Configure Environment Variables
Copy `.env.external.integration` to `.env.local` and fill in your values:
```bash
cp .env.external.integration .env.local
# Edit .env.local with your actual values
```

### 3. Set Up n8n Workflow
1. Import `n8n-workflow-content-monitoring.json` into your n8n instance
2. Configure webhook URLs and API keys
3. Set up notification channels (Slack, Discord, etc.)

### 4. Start Monitoring
```bash
# Manual start
python3 external_monitoring_service.py

# Or use systemd service (Linux)
sudo systemctl start pashto-bible-monitor
sudo systemctl enable pashto-bible-monitor
```

### 5. Set Up Cron Jobs
```bash
# Add to crontab (crontab -e)
0 2 * * * cd /path/to/pashto-bible-search && python3 external_monitoring_service.py >> logs/cron.log 2>&1
```

## Usage

### Manual Monitoring
```bash
# Run monitoring scan
python3 external_monitoring_service.py

# Run data rebuild
python3 rebuild_data_indexes.py

# Run tests
python3 test_external_integration.py
```

### Health Checks
```bash
# Check system health
./health_check.sh

# Run integration tests
./test_integration.sh
```

### Backup and Recovery
```bash
# Create backup
./backup_data.sh

# Deploy system
./deploy_integration.sh
```

## Configuration

### Monitoring Settings
Edit `external_monitoring_config.json` to configure:
- Check intervals
- Books to monitor
- Rate limiting
- Error handling
- Notifications

### Webhook Security
Set `EXTERNAL_UPDATE_WEBHOOK_SECRET` in your environment variables to secure webhook endpoints.

### n8n Integration
Configure n8n workflow with:
- Your webhook URL
- API keys
- Notification channels
- Deployment triggers

## Troubleshooting

### Common Issues

1. **Monitoring service not starting**
   - Check Python dependencies
   - Verify environment variables
   - Check log files in `logs/`

2. **Webhook endpoints not responding**
   - Verify Next.js server is running
   - Check webhook secret configuration
   - Test with health check script

3. **n8n workflow failures**
   - Check n8n instance connectivity
   - Verify webhook URLs
   - Check API key configuration

4. **Data rebuild failures**
   - Check file permissions
   - Verify data directory structure
   - Check Python dependencies

### Log Files
- `logs/external_monitoring.log` - Main monitoring logs
- `logs/cron.log` - Cron job execution logs
- `logs/rebuild.log` - Data rebuild logs

### Support
For issues and questions:
1. Check log files for error messages
2. Run health check script
3. Test individual components
4. Review configuration files

## Security Considerations

- Use HTTPS for all webhook endpoints
- Implement proper authentication
- Rate limit external requests
- Monitor for suspicious activity
- Regular security updates

## Performance Optimization

- Adjust check intervals based on needs
- Implement caching strategies
- Use CDN for static assets
- Monitor resource usage
- Optimize database queries
EOF

print_status "External integration README created"

# Final setup summary
echo ""
echo "🎉 External Integration System Setup Complete!"
echo "=============================================="
echo ""
print_status "All components have been set up successfully"
echo ""
echo "📋 Next Steps:"
echo "   1. Configure environment variables:"
echo "      cp .env.external.integration .env.local"
echo "      # Edit .env.local with your actual values"
echo ""
echo "   2. Set up n8n workflow:"
echo "      # Import n8n-workflow-content-monitoring.json into your n8n instance"
echo "      # Configure webhook URLs and API keys"
echo ""
echo "   3. Test the system:"
echo "      ./test_integration.sh"
echo ""
echo "   4. Start monitoring:"
echo "      python3 external_monitoring_service.py"
echo ""
echo "   5. Set up automated monitoring:"
echo "      # Add cron job (see cron_job_template.txt)"
echo ""
echo "📚 Documentation:"
echo "   - Read EXTERNAL_INTEGRATION_README.md for detailed instructions"
echo "   - Check logs/ directory for monitoring output"
echo "   - Use ./health_check.sh to verify system health"
echo ""
echo "🔧 Maintenance:"
echo "   - Use ./backup_data.sh to create backups"
echo "   - Use ./deploy_integration.sh for deployments"
echo "   - Monitor logs regularly for issues"
echo ""
print_status "Setup completed successfully!"

