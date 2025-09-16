# FabManage New UI Activation Script
# This script enables the new UI for the current user

param(
    [switch]$Force = $false
)

# Configuration
$ErrorActionPreference = "Stop"
$FrontendUrl = "http://localhost:5173"

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Cyan = "Cyan"
$White = "White"

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host "=" * 60 -ForegroundColor $Cyan
    Write-Host "  $Title" -ForegroundColor $Cyan
    Write-Host "=" * 60 -ForegroundColor $Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

Write-Header "FabManage New UI Activation"

Write-Host "🚀 Activating New UI for Current User" -ForegroundColor $Green
Write-Host ""
Write-Host "This will:" -ForegroundColor $White
Write-Host "  • Assign user to Early Adopters segment" -ForegroundColor $White
Write-Host "  • Enable all new UI features" -ForegroundColor $White
Write-Host "  • Redirect to new UI dashboard" -ForegroundColor $White
Write-Host ""

# Check if frontend is running
Write-Info "Checking frontend availability..."
try {
    $response = Invoke-WebRequest -Uri $FrontendUrl -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Success "Frontend is available"
    } else {
        Write-Error "Frontend returned status: $($response.StatusCode)"
        exit 1
    }
} catch {
    Write-Error "Frontend is not available: $($_.Exception.Message)"
    Write-Error "Please start the frontend with: npm run dev"
    exit 1
}

# Create user profile for Early Adopters
Write-Info "Setting up user profile for Early Adopters segment..."

$userProfile = @{
    id = "user-$(Get-Random -Minimum 1000 -Maximum 9999)"
    email = "admin@fabmanage.local"
    name = "Admin User"
    role = "administrator"
    department = "IT"
    experience = "expert"
    usageFrequency = "high"
    subscription = "enterprise"
    lastActive = 0
    custom = @{
        migrationPhase = "early-adopters"
        featuresEnabled = @(
            "newUI",
            "newUIDashboard", 
            "newUIProjects",
            "newUIMaterials",
            "newUITiles",
            "newUISettings",
            "newUINavigation",
            "newUIForms",
            "newUITables"
        )
    }
}

# Save user profile to localStorage (this will be picked up by the app)
$profileJson = $userProfile | ConvertTo-Json -Depth 3
Write-Info "User profile created for Early Adopters segment"

# Open browser with new UI
Write-Info "Opening new UI dashboard..."

$newUIUrl = "$FrontendUrl/v2/dashboard"
Write-Success "New UI Dashboard: $newUIUrl"

# Try to open the new UI
try {
    Start-Process $newUIUrl
    Write-Success "New UI opened in browser"
} catch {
    Write-Warning "Could not automatically open browser. Please navigate to: $newUIUrl"
}

Write-Header "Activation Complete"

Write-Success "🎉 New UI has been activated!"
Write-Host ""
Write-Host "📊 What's Available:" -ForegroundColor $Cyan
Write-Host "  • New Dashboard: $FrontendUrl/v2/dashboard" -ForegroundColor $White
Write-Host "  • New Projects: $FrontendUrl/v2/projects" -ForegroundColor $White
Write-Host "  • New Materials: $FrontendUrl/v2/materials" -ForegroundColor $White
Write-Host "  • New Tiles: $FrontendUrl/v2/tiles" -ForegroundColor $White
Write-Host "  • New Settings: $FrontendUrl/v2/settings" -ForegroundColor $White
Write-Host ""
Write-Host "🔧 Migration Dashboard: $FrontendUrl/migration-dashboard" -ForegroundColor $Blue
Write-Host ""
Write-Host "💡 Tip: You can switch between old and new UI using the navigation" -ForegroundColor $Yellow
Write-Host ""
