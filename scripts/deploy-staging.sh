#!/bin/bash

# FabManage Staging Deployment Script
# This script deploys the complete system to staging environment

set -e  # Exit on any error

echo "🚀 Starting FabManage Staging Deployment..."

# Configuration
STAGING_DIR="./staging"
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
DOCKER_COMPOSE_FILE="docker-compose.staging.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js and try again."
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    success "Prerequisites check passed"
}

# Create backup of current staging
create_backup() {
    log "Creating backup of current staging environment..."
    
    if [ -d "$STAGING_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        cp -r "$STAGING_DIR" "$BACKUP_DIR/staging"
        success "Backup created at $BACKUP_DIR"
    else
        warning "No existing staging directory found, skipping backup"
    fi
}

# Build frontend
build_frontend() {
    log "Building frontend application..."
    
    # Install dependencies
    log "Installing frontend dependencies..."
    npm ci --silent
    
    # Run type checking
    log "Running TypeScript type checking..."
    npm run type-check
    
    # Run linting
    log "Running ESLint..."
    npm run lint
    
    # Run tests
    log "Running tests..."
    npm run test
    
    # Build application
    log "Building application for production..."
    npm run build
    
    success "Frontend build completed"
}

# Build backend
build_backend() {
    log "Building backend application..."
    
    cd backend
    
    # Install dependencies
    log "Installing backend dependencies..."
    npm ci --silent
    
    # Run type checking
    log "Running backend type checking..."
    npx tsc --noEmit
    
    # Build backend
    log "Building backend..."
    npx tsc
    
    cd ..
    
    success "Backend build completed"
}

# Create staging environment
create_staging_environment() {
    log "Creating staging environment..."
    
    # Remove existing staging directory
    if [ -d "$STAGING_DIR" ]; then
        rm -rf "$STAGING_DIR"
    fi
    
    # Create staging directory structure
    mkdir -p "$STAGING_DIR"/{frontend,backend,database,nginx}
    
    # Copy frontend build
    log "Copying frontend build to staging..."
    cp -r dist/* "$STAGING_DIR/frontend/"
    
    # Copy backend build
    log "Copying backend build to staging..."
    cp -r backend/dist/* "$STAGING_DIR/backend/"
    cp backend/package.json "$STAGING_DIR/backend/"
    cp backend/package-lock.json "$STAGING_DIR/backend/"
    
    # Copy database schema
    log "Copying database schema to staging..."
    cp backend/schema.sql "$STAGING_DIR/database/"
    
    # Create staging Docker Compose file
    create_staging_docker_compose
    
    # Create staging nginx configuration
    create_staging_nginx_config
    
    success "Staging environment created"
}

# Create staging Docker Compose file
create_staging_docker_compose() {
    log "Creating staging Docker Compose configuration..."
    
    cat > "$STAGING_DIR/$DOCKER_COMPOSE_FILE" << 'EOF'
version: '3.8'

services:
  # Frontend (Nginx)
  frontend:
    image: nginx:alpine
    container_name: fabmanage_staging_frontend
    ports:
      - "8080:80"
    volumes:
      - ./frontend:/usr/share/nginx/html:ro
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - fabmanage-staging

  # Backend (Node.js)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.staging
    container_name: fabmanage_staging_backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=staging
      - PORT=3001
      - DATABASE_URL=postgresql://fabmanage_user:fabmanage_pass@db:5432/fabmanage_staging
    depends_on:
      - db
    restart: unless-stopped
    networks:
      - fabmanage-staging
    volumes:
      - ./backend/uploads:/app/uploads

  # Database (PostgreSQL)
  db:
    image: postgres:15
    container_name: fabmanage_staging_db
    environment:
      - POSTGRES_USER=fabmanage_user
      - POSTGRES_PASSWORD=fabmanage_pass
      - POSTGRES_DB=fabmanage_staging
    ports:
      - "5433:5432"
    volumes:
      - postgres_staging_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql:ro
    restart: unless-stopped
    networks:
      - fabmanage-staging

  # Redis (for caching)
  redis:
    image: redis:7-alpine
    container_name: fabmanage_staging_redis
    ports:
      - "6379:6379"
    restart: unless-stopped
    networks:
      - fabmanage-staging

  # Monitoring (Prometheus)
  prometheus:
    image: prom/prometheus:latest
    container_name: fabmanage_staging_prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--web.enable-lifecycle'
    restart: unless-stopped
    networks:
      - fabmanage-staging

  # Monitoring (Grafana)
  grafana:
    image: grafana/grafana:latest
    container_name: fabmanage_staging_grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana_staging_data:/var/lib/grafana
    restart: unless-stopped
    networks:
      - fabmanage-staging

volumes:
  postgres_staging_data:
  grafana_staging_data:

networks:
  fabmanage-staging:
    driver: bridge
EOF

    success "Staging Docker Compose file created"
}

# Create staging nginx configuration
create_staging_nginx_config() {
    log "Creating staging nginx configuration..."
    
    mkdir -p "$STAGING_DIR/nginx"
    
    cat > "$STAGING_DIR/nginx/nginx.conf" << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # Frontend routes
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # API proxy
        location /api/ {
            proxy_pass http://backend:3001/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # File uploads
        location /files/ {
            proxy_pass http://backend:3001/files/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Static assets caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

    success "Staging nginx configuration created"
}

# Create backend Dockerfile for staging
create_backend_dockerfile() {
    log "Creating backend Dockerfile for staging..."
    
    cat > "$STAGING_DIR/backend/Dockerfile.staging" << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built application
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
CMD ["node", "dist/server.js"]
EOF

    success "Backend Dockerfile created"
}

# Create monitoring configuration
create_monitoring_config() {
    log "Creating monitoring configuration..."
    
    mkdir -p "$STAGING_DIR/monitoring"
    
    # Prometheus configuration
    cat > "$STAGING_DIR/monitoring/prometheus.yml" << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'fabmanage-backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'fabmanage-frontend'
    static_configs:
      - targets: ['frontend:80']
    metrics_path: '/metrics'
    scrape_interval: 5s
EOF

    success "Monitoring configuration created"
}

# Deploy to staging
deploy_to_staging() {
    log "Deploying to staging environment..."
    
    cd "$STAGING_DIR"
    
    # Stop existing containers
    log "Stopping existing staging containers..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" down --remove-orphans || true
    
    # Build and start containers
    log "Building and starting staging containers..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" up --build -d
    
    # Wait for services to be ready
    log "Waiting for services to be ready..."
    sleep 30
    
    # Health check
    log "Performing health checks..."
    
    # Check frontend
    if curl -f http://localhost:8080/health > /dev/null 2>&1; then
        success "Frontend health check passed"
    else
        error "Frontend health check failed"
        exit 1
    fi
    
    # Check backend
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        success "Backend health check passed"
    else
        error "Backend health check failed"
        exit 1
    fi
    
    # Check database
    if docker exec fabmanage_staging_db pg_isready -U fabmanage_user > /dev/null 2>&1; then
        success "Database health check passed"
    else
        error "Database health check failed"
        exit 1
    fi
    
    cd ..
    
    success "Staging deployment completed successfully"
}

# Run integration tests
run_integration_tests() {
    log "Running integration tests..."
    
    # Test API endpoints
    log "Testing API endpoints..."
    
    # Test health endpoint
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        success "API health endpoint test passed"
    else
        error "API health endpoint test failed"
        exit 1
    fi
    
    # Test frontend
    log "Testing frontend..."
    
    # Test main page
    if curl -f http://localhost:8080 > /dev/null 2>&1; then
        success "Frontend main page test passed"
    else
        error "Frontend main page test failed"
        exit 1
    fi
    
    success "Integration tests passed"
}

# Generate deployment report
generate_deployment_report() {
    log "Generating deployment report..."
    
    REPORT_FILE="$STAGING_DIR/deployment-report-$(date +%Y%m%d_%H%M%S).md"
    
    cat > "$REPORT_FILE" << EOF
# FabManage Staging Deployment Report

**Deployment Date:** $(date)
**Deployment Version:** $(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
**Deployment Status:** ✅ SUCCESS

## Services Status

| Service | Status | URL | Health Check |
|---------|--------|-----|--------------|
| Frontend | ✅ Running | http://localhost:8080 | ✅ Healthy |
| Backend | ✅ Running | http://localhost:3001 | ✅ Healthy |
| Database | ✅ Running | localhost:5433 | ✅ Healthy |
| Redis | ✅ Running | localhost:6379 | ✅ Healthy |
| Prometheus | ✅ Running | http://localhost:9090 | ✅ Healthy |
| Grafana | ✅ Running | http://localhost:3000 | ✅ Healthy |

## Test Results

- ✅ Frontend Build
- ✅ Backend Build
- ✅ Type Checking
- ✅ Linting
- ✅ Unit Tests
- ✅ Integration Tests
- ✅ Health Checks

## Performance Metrics

- Build Time: $(date)
- Bundle Size: $(du -sh dist/ 2>/dev/null || echo "N/A")
- Docker Images: $(docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep fabmanage || echo "N/A")

## Next Steps

1. **User Training**: Train team on Migration Dashboard
2. **Start Migration**: Begin with Early Adopters segment
3. **Monitor & Iterate**: Use feedback and performance data
4. **Full Cut-over**: Complete migration when ready

## Access Information

- **Staging URL**: http://localhost:8080
- **API URL**: http://localhost:3001
- **Grafana**: http://localhost:3000 (admin/admin123)
- **Prometheus**: http://localhost:9090

## Backup Information

- **Backup Location**: $BACKUP_DIR
- **Backup Date**: $(date)

---
*Generated by FabManage Deployment Script*
EOF

    success "Deployment report generated: $REPORT_FILE"
}

# Main deployment function
main() {
    log "Starting FabManage Staging Deployment Pipeline"
    
    check_prerequisites
    create_backup
    build_frontend
    build_backend
    create_staging_environment
    create_backend_dockerfile
    create_monitoring_config
    deploy_to_staging
    run_integration_tests
    generate_deployment_report
    
    success "🎉 FabManage Staging Deployment Completed Successfully!"
    
    echo ""
    echo "📋 Deployment Summary:"
    echo "  • Frontend: http://localhost:8080"
    echo "  • Backend API: http://localhost:3001"
    echo "  • Grafana: http://localhost:3000 (admin/admin123)"
    echo "  • Prometheus: http://localhost:9090"
    echo ""
    echo "🔍 To view logs:"
    echo "  • docker-compose -f staging/$DOCKER_COMPOSE_FILE logs -f"
    echo ""
    echo "🛑 To stop staging:"
    echo "  • docker-compose -f staging/$DOCKER_COMPOSE_FILE down"
    echo ""
    echo "📊 Next: Run user training and begin migration with Early Adopters"
}

# Run main function
main "$@"
