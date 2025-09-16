# FabManage User Training Script
# This script starts the user training session for the Migration Dashboard

param(
    [string]$TrainingMode = "interactive",
    [switch]$SkipSetup,
    [switch]$DemoMode
)

# Configuration
$ErrorActionPreference = "Stop"
$TrainingDir = "./docs/training"
$StagingUrl = "http://localhost:8080"

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$White = "White"
$Cyan = "Cyan"
$Magenta = "Magenta"

# Logging functions
function Write-Log {
    param([string]$Message, [string]$Color = $White)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$Timestamp] $Message" -ForegroundColor $Color
}

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host "=" * 60 -ForegroundColor $Cyan
    Write-Host "  $Title" -ForegroundColor $Cyan
    Write-Host "=" * 60 -ForegroundColor $Cyan
    Write-Host ""
}

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "--- $Title ---" -ForegroundColor $Magenta
    Write-Host ""
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

function Write-Error {
    param([string]$Message)
    Write-Log "[ERROR] $Message" $Red
}

# Check if staging environment is running
function Test-StagingEnvironment {
    Write-Info "Checking if staging environment is running..."
    
    try {
        $response = Invoke-WebRequest -Uri "$StagingUrl/health" -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Success "Staging environment is running"
            return $true
        }
    }
    catch {
        Write-Warning "Staging environment is not running"
        return $false
    }
    
    return $false
}

# Start staging environment if not running
function Start-StagingEnvironment {
    Write-Info "Starting staging environment..."
    
    if (Test-Path "./staging/docker-compose.staging.yml") {
        Push-Location "./staging"
        try {
            docker-compose -f docker-compose.staging.yml up -d
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Staging environment started"
                Write-Info "Waiting for services to be ready..."
                Start-Sleep -Seconds 30
            }
            else {
                Write-Error "Failed to start staging environment"
                exit 1
            }
        }
        finally {
            Pop-Location
        }
    }
    else {
        Write-Error "Staging environment not found. Please run deployment script first."
        exit 1
    }
}

# Display training overview
function Show-TrainingOverview {
    Write-Header "FabManage Migration Dashboard - User Training"
    
    Write-Host "Welcome to the FabManage Migration Dashboard training session!" -ForegroundColor $Green
    Write-Host ""
    Write-Host "This training will cover:" -ForegroundColor $White
    Write-Host "  • Migration Dashboard Overview" -ForegroundColor $White
    Write-Host "  • User Segmentation and A/B Testing" -ForegroundColor $White
    Write-Host "  • Performance Monitoring" -ForegroundColor $White
    Write-Host "  • Cut-over Management" -ForegroundColor $White
    Write-Host "  • Best Practices and Troubleshooting" -ForegroundColor $White
    Write-Host ""
    Write-Host "Training Mode: $TrainingMode" -ForegroundColor $Cyan
    Write-Host "Demo Mode: $DemoMode" -ForegroundColor $Cyan
    Write-Host ""
}

