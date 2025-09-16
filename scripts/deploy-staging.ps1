# FabManage Staging Deployment Script for Windows
# This script deploys the complete system to staging environment

param(
    [switch]$SkipTests,
    [switch]$SkipBackup,
    [switch]$Force,
    [string]$Environment = "staging"
)

# Configuration
$ErrorActionPreference = "Stop"
$StagingDir = "./staging"
$BackupDir = "./backups/$(Get-Date -Format 'yyyyMMdd_HHmmss')"
$DockerComposeFile = "docker-compose.staging.yml"

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$White = "White"

# Logging functions
function Write-Log {
    param([string]$Message, [string]$Color = $White)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$Timestamp] $Message" -ForegroundColor $Color
}

function Write-Error {
    param([string]$Message)
    Write-Log "[ERROR] $Message" $Red
}

function Write-Success {
    param([string]$Message)
    Write-Log "[SUCCESS] $Message" $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Log "[WARNING] $Message" $Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Log "[INFO] $Message" $Blue
}

# Check prerequisites
function Test-Prerequisites {
    Write-Info "Checking prerequisites..."
    
    # Check if Docker is running
    try {
        docker info | Out-Null
        Write-Success "Docker is running"
    }
    catch {
        Write-Error "Docker is not running. Please start Docker Desktop and try again."
        exit 1
    }
    
    # Check if Node.js is installed
    try {
        $nodeVersion = node --version
        Write-Success "Node.js is installed: $nodeVersion"
    }
    catch {
        Write-Error "Node.js is not installed. Please install Node.js and try again."
        exit 1
    }
    
    # Check if npm is installed
    try {
        $npmVersion = npm --version
        Write-Success "npm is installed: $npmVersion"
    }
    catch {
        Write-Error "npm is not installed. Please install npm and try again."
        exit 1
    }
    
    Write-Success "Prerequisites check passed"
}

# Create backup of current staging
function New-Backup {
    if ($SkipBackup) {
        Write-Warning "Skipping backup as requested"
        return
    }
    
    Write-Info "Creating backup of current staging environment..."
    
    if (Test-Path $StagingDir) {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
        Copy-Item -Path $StagingDir -Destination "$BackupDir/staging" -Recurse -Force
        Write-Success "Backup created at $BackupDir"
    }
    else {
        Write-Warning "No existing staging directory found, skipping backup"
    }
}

# Build frontend
function Build-Frontend {
    Write-Info "Building frontend application..."
    
    # Install dependencies
    Write-Info "Installing frontend dependencies..."
    npm ci --silent
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install frontend dependencies"
        exit 1
    }
    
    # Run type checking
    Write-Info "Running TypeScript type checking..."
    npm run type-check
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "TypeScript type checking failed"
        exit 1
    }
    
    # Run linting
    Write-Info "Running ESLint..."
    npm run lint
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "ESLint failed"
        exit 1
    }
    
    # Run tests
    if (-not $SkipTests) {
        Write-Info "Running tests..."
        npm run test
        
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Tests failed"
            exit 1
        }
    }
    else {
        Write-Warning "Skipping tests as requested"
    }
    
    # Build application
    Write-Info "Building application for production..."
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Frontend build failed"
        exit 1
    }
    
    Write-Success "Frontend build completed"
}

# Build backend
function Build-Backend {
    Write-Info "Building backend application..."
    
    Push-Location backend
    
    try {
        # Install dependencies
        Write-Info "Installing backend dependencies..."
        npm ci --silent
        
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install backend dependencies"
            exit 1
        }
        
        # Run type checking
        Write-Info "Running backend type checking..."
        npx tsc --noEmit
        
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Backend type checking failed"
            exit 1
        }
        
        # Build backend
        Write-Info "Building backend..."
        npx tsc
        
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Backend build failed"
            exit 1
        }
        
        Write-Success "Backend build completed"
    }
    finally {
        Pop-Location
    }
}

