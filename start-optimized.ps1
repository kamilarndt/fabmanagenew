# FabManage - Optimized Development Environment
# This script starts the optimized Docker environment with Supabase

Write-Host "🚀 Starting FabManage Optimized Development Environment..." -ForegroundColor Green

# Stop any existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose down

# Clean up unused images and containers
Write-Host "🧹 Cleaning up Docker resources..." -ForegroundColor Yellow
docker system prune -f

# Start the optimized environment
Write-Host "🏗️ Building and starting services..." -ForegroundColor Blue
docker-compose up --build -d

# Wait for services to be healthy
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep 30

# Check service status
Write-Host "📊 Checking service status..." -ForegroundColor Blue
docker-compose ps

# Display access information
Write-Host "`n🎉 FabManage is ready!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Supabase DB: localhost:54322" -ForegroundColor Cyan
Write-Host "`n📝 To view logs: docker-compose logs -f" -ForegroundColor Yellow
Write-Host "🛑 To stop: docker-compose down" -ForegroundColor Yellow

