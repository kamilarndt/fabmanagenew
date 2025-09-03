# FabManage Docker Management Script
param(
    [Parameter(Position=0)]
    [ValidateSet("start", "stop", "restart", "status", "logs", "build", "clean")]
    [string]$Action = "start"
)

Write-Host "🐳 FabManage Docker Management" -ForegroundColor Cyan

switch ($Action) {
    "start" {
        Write-Host "🚀 Starting FabManage services..." -ForegroundColor Green
        docker-compose up -d
        Write-Host "✅ Services started! Check status with: docker-compose ps" -ForegroundColor Green
        Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Yellow
        Write-Host "🔧 Backend API: http://localhost:3001/api/materials" -ForegroundColor Yellow
    }
    
    "stop" {
        Write-Host "🛑 Stopping FabManage services..." -ForegroundColor Red
        docker-compose down
        Write-Host "✅ Services stopped!" -ForegroundColor Green
    }
    
    "restart" {
        Write-Host "🔄 Restarting FabManage services..." -ForegroundColor Yellow
        docker-compose restart
        Write-Host "✅ Services restarted!" -ForegroundColor Green
    }
    
    "status" {
        Write-Host "📊 Service Status:" -ForegroundColor Cyan
        docker-compose ps
    }
    
    "logs" {
        Write-Host "📝 Recent logs:" -ForegroundColor Cyan
        docker-compose logs --tail=20
    }
    
    "build" {
        Write-Host "🔨 Building Docker images..." -ForegroundColor Yellow
        docker-compose build --no-cache
        Write-Host "✅ Images built!" -ForegroundColor Green
    }
    
    "clean" {
        Write-Host "🧹 Cleaning up Docker resources..." -ForegroundColor Yellow
        docker-compose down --volumes --remove-orphans
        docker system prune -f
        Write-Host "✅ Cleanup completed!" -ForegroundColor Green
    }
}

Write-Host "`n💡 Usage: .\docker-manage.ps1 [start|stop|restart|status|logs|build|clean]" -ForegroundColor Gray
