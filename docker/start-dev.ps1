# PowerShell script to start development environment
Write-Host "Starting FabManage development environment..." -ForegroundColor Green

# Resolve repo root assuming this script is in /docker
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ComposeFile = Join-Path $ScriptDir "docker-compose.dev.yml"

# Stop any existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker compose -f $ComposeFile down

# Start development environment
Write-Host "Starting development containers..." -ForegroundColor Yellow
docker compose -f $ComposeFile up -d --build

# Show status
Write-Host "Development environment started!" -ForegroundColor Green
Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "To view logs: docker compose -f $ComposeFile logs -f" -ForegroundColor Gray
Write-Host "To stop: docker compose -f $ComposeFile down" -ForegroundColor Gray

