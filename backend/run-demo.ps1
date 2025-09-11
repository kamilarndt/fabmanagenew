# FabManage Demo Data Generator
# PowerShell script to generate comprehensive demo data

Write-Host "🎬 FABMANAGE DEMO DATA GENERATOR" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "generate-demo-library.js")) {
    Write-Host "❌ Please run this script from the backend directory" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Starting demo data generation..." -ForegroundColor Yellow
Write-Host ""

try {
    # Run the demo data generator
    node generate-demo-library.js
    
    Write-Host ""
    Write-Host "✅ Demo data generation completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Start the backend server: npm start" -ForegroundColor White
    Write-Host "   2. Open the frontend application" -ForegroundColor White
    Write-Host "   3. Explore the demo data in the UI" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 Available demo scenarios:" -ForegroundColor Cyan
    Write-Host "   • Teatr Narodowy - Scenografia 'Wesele'" -ForegroundColor White
    Write-Host "   • Orange Festival - Scena główna" -ForegroundColor White
    Write-Host "   • Muzeum Łazienki - Wystawa" -ForegroundColor White
    Write-Host "   • IKEA Showroom - Kuchnia demonstracyjna" -ForegroundColor White
    Write-Host "   • Zarządzanie magazynem - Alerty stanów" -ForegroundColor White
    Write-Host ""
    
}
catch {
    Write-Host "❌ Error generating demo data: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

