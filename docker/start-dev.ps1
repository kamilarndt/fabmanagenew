# PowerShell script to start development environment
Write-Host "Starting FabManage development environment..." -ForegroundColor Green

# Stop any existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker compose -f docker/docker-compose.dev.yml down

# Start development environment
Write-Host "Starting development containers..." -ForegroundColor Yellow
docker compose -f docker/docker-compose.dev.yml up -d --build

# Show status
Write-Host "Development environment started!" -ForegroundColor Green
Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "To view logs: docker compose -f docker/docker-compose.dev.yml logs -f" -ForegroundColor Gray
Write-Host "To stop: docker compose -f docker/docker-compose.dev.yml down" -ForegroundColor Gray