# Interactive training session
function Start-InteractiveTraining {
    Write-Section "Interactive Training Session"
    
    $sections = @(
        @{
            Title = "1. Migration Dashboard Overview"
            Description = "Learn about the main sections and features of the Migration Dashboard"
            Url = "$StagingUrl/migration-dashboard"
            Duration = "10 minutes"
        },
        @{
            Title = "2. User Segmentation"
            Description = "Understand how users are segmented for controlled migration"
            Url = "$StagingUrl/migration-dashboard"
            Duration = "15 minutes"
        },
        @{
            Title = "3. A/B Testing"
            Description = "Learn how to interpret A/B test results"
            Url = "$StagingUrl/migration-dashboard"
            Duration = "10 minutes"
        },
        @{
            Title = "4. Performance Monitoring"
            Description = "Monitor system performance during migration"
            Url = "$StagingUrl/migration-dashboard"
            Duration = "15 minutes"
        },
        @{
            Title = "5. Cut-over Management"
            Description = "Manage the migration process and rollback procedures"
            Url = "$StagingUrl/migration-dashboard"
            Duration = "20 minutes"
        }
    )
    
    foreach ($section in $sections) {
        Write-Host "📚 $($section.Title)" -ForegroundColor $Cyan
        Write-Host "   $($section.Description)" -ForegroundColor $White
        Write-Host "   Duration: $($section.Duration)" -ForegroundColor $Yellow
        Write-Host ""
        
        if (-not $DemoMode) {
            Write-Host "🌐 Opening: $($section.Url)" -ForegroundColor $Blue
            Start-Process $section.Url
            
            Write-Host "Press any key to continue to next section..." -ForegroundColor $Yellow
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        
        Write-Host ""
    }
}

# Demo training session
function Start-DemoTraining {
    Write-Section "Demo Training Session"
    
    Write-Host "🎬 Starting demo training session..." -ForegroundColor $Green
    Write-Host ""
    
    # Demo 1: Feature Flags
    Write-Host "Demo 1: Feature Flags Status" -ForegroundColor $Cyan
    Write-Host "  • Show current feature flag status" -ForegroundColor $White
    Write-Host "  • Explain how to enable/disable features" -ForegroundColor $White
    Write-Host "  • Demonstrate feature flag changes" -ForegroundColor $White
    Write-Host ""
    
    if (-not $DemoMode) {
        Start-Process "$StagingUrl/migration-dashboard"
        Start-Sleep -Seconds 3
    }
    
    # Demo 2: User Segmentation
    Write-Host "Demo 2: User Segmentation" -ForegroundColor $Cyan
    Write-Host "  • Show different user segments" -ForegroundColor $White
    Write-Host "  • Demonstrate segment testing" -ForegroundColor $White
    Write-Host "  • Explain segment criteria" -ForegroundColor $White
    Write-Host ""
    
    # Demo 3: A/B Testing
    Write-Host "Demo 3: A/B Testing Results" -ForegroundColor $Cyan
    Write-Host "  • Show A/B test results" -ForegroundColor $White
    Write-Host "  • Explain statistical significance" -ForegroundColor $White
    Write-Host "  • Demonstrate performance comparison" -ForegroundColor $White
    Write-Host ""
    
    # Demo 4: Performance Monitoring
    Write-Host "Demo 4: Performance Monitoring" -ForegroundColor $Cyan
    Write-Host "  • Show performance metrics" -ForegroundColor $White
    Write-Host "  • Explain performance thresholds" -ForegroundColor $White
    Write-Host "  • Demonstrate optimization recommendations" -ForegroundColor $White
    Write-Host ""
    
    # Demo 5: Cut-over Management
    Write-Host "Demo 5: Cut-over Management" -ForegroundColor $Cyan
    Write-Host "  • Show cut-over plans" -ForegroundColor $White
    Write-Host "  • Demonstrate rollback procedures" -ForegroundColor $White
    Write-Host "  • Explain success criteria" -ForegroundColor $White
    Write-Host ""
}

# Hands-on exercises
function Start-HandsOnExercises {
    Write-Section "Hands-on Exercises"
    
    $exercises = @(
        @{
            Title = "Exercise 1: User Segment Testing"
            Description = "Test different user segments and compare enabled features"
            Steps = @(
                "Navigate to the Migration Dashboard",
                "Use the 'Test User Segment' dropdown",
                "Select 'Early Adopters' segment",
                "Review enabled features",
                "Switch to 'Control Group' segment",
                "Compare the differences"
            )
        },
        @{
            Title = "Exercise 2: Performance Monitoring"
            Description = "Review performance metrics and optimization recommendations"
            Steps = @(
                "Navigate to Performance Metrics section",
                "Review current performance metrics",
                "Identify any performance issues",
                "Review optimization recommendations",
                "Understand performance thresholds"
            )
        },
        @{
            Title = "Exercise 3: Cut-over Management"
            Description = "Create and manage a cut-over plan"
            Steps = @(
                "Navigate to Cut-over Management section",
                "Click 'Create Cut-over Plan'",
                "Review the created plan",
                "Monitor cut-over progress",
                "Test rollback procedures"
            )
        },
        @{
            Title = "Exercise 4: A/B Test Analysis"
            Description = "Analyze A/B test results and make decisions"
            Steps = @(
                "Navigate to A/B Test Results section",
                "Review test results",
                "Analyze statistical significance",
                "Compare performance metrics",
                "Make data-driven decisions"
            )
        }
    )
    
    foreach ($exercise in $exercises) {
        Write-Host "🏋️ $($exercise.Title)" -ForegroundColor $Cyan
        Write-Host "   $($exercise.Description)" -ForegroundColor $White
        Write-Host ""
        
        Write-Host "Steps:" -ForegroundColor $Yellow
        for ($i = 0; $i -lt $exercise.Steps.Count; $i++) {
            Write-Host "   $($i + 1). $($exercise.Steps[$i])" -ForegroundColor $White
        }
        Write-Host ""
        
        if (-not $DemoMode) {
            Write-Host "Press any key to start this exercise..." -ForegroundColor $Yellow
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            
            Write-Host "🌐 Opening Migration Dashboard..." -ForegroundColor $Blue
            Start-Process "$StagingUrl/migration-dashboard"
            
            Write-Host "Complete the exercise and press any key when done..." -ForegroundColor $Yellow
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        
        Write-Host ""
    }
}

# Best practices and troubleshooting
function Show-BestPractices {
    Write-Section "Best Practices and Troubleshooting"
    
    Write-Host "📋 Best Practices:" -ForegroundColor $Green
    Write-Host ""
    
    $bestPractices = @(
        "Start with Early Adopters (10% of users)",
        "Monitor feedback and performance continuously",
        "Gradually increase user percentage",
        "Always have rollback plan ready",
        "Make data-driven decisions",
        "Communicate with users about changes",
        "Test rollback procedures regularly",
        "Set up alerts for critical issues"
    )
    
    foreach ($practice in $bestPractices) {
        Write-Host "  ✓ $practice" -ForegroundColor $White
    }
    
    Write-Host ""
    Write-Host "🔧 Common Issues and Solutions:" -ForegroundColor $Yellow
    Write-Host ""
    
    $troubleshooting = @(
        @{
            Issue = "Performance Degradation"
            Solution = "Check performance recommendations, implement optimizations, consider rollback"
        },
        @{
            Issue = "User Complaints"
            Solution = "Review user feedback, identify common issues, provide training"
        },
        @{
            Issue = "Feature Flag Issues"
            Solution = "Check feature flag status, verify user segment assignment"
        },
        @{
            Issue = "A/B Test Problems"
            Solution = "Increase test duration, increase sample size, review configuration"
        }
    )
    
    foreach ($item in $troubleshooting) {
        Write-Host "  🚨 $($item.Issue)" -ForegroundColor $Red
        Write-Host "     💡 $($item.Solution)" -ForegroundColor $White
        Write-Host ""
    }
}

# Training assessment
function Start-TrainingAssessment {
    Write-Section "Training Assessment"
    
    Write-Host "📝 Training Assessment Questions:" -ForegroundColor $Cyan
    Write-Host ""
    
    $questions = @(
        @{
            Question = "What are the different user segments in the migration system?"
            Answer = "Early Adopters (10%), Power Users (20%), Regular Users (40%), New Users (20%), Control Group (10%)"
        },
        @{
            Question = "What is the target user satisfaction score for successful migration?"
            Answer = "4.0/5 or higher"
        },
        @{
            Question = "What are the key performance metrics to monitor?"
            Answer = "Component render time (<16ms), page load time (<3000ms), user interaction time (<100ms), memory usage (<100MB)"
        },
        @{
            Question = "What should you do if user satisfaction drops below 3.0?"
            Answer = "Review user feedback, identify issues, provide training, consider rollback"
        },
        @{
            Question = "What is the recommended migration approach?"
            Answer = "Gradual migration starting with Early Adopters, monitoring continuously, making data-driven decisions"
        }
    )
    
    foreach ($question in $questions) {
        Write-Host "❓ $($question.Question)" -ForegroundColor $Yellow
        Write-Host ""
        
        if (-not $DemoMode) {
            Write-Host "Press any key to see the answer..." -ForegroundColor $Cyan
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        
        Write-Host "✅ Answer: $($question.Answer)" -ForegroundColor $Green
        Write-Host ""
    }
}

# Training completion
function Complete-Training {
    Write-Header "Training Completion"
    
    Write-Host "🎉 Congratulations! You have completed the FabManage Migration Dashboard training!" -ForegroundColor $Green
    Write-Host ""
    Write-Host "You now have the knowledge to:" -ForegroundColor $White
    Write-Host "  • Use the Migration Dashboard effectively" -ForegroundColor $White
    Write-Host "  • Manage user segmentation and A/B testing" -ForegroundColor $White
    Write-Host "  • Monitor performance and user feedback" -ForegroundColor $White
    Write-Host "  • Execute cut-over plans and rollback procedures" -ForegroundColor $White
    Write-Host "  • Troubleshoot common issues" -ForegroundColor $White
    Write-Host ""
    Write-Host "📚 Additional Resources:" -ForegroundColor $Cyan
    Write-Host "  • Training Guide: $TrainingDir/user-training-guide.md" -ForegroundColor $White
    Write-Host "  • Migration Dashboard: $StagingUrl/migration-dashboard" -ForegroundColor $White
    Write-Host "  • System Documentation: ./docs/" -ForegroundColor $White
    Write-Host ""
    Write-Host "🚀 Next Steps:" -ForegroundColor $Yellow
    Write-Host "  1. Start Migration with Early Adopters segment" -ForegroundColor $White
    Write-Host "  2. Monitor & Iterate using feedback and performance data" -ForegroundColor $White
    Write-Host "  3. Complete Full Cut-over when ready" -ForegroundColor $White
    Write-Host ""
}

# Main training function
function Start-UserTraining {
    Write-Header "FabManage User Training Session"
    
    # Check if staging environment is running
    if (-not (Test-StagingEnvironment)) {
        if (-not $SkipSetup) {
            Start-StagingEnvironment
        }
        else {
            Write-Error "Staging environment is not running and -SkipSetup was specified"
            exit 1
        }
    }
    
    # Show training overview
    Show-TrainingOverview
    
    # Start training based on mode
    switch ($TrainingMode) {
        "interactive" {
            Start-InteractiveTraining
            Start-HandsOnExercises
        }
        "demo" {
            Start-DemoTraining
        }
        "assessment" {
            Start-TrainingAssessment
        }
        "full" {
            Start-InteractiveTraining
            Start-HandsOnExercises
            Show-BestPractices
            Start-TrainingAssessment
        }
        default {
            Write-Error "Invalid training mode: $TrainingMode. Valid modes: interactive, demo, assessment, full"
            exit 1
        }
    }
    
    # Show best practices and troubleshooting
    Show-BestPractices
    
    # Complete training
    Complete-Training
}

# Run main training function
Start-UserTraining
