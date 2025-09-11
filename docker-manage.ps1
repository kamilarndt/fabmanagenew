# FabManage Docker Management Script
# PowerShell script for Windows

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("dev", "prod", "build", "stop", "clean", "logs", "restart")]
    [string]$Action,
    
    [string]$Service = ""
)

$ProjectRoot = $PSScriptRoot
$DockerComposeFile = Join-Path $ProjectRoot "FabManageNew\docker-compose.yml"

function Write-Info {
    param([string]$Message)
    Write-Host "🐳 $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Check if Docker is running
function Test-Docker {
    try {
        docker info | Out-Null
        return $true
    }
    catch {
        Write-Error "Docker nie jest uruchomiony. Uruchom Docker Desktop i spróbuj ponownie."
        return $false
    }
}

# Check if docker-compose file exists
if (-not (Test-Path $DockerComposeFile)) {
    Write-Error "Nie znaleziono pliku docker-compose.yml w: $DockerComposeFile"
    exit 1
}

if (-not (Test-Docker)) {
    exit 1
}

Set-Location (Split-Path $DockerComposeFile -Parent)

switch ($Action) {
    "dev" {
        Write-Info "Uruchamianie środowiska deweloperskiego..."
        docker-compose up -d
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Środowisko deweloperskie uruchomione!"
            Write-Host ""
            Write-Host "🌐 Frontend:  http://localhost:5173"
            Write-Host "🔧 Backend:   http://localhost:3001"
            Write-Host "📊 Health:    http://localhost:3001/health"
            Write-Host ""
            Write-Host "Aby zatrzymać: .\docker-manage.ps1 stop"
            Write-Host "Aby zobaczyć logi: .\docker-manage.ps1 logs"
        }
    }
    
    "prod" {
        Write-Info "Uruchamianie środowiska produkcyjnego..."
        $ProdComposeFile = Join-Path $ProjectRoot "docker\docker-compose.yml"
        if (Test-Path $ProdComposeFile) {
            docker-compose -f $ProdComposeFile up -d
            Write-Success "Środowisko produkcyjne uruchomione!"
        }
        else {
            Write-Error "Nie znaleziono pliku docker-compose.yml dla środowiska produkcyjnego"
        }
    }
    
    "build" {
        Write-Info "Przebudowywanie obrazów Docker..."
        if ($Service) {
            docker-compose build --no-cache $Service
        }
        else {
            docker-compose build --no-cache
        }
        Write-Success "Obrazy zostały przebudowane!"
    }
    
    "stop" {
        Write-Info "Zatrzymywanie kontenerów..."
        docker-compose down
        Write-Success "Kontenery zatrzymane!"
    }
    
    "clean" {
        Write-Info "Czyszczenie kontenerów i obrazów..."
        docker-compose down -v --rmi all
        docker system prune -f
        Write-Success "Środowisko zostało wyczyszczone!"
    }
    
    "logs" {
        if ($Service) {
            Write-Info "Pokazywanie logów dla serwisu: $Service"
            docker-compose logs -f $Service
        }
        else {
            Write-Info "Pokazywanie logów wszystkich serwisów..."
            docker-compose logs -f
        }
    }
    
    "restart" {
        Write-Info "Restartowanie kontenerów..."
        if ($Service) {
            docker-compose restart $Service
            Write-Success "Serwis $Service został zrestartowany!"
        }
        else {
            docker-compose restart
            Write-Success "Wszystkie serwisy zostały zrestartowane!"
        }
    }
}

# Return to original directory
Set-Location $ProjectRoot