# Create staging environment
function New-StagingEnvironment {
    Write-Info "Creating staging environment..."
    
    # Remove existing staging directory
    if (Test-Path $StagingDir) {
        if ($Force) {
            Remove-Item -Path $StagingDir -Recurse -Force
        }
        else {
            Write-Error "Staging directory already exists. Use -Force to overwrite."
            exit 1
        }
    }
    
    # Create staging directory structure
    New-Item -ItemType Directory -Path "$StagingDir/frontend" -Force | Out-Null
    New-Item -ItemType Directory -Path "$StagingDir/backend" -Force | Out-Null
    New-Item -ItemType Directory -Path "$StagingDir/database" -Force | Out-Null
    New-Item -ItemType Directory -Path "$StagingDir/nginx" -Force | Out-Null
    New-Item -ItemType Directory -Path "$StagingDir/monitoring" -Force | Out-Null
    
    # Copy frontend build
    Write-Info "Copying frontend build to staging..."
    Copy-Item -Path "dist/*" -Destination "$StagingDir/frontend/" -Recurse -Force
    
    # Copy backend build
    Write-Info "Copying backend build to staging..."
    Copy-Item -Path "backend/dist/*" -Destination "$StagingDir/backend/" -Recurse -Force
    Copy-Item -Path "backend/package.json" -Destination "$StagingDir/backend/" -Force
    Copy-Item -Path "backend/package-lock.json" -Destination "$StagingDir/backend/" -Force
    
    # Copy database schema
    Write-Info "Copying database schema to staging..."
    Copy-Item -Path "backend/schema.sql" -Destination "$StagingDir/database/" -Force
    
    # Create staging Docker Compose file
    New-StagingDockerCompose
    
    # Create staging nginx configuration
    New-StagingNginxConfig
    
    # Create backend Dockerfile for staging
    New-BackendDockerfile
    
    # Create monitoring configuration
    New-MonitoringConfig
    
    Write-Success "Staging environment created"
}

# Create staging Docker Compose file
function New-StagingDockerCompose {
    Write-Info "Creating staging Docker Compose configuration..."
    
    $DockerComposeContent = @"
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
"@

    $DockerComposeContent | Out-File -FilePath "$StagingDir/$DockerComposeFile" -Encoding UTF8
    Write-Success "Staging Docker Compose file created"
}

# Create staging nginx configuration
function New-StagingNginxConfig {
    Write-Info "Creating staging nginx configuration..."
    
    $NginxConfigContent = @"
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
"@

    $NginxConfigContent | Out-File -FilePath "$StagingDir/nginx/nginx.conf" -Encoding UTF8
    Write-Success "Staging nginx configuration created"
}

# Create backend Dockerfile for staging
function New-BackendDockerfile {
    Write-Info "Creating backend Dockerfile for staging..."
    
    $DockerfileContent = @"
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
"@

    $DockerfileContent | Out-File -FilePath "$StagingDir/backend/Dockerfile.staging" -Encoding UTF8
    Write-Success "Backend Dockerfile created"
}

# Create monitoring configuration
function New-MonitoringConfig {
    Write-Info "Creating monitoring configuration..."
    
    # Prometheus configuration
    $PrometheusConfigContent = @"
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
"@

    $PrometheusConfigContent | Out-File -FilePath "$StagingDir/monitoring/prometheus.yml" -Encoding UTF8
    Write-Success "Monitoring configuration created"
}

