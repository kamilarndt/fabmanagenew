# PowerShell script to start only backend
Write-Host "Starting FabManage backend only..." -ForegroundColor Green

# Stop any existing backend containers
Write-Host "Stopping existing backend..." -ForegroundColor Yellow
docker compose -f docker/docker-compose.dev.yml stop backend
docker compose -f docker/docker-compose.dev.yml rm -f backend

# Start only backend
Write-Host "Starting backend container..." -ForegroundColor Yellow
docker compose -f docker/docker-compose.dev.yml up -d --build backend

# Show status
Write-Host "Backend started!" -ForegroundColor Green
Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "To view logs: docker compose -f docker/docker-compose.dev.yml logs -f backend" -ForegroundColor Gray
Write-Host "To stop: docker compose -f docker/docker-compose.dev.yml stop backend" -ForegroundColor Gray

