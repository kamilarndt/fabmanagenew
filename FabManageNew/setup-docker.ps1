# FabManageNew Docker Setup Script for Windows
# This script helps you set up and run the application with Docker

param(
    [string]$Action = "menu"
)

Write-Host "🚀 FabManageNew Docker Setup" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green

# Check if Docker is installed
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is installed
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    @"
# Supabase Configuration (optional)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Environment
NODE_ENV=development
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Function to show menu
function Show-Menu {
    Write-Host ""
    Write-Host "What would you like to do?" -ForegroundColor Cyan
    Write-Host "1) Start development environment (hot reload)" -ForegroundColor White
    Write-Host "2) Start production environment" -ForegroundColor White
    Write-Host "3) Stop all containers" -ForegroundColor White
    Write-Host "4) View logs" -ForegroundColor White
    Write-Host "5) Clean up (remove containers, images, volumes)" -ForegroundColor White
    Write-Host "6) Exit" -ForegroundColor White
    Write-Host ""
}

# Function to start development
function Start-Development {
    Write-Host "🔧 Starting development environment..." -ForegroundColor Yellow
    Write-Host "📱 Application will be available at: http://localhost:3002" -ForegroundColor Green
    Write-Host "🔄 Hot reload enabled" -ForegroundColor Green
    Write-Host ""
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    npm run docker:dev
}

# Function to start production
function Start-Production {
    Write-Host "🚀 Starting production environment..." -ForegroundColor Yellow
    Write-Host "📱 Application will be available at: http://localhost:3000" -ForegroundColor Green
    Write-Host "🌐 Nginx reverse proxy enabled" -ForegroundColor Green
    Write-Host ""
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    npm run docker:prod
}

# Function to stop containers
function Stop-Containers {
    Write-Host "🛑 Stopping all containers..." -ForegroundColor Yellow
    npm run docker:stop
    Write-Host "✅ Containers stopped" -ForegroundColor Green
}

# Function to view logs
function View-Logs {
    Write-Host "📋 Showing logs (Press Ctrl+C to exit)..." -ForegroundColor Yellow
    npm run docker:logs
}

# Function to clean up
function Cleanup-Containers {
    Write-Host "🧹 Cleaning up Docker resources..." -ForegroundColor Yellow
    Write-Host "⚠️  This will remove all containers, images, and volumes!" -ForegroundColor Red
    $confirm = Read-Host "Are you sure? (y/N)"
    if ($confirm -eq "y" -or $confirm -eq "Y" -or $confirm -eq "yes" -or $confirm -eq "YES") {
        npm run docker:clean
        Write-Host "✅ Cleanup completed" -ForegroundColor Green
    } else {
        Write-Host "❌ Cleanup cancelled" -ForegroundColor Yellow
    }
}

# Main execution based on action parameter
switch ($Action.ToLower()) {
    "dev" {
        Start-Development
    }
    "prod" {
        Start-Production
    }
    "stop" {
        Stop-Containers
    }
    "logs" {
        View-Logs
    }
    "clean" {
        Cleanup-Containers
    }
    "menu" {
        # Main menu loop
        do {
            Show-Menu
            $choice = Read-Host "Enter your choice (1-6)"
            
            switch ($choice) {
                "1" {
                    Start-Development
                    break
                }
                "2" {
                    Start-Production
                    break
                }
                "3" {
                    Stop-Containers
                }
                "4" {
                    View-Logs
                }
                "5" {
                    Cleanup-Containers
                }
                "6" {
                    Write-Host "👋 Goodbye!" -ForegroundColor Green
                    exit 0
                }
                default {
                    Write-Host "❌ Invalid choice. Please enter a number between 1-6." -ForegroundColor Red
                }
            }
        } while ($choice -ne "1" -and $choice -ne "2")
    }
    default {
        Write-Host "Usage: .\setup-docker.ps1 [dev|prod|stop|logs|clean|menu]" -ForegroundColor Yellow
        Write-Host "  dev   - Start development environment" -ForegroundColor White
        Write-Host "  prod  - Start production environment" -ForegroundColor White
        Write-Host "  stop  - Stop all containers" -ForegroundColor White
        Write-Host "  logs  - View logs" -ForegroundColor White
        Write-Host "  clean - Clean up Docker resources" -ForegroundColor White
        Write-Host "  menu  - Show interactive menu (default)" -ForegroundColor White
    }
}