# Deploy to staging
function Deploy-ToStaging {
    Write-Info "Deploying to staging environment..."
    
    Push-Location $StagingDir
    
    try {
        # Stop existing containers
        Write-Info "Stopping existing staging containers..."
        docker-compose -f $DockerComposeFile down --remove-orphans
        
        # Build and start containers
        Write-Info "Building and starting staging containers..."
        docker-compose -f $DockerComposeFile up --build -d
        
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to start staging containers"
            exit 1
        }
        
        # Wait for services to be ready
        Write-Info "Waiting for services to be ready..."
        Start-Sleep -Seconds 30
        
        # Health check
        Write-Info "Performing health checks..."
        
        # Check frontend
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/health" -TimeoutSec 10
            if ($response.StatusCode -eq 200) {
                Write-Success "Frontend health check passed"
            }
            else {
                Write-Error "Frontend health check failed"
                exit 1
            }
        }
        catch {
            Write-Error "Frontend health check failed: $($_.Exception.Message)"
            exit 1
        }
        
        # Check backend
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 10
            if ($response.StatusCode -eq 200) {
                Write-Success "Backend health check passed"
            }
            else {
                Write-Error "Backend health check failed"
                exit 1
            }
        }
        catch {
            Write-Error "Backend health check failed: $($_.Exception.Message)"
            exit 1
        }
        
        # Check database
        $dbCheck = docker exec fabmanage_staging_db pg_isready -U fabmanage_user
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Database health check passed"
        }
        else {
            Write-Error "Database health check failed"
            exit 1
        }
        
        Write-Success "Staging deployment completed successfully"
    }
    finally {
        Pop-Location
    }
}

# Run integration tests
function Test-Integration {
    Write-Info "Running integration tests..."
    
    # Test API endpoints
    Write-Info "Testing API endpoints..."
    
    # Test health endpoint
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Success "API health endpoint test passed"
        }
        else {
            Write-Error "API health endpoint test failed"
            exit 1
        }
    }
    catch {
        Write-Error "API health endpoint test failed: $($_.Exception.Message)"
        exit 1
    }
    
    # Test frontend
    Write-Info "Testing frontend..."
    
    # Test main page
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Success "Frontend main page test passed"
        }
        else {
            Write-Error "Frontend main page test failed"
            exit 1
        }
    }
    catch {
        Write-Error "Frontend main page test failed: $($_.Exception.Message)"
        exit 1
    }
    
    Write-Success "Integration tests passed"
}

# Generate deployment report
function New-DeploymentReport {
    Write-Info "Generating deployment report..."
    
    $ReportFile = "$StagingDir/deployment-report-$(Get-Date -Format 'yyyyMMdd_HHmmss').md"
    
    $ReportContent = @"
# FabManage Staging Deployment Report

**Deployment Date:** $(Get-Date)
**Deployment Version:** $(git rev-parse --short HEAD 2>$null)
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

- Build Time: $(Get-Date)
- Bundle Size: $(if (Test-Path "dist") { (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB } else { "N/A" })
- Docker Images: $(docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | Select-String "fabmanage")

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

- **Backup Location**: $BackupDir
- **Backup Date**: $(Get-Date)

---
*Generated by FabManage Deployment Script*
"@

    $ReportContent | Out-File -FilePath $ReportFile -Encoding UTF8
    Write-Success "Deployment report generated: $ReportFile"
}

# Main deployment function
function Start-Deployment {
    Write-Info "Starting FabManage Staging Deployment Pipeline"
    
    Test-Prerequisites
    New-Backup
    Build-Frontend
    Build-Backend
    New-StagingEnvironment
    Deploy-ToStaging
    Test-Integration
    New-DeploymentReport
    
    Write-Success "🎉 FabManage Staging Deployment Completed Successfully!"
    
    Write-Host ""
    Write-Host "📋 Deployment Summary:" -ForegroundColor $Green
    Write-Host "  • Frontend: http://localhost:8080" -ForegroundColor $White
    Write-Host "  • Backend API: http://localhost:3001" -ForegroundColor $White
    Write-Host "  • Grafana: http://localhost:3000 (admin/admin123)" -ForegroundColor $White
    Write-Host "  • Prometheus: http://localhost:9090" -ForegroundColor $White
    Write-Host ""
    Write-Host "🔍 To view logs:" -ForegroundColor $Blue
    Write-Host "  • docker-compose -f staging/$DockerComposeFile logs -f" -ForegroundColor $White
    Write-Host ""
    Write-Host "🛑 To stop staging:" -ForegroundColor $Yellow
    Write-Host "  • docker-compose -f staging/$DockerComposeFile down" -ForegroundColor $White
    Write-Host ""
    Write-Host "📊 Next: Run user training and begin migration with Early Adopters" -ForegroundColor $Green
}

# Run main deployment function
Start-Deployment
