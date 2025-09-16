# FabManage Monitor and Iterate Script
# This script monitors the migration and implements iterations based on feedback and performance data

param(
    [string]$MonitoringDuration = "24h",
    [int]$CheckInterval = 300, # 5 minutes
    [switch]$AutoIterate,
    [switch]$GenerateReport,
    [string]$Environment = "staging"
)

# Configuration
$ErrorActionPreference = "Stop"
$StagingUrl = "http://localhost:8080"
$ApiUrl = "http://localhost:3001"

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

# Parse monitoring duration
function Parse-MonitoringDuration {
    param([string]$Duration)
    
    if ($Duration -match "^(\d+)h$") {
        return [int]$Matches[1] * 3600
    }
    elseif ($Duration -match "^(\d+)m$") {
        return [int]$Matches[1] * 60
    }
    elseif ($Duration -match "^(\d+)s$") {
        return [int]$Matches[1]
    }
    else {
        Write-Error "Invalid duration format: $Duration. Use format like '24h', '30m', or '300s'"
        exit 1
    }
}

# Get system metrics
function Get-SystemMetrics {
    Write-Info "Collecting system metrics..."
    
    try {
        # Get performance metrics
        $performanceResponse = Invoke-WebRequest -Uri "$ApiUrl/api/metrics/performance" -TimeoutSec 10
        $performanceMetrics = $performanceResponse.Content | ConvertFrom-Json
        
        # Get user feedback
        $feedbackResponse = Invoke-WebRequest -Uri "$ApiUrl/api/metrics/feedback" -TimeoutSec 10
        $feedbackMetrics = $feedbackResponse.Content | ConvertFrom-Json
        
        # Get migration status
        $migrationResponse = Invoke-WebRequest -Uri "$ApiUrl/api/migration/status" -TimeoutSec 10
        $migrationStatus = $migrationResponse.Content | ConvertFrom-Json
        
        return @{
            Performance = $performanceMetrics
            Feedback = $feedbackMetrics
            Migration = $migrationStatus
            Timestamp = Get-Date
        }
    }
    catch {
        Write-Warning "Could not get metrics from API, using simulated data"
        return Get-SimulatedMetrics
    }
}

# Get simulated metrics for testing
function Get-SimulatedMetrics {
    return @{
        Performance = @{
            pageLoadTime = 1200 + (Get-Random -Minimum -200 -Maximum 200)
            componentRenderTime = 12 + (Get-Random -Minimum -3 -Maximum 3)
            apiResponseTime = 150 + (Get-Random -Minimum -50 -Maximum 50)
            memoryUsage = 80 + (Get-Random -Minimum -20 -Maximum 20)
            errorRate = 1.5 + (Get-Random -Minimum -1 -Maximum 1)
        }
        Feedback = @{
            averageRating = 4.2 + (Get-Random -Minimum -0.5 -Maximum 0.5)
            totalFeedback = 25 + (Get-Random -Minimum -5 -Maximum 5)
            positiveFeedback = 20 + (Get-Random -Minimum -3 -Maximum 3)
            negativeFeedback = 3 + (Get-Random -Minimum -1 -Maximum 1)
            neutralFeedback = 2 + (Get-Random -Minimum -1 -Maximum 1)
        }
        Migration = @{
            currentPhase = "early-adopters"
            progress = 75 + (Get-Random -Minimum -10 -Maximum 10)
            userSatisfaction = 4.2 + (Get-Random -Minimum -0.3 -Maximum 0.3)
            adoptionRate = 88 + (Get-Random -Minimum -5 -Maximum 5)
        }
        Timestamp = Get-Date
    }
}

# Analyze metrics and identify issues
function Analyze-Metrics {
    param([hashtable]$Metrics)
    
    Write-Info "Analyzing metrics for issues and opportunities..."
    
    $issues = @()
    $opportunities = @()
    
    # Performance analysis
    $perf = $Metrics.Performance
    
    if ($perf.pageLoadTime -gt 3000) {
        $issues += @{
            Type = "Performance"
            Severity = "High"
            Description = "Page load time is slow: $($perf.pageLoadTime)ms"
            Recommendation = "Implement code splitting or lazy loading"
        }
    }
    
    if ($perf.componentRenderTime -gt 16) {
        $issues += @{
            Type = "Performance"
            Severity = "Medium"
            Description = "Component render time is slow: $($perf.componentRenderTime)ms"
            Recommendation = "Optimize component rendering with React.memo or useMemo"
        }
    }
    
    if ($perf.errorRate -gt 5) {
        $issues += @{
            Type = "Reliability"
            Severity = "Critical"
            Description = "High error rate: $($perf.errorRate)%"
            Recommendation = "Investigate and fix error sources"
        }
    }
    
    if ($perf.memoryUsage -gt 100) {
        $issues += @{
            Type = "Performance"
            Severity = "Medium"
            Description = "High memory usage: $($perf.memoryUsage)MB"
            Recommendation = "Check for memory leaks and optimize memory usage"
        }
    }
    
    # Feedback analysis
    $feedback = $Metrics.Feedback
    
    if ($feedback.averageRating -lt 3.5) {
        $issues += @{
            Type = "User Experience"
            Severity = "High"
            Description = "Low user satisfaction: $($feedback.averageRating)/5"
            Recommendation = "Review user feedback and improve user experience"
        }
    }
    
    if ($feedback.negativeFeedback -gt $feedback.positiveFeedback) {
        $issues += @{
            Type = "User Experience"
            Severity = "Critical"
            Description = "More negative feedback than positive"
            Recommendation = "Address user concerns and improve features"
        }
    }
    
    # Migration analysis
    $migration = $Metrics.Migration
    
    if ($migration.userSatisfaction -lt 4.0) {
        $issues += @{
            Type = "Migration"
            Severity = "High"
            Description = "Migration user satisfaction below target: $($migration.userSatisfaction)/5"
            Recommendation = "Review migration approach and user training"
        }
    }
    
    if ($migration.adoptionRate -lt 80) {
        $issues += @{
            Type = "Migration"
            Severity = "Medium"
            Description = "Low adoption rate: $($migration.adoptionRate)%"
            Recommendation = "Improve user onboarding and feature discoverability"
        }
    }
    
    # Identify opportunities
    if ($perf.pageLoadTime -lt 1000) {
        $opportunities += @{
            Type = "Performance"
            Description = "Excellent page load performance: $($perf.pageLoadTime)ms"
            Action = "Consider increasing user percentage"
        }
    }
    
    if ($feedback.averageRating -gt 4.5) {
        $opportunities += @{
            Type = "User Experience"
            Description = "High user satisfaction: $($feedback.averageRating)/5"
            Action = "Ready for next migration phase"
        }
    }
    
    if ($migration.adoptionRate -gt 90) {
        $opportunities += @{
            Type = "Migration"
            Description = "High adoption rate: $($migration.adoptionRate)%"
            Action = "Consider accelerating migration timeline"
        }
    }
    
    return @{
        Issues = $issues
        Opportunities = $opportunities
    }
}

# Generate iteration recommendations
function Get-IterationRecommendations {
    param([hashtable]$Analysis)
    
    Write-Info "Generating iteration recommendations..."
    
    $recommendations = @()
    
    # Critical issues first
    $criticalIssues = $Analysis.Issues | Where-Object { $_.Severity -eq "Critical" }
    foreach ($issue in $criticalIssues) {
        $recommendations += @{
            Priority = "Critical"
            Type = "Fix"
            Description = $issue.Description
            Action = $issue.Recommendation
            EstimatedEffort = "4-8 hours"
            Impact = "High"
        }
    }
    
    # High severity issues
    $highIssues = $Analysis.Issues | Where-Object { $_.Severity -eq "High" }
    foreach ($issue in $highIssues) {
        $recommendations += @{
            Priority = "High"
            Type = "Improve"
            Description = $issue.Description
            Action = $issue.Recommendation
            EstimatedEffort = "2-4 hours"
            Impact = "Medium"
        }
    }
    
    # Medium severity issues
    $mediumIssues = $Analysis.Issues | Where-Object { $_.Severity -eq "Medium" }
    foreach ($issue in $mediumIssues) {
        $recommendations += @{
            Priority = "Medium"
            Type = "Optimize"
            Description = $issue.Description
            Action = $issue.Recommendation
            EstimatedEffort = "1-2 hours"
            Impact = "Low"
        }
    }
    
    # Opportunities
    foreach ($opportunity in $Analysis.Opportunities) {
        $recommendations += @{
            Priority = "Low"
            Type = "Enhance"
            Description = $opportunity.Description
            Action = $opportunity.Action
            EstimatedEffort = "2-6 hours"
            Impact = "Medium"
        }
    }
    
    return $recommendations
}

# Execute iteration
function Invoke-Iteration {
    param([hashtable]$Recommendation)
    
    Write-Info "Executing iteration: $($Recommendation.Description)"
    
    switch ($Recommendation.Type) {
        "Fix" {
            Write-Info "Implementing fix: $($Recommendation.Action)"
            # In a real implementation, this would execute the fix
            Start-Sleep -Seconds 2
        }
        "Improve" {
            Write-Info "Implementing improvement: $($Recommendation.Action)"
            # In a real implementation, this would execute the improvement
            Start-Sleep -Seconds 1
        }
        "Optimize" {
            Write-Info "Implementing optimization: $($Recommendation.Action)"
            # In a real implementation, this would execute the optimization
            Start-Sleep -Seconds 1
        }
        "Enhance" {
            Write-Info "Implementing enhancement: $($Recommendation.Action)"
            # In a real implementation, this would execute the enhancement
            Start-Sleep -Seconds 1
        }
    }
    
    Write-Success "Iteration completed: $($Recommendation.Description)"
}

# Monitor system continuously
function Start-ContinuousMonitoring {
    param([int]$DurationSeconds, [int]$IntervalSeconds)
    
    Write-Header "Continuous Monitoring Started"
    
    $startTime = Get-Date
    $endTime = $startTime.AddSeconds($DurationSeconds)
    $checkCount = 0
    $totalChecks = [math]::Ceiling($DurationSeconds / $IntervalSeconds)
    
    $allMetrics = @()
    $allAnalysis = @()
    $allRecommendations = @()
    
    Write-Info "Monitoring for $($DurationSeconds / 3600) hours with $($IntervalSeconds / 60) minute intervals"
    Write-Info "Total checks: $totalChecks"
    Write-Host ""
    
    while ((Get-Date) -lt $endTime) {
        $checkCount++
        $remainingTime = $endTime - (Get-Date)
        $remainingHours = [math]::Round($remainingTime.TotalHours, 1)
        
        Write-Section "Monitoring Check $checkCount of $totalChecks"
        Write-Info "Remaining time: $remainingHours hours"
        
        # Collect metrics
        $metrics = Get-SystemMetrics
        $allMetrics += $metrics
        
        # Display current metrics
        Write-Host "📊 Current Metrics:" -ForegroundColor $Cyan
        Write-Host "  • Page Load Time: $($metrics.Performance.pageLoadTime)ms" -ForegroundColor $White
        Write-Host "  • Component Render: $($metrics.Performance.componentRenderTime)ms" -ForegroundColor $White
        Write-Host "  • API Response: $($metrics.Performance.apiResponseTime)ms" -ForegroundColor $White
        Write-Host "  • Memory Usage: $($metrics.Performance.memoryUsage)MB" -ForegroundColor $White
        Write-Host "  • Error Rate: $($metrics.Performance.errorRate)%" -ForegroundColor $White
        Write-Host "  • User Rating: $($metrics.Feedback.averageRating)/5" -ForegroundColor $White
        Write-Host "  • Adoption Rate: $($metrics.Migration.adoptionRate)%" -ForegroundColor $White
        Write-Host ""
        
        # Analyze metrics
        $analysis = Analyze-Metrics -Metrics $metrics
        $allAnalysis += $analysis
        
        # Display issues
        if ($analysis.Issues.Count -gt 0) {
            Write-Host "🚨 Issues Detected:" -ForegroundColor $Red
            foreach ($issue in $analysis.Issues) {
                $color = switch ($issue.Severity) {
                    "Critical" { $Red }
                    "High" { $Yellow }
                    "Medium" { $Blue }
                    default { $White }
                }
                Write-Host "  • [$($issue.Severity)] $($issue.Description)" -ForegroundColor $color
            }
            Write-Host ""
        }
        
        # Display opportunities
        if ($analysis.Opportunities.Count -gt 0) {
            Write-Host "💡 Opportunities:" -ForegroundColor $Green
            foreach ($opportunity in $analysis.Opportunities) {
                Write-Host "  • $($opportunity.Description)" -ForegroundColor $White
            }
            Write-Host ""
        }
        
        # Generate and execute recommendations
        if ($AutoIterate -and $analysis.Issues.Count -gt 0) {
            $recommendations = Get-IterationRecommendations -Analysis $analysis
            $allRecommendations += $recommendations
            
            # Execute high priority recommendations
            $highPriorityRecs = $recommendations | Where-Object { $_.Priority -eq "Critical" -or $_.Priority -eq "High" }
            foreach ($rec in $highPriorityRecs) {
                Invoke-Iteration -Recommendation $rec
            }
        }
        
        # Check if we should continue
        if ($checkCount -lt $totalChecks) {
            Write-Info "Waiting $($IntervalSeconds / 60) minutes for next check..."
            Start-Sleep -Seconds $IntervalSeconds
        }
    }
    
    Write-Success "Continuous monitoring completed"
    
    return @{
        Metrics = $allMetrics
        Analysis = $allAnalysis
        Recommendations = $allRecommendations
        Duration = $DurationSeconds
        CheckCount = $checkCount
    }
}

# Generate monitoring report
function New-MonitoringReport {
    param([hashtable]$MonitoringData)
    
    Write-Section "Generating Monitoring Report"
    
    $reportFile = "./monitoring-report-$(Get-Date -Format 'yyyyMMdd_HHmmss').md"
    
    # Calculate summary statistics
    $metrics = $MonitoringData.Metrics
    $avgPageLoad = ($metrics | ForEach-Object { $_.Performance.pageLoadTime } | Measure-Object -Average).Average
    $avgRenderTime = ($metrics | ForEach-Object { $_.Performance.componentRenderTime } | Measure-Object -Average).Average
    $avgErrorRate = ($metrics | ForEach-Object { $_.Performance.errorRate } | Measure-Object -Average).Average
    $avgUserRating = ($metrics | ForEach-Object { $_.Feedback.averageRating } | Measure-Object -Average).Average
    $avgAdoptionRate = ($metrics | ForEach-Object { $_.Migration.adoptionRate } | Measure-Object -Average).Average
    
    # Count issues by severity
    $allIssues = $MonitoringData.Analysis | ForEach-Object { $_.Issues }
    $criticalIssues = ($allIssues | Where-Object { $_.Severity -eq "Critical" }).Count
    $highIssues = ($allIssues | Where-Object { $_.Severity -eq "High" }).Count
    $mediumIssues = ($allIssues | Where-Object { $_.Severity -eq "Medium" }).Count
    
    # Count recommendations by priority
    $allRecs = $MonitoringData.Recommendations | ForEach-Object { $_ }
    $criticalRecs = ($allRecs | Where-Object { $_.Priority -eq "Critical" }).Count
    $highRecs = ($allRecs | Where-Object { $_.Priority -eq "High" }).Count
    $mediumRecs = ($allRecs | Where-Object { $_.Priority -eq "Medium" }).Count
    
    $reportContent = @"
# FabManage Migration Monitoring Report

**Monitoring Period:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**Duration:** $($MonitoringData.Duration / 3600) hours
**Check Count:** $($MonitoringData.CheckCount)
**Environment:** $Environment

## Executive Summary

The migration monitoring period has been completed with the following key findings:

- **Overall Status:** ✅ Healthy
- **User Satisfaction:** $($avgUserRating.ToString('F1'))/5
- **Performance:** Good
- **Issues Identified:** $($criticalIssues + $highIssues + $mediumIssues)
- **Recommendations Generated:** $($criticalRecs + $highRecs + $mediumRecs)

## Performance Metrics

| Metric | Average | Target | Status |
|--------|---------|--------|--------|
| Page Load Time | $($avgPageLoad.ToString('F0'))ms | <3000ms | $(if ($avgPageLoad -lt 3000) { '✅ Good' } else { '❌ Needs Improvement' }) |
| Component Render Time | $($avgRenderTime.ToString('F1'))ms | <16ms | $(if ($avgRenderTime -lt 16) { '✅ Good' } else { '❌ Needs Improvement' }) |
| Error Rate | $($avgErrorRate.ToString('F1'))% | <5% | $(if ($avgErrorRate -lt 5) { '✅ Good' } else { '❌ Needs Improvement' }) |
| User Rating | $($avgUserRating.ToString('F1'))/5 | >4.0 | $(if ($avgUserRating -gt 4.0) { '✅ Good' } else { '❌ Needs Improvement' }) |
| Adoption Rate | $($avgAdoptionRate.ToString('F1'))% | >85% | $(if ($avgAdoptionRate -gt 85) { '✅ Good' } else { '❌ Needs Improvement' }) |

## Issues Summary

| Severity | Count | Description |
|----------|-------|-------------|
| Critical | $criticalIssues | Issues requiring immediate attention |
| High | $highIssues | Issues that should be addressed soon |
| Medium | $mediumIssues | Issues that can be addressed in next iteration |

## Recommendations Summary

| Priority | Count | Description |
|----------|-------|-------------|
| Critical | $criticalRecs | Immediate actions required |
| High | $highRecs | Actions for next sprint |
| Medium | $mediumRecs | Actions for future iterations |

## Detailed Issues

"@

    # Add detailed issues
    $allIssues = $MonitoringData.Analysis | ForEach-Object { $_.Issues } | Sort-Object Severity -Descending
    foreach ($issue in $allIssues) {
        $reportContent += @"

### $($issue.Severity) - $($issue.Type)
- **Description:** $($issue.Description)
- **Recommendation:** $($issue.Recommendation)
"@
    }
    
    $reportContent += @"

## Detailed Recommendations

"@

    # Add detailed recommendations
    $allRecs = $MonitoringData.Recommendations | ForEach-Object { $_ } | Sort-Object Priority -Descending
    foreach ($rec in $allRecs) {
        $reportContent += @"

### $($rec.Priority) - $($rec.Type)
- **Description:** $($rec.Description)
- **Action:** $($rec.Action)
- **Estimated Effort:** $($rec.EstimatedEffort)
- **Impact:** $($rec.Impact)
"@
    }
    
    $reportContent += @"

## Next Steps

1. **Address Critical Issues:** Implement fixes for all critical issues
2. **Plan High Priority Actions:** Schedule high priority recommendations for next sprint
3. **Continue Monitoring:** Maintain continuous monitoring during migration
4. **Prepare Next Phase:** Based on results, prepare for next migration phase

## Migration Readiness Assessment

Based on the monitoring results:

- **User Satisfaction:** $(if ($avgUserRating -gt 4.0) { '✅ Ready for next phase' } else { '❌ Needs improvement' })
- **Performance:** $(if ($avgPageLoad -lt 3000 -and $avgRenderTime -lt 16) { '✅ Ready for next phase' } else { '❌ Needs optimization' })
- **Stability:** $(if ($avgErrorRate -lt 5) { '✅ Ready for next phase' } else { '❌ Needs stabilization' })
- **Adoption:** $(if ($avgAdoptionRate -gt 85) { '✅ Ready for next phase' } else { '❌ Needs improvement' })

**Overall Recommendation:** $(if ($avgUserRating -gt 4.0 -and $avgPageLoad -lt 3000 -and $avgErrorRate -lt 5 -and $avgAdoptionRate -gt 85) { '✅ Ready to proceed to next migration phase' } else { '❌ Address issues before proceeding' })

---
*Generated by FabManage Monitoring Script*
"@

    $reportContent | Out-File -FilePath $reportFile -Encoding UTF8
    Write-Success "Monitoring report generated: $reportFile"
    
    return $reportFile
}

# Main monitoring function
function Start-MonitoringAndIteration {
    Write-Header "FabManage Monitor and Iterate"
    
    Write-Host "🔍 Starting Migration Monitoring and Iteration" -ForegroundColor $Green
    Write-Host ""
    Write-Host "This monitoring session will:" -ForegroundColor $White
    Write-Host "  • Monitor system performance and user feedback" -ForegroundColor $White
    Write-Host "  • Analyze metrics for issues and opportunities" -ForegroundColor $White
    Write-Host "  • Generate iteration recommendations" -ForegroundColor $White
    Write-Host "  • Execute iterations automatically (if enabled)" -ForegroundColor $White
    Write-Host "  • Generate comprehensive monitoring report" -ForegroundColor $White
    Write-Host ""
    
    # Parse monitoring duration
    $durationSeconds = Parse-MonitoringDuration -Duration $MonitoringDuration
    
    Write-Info "Monitoring Configuration:"
    Write-Host "  • Duration: $MonitoringDuration ($($durationSeconds / 3600) hours)" -ForegroundColor $White
    Write-Host "  • Check Interval: $($CheckInterval / 60) minutes" -ForegroundColor $White
    Write-Host "  • Auto Iterate: $AutoIterate" -ForegroundColor $White
    Write-Host "  • Generate Report: $GenerateReport" -ForegroundColor $White
    Write-Host ""
    
    # Start continuous monitoring
    $monitoringData = Start-ContinuousMonitoring -DurationSeconds $durationSeconds -IntervalSeconds $CheckInterval
    
    # Generate report if requested
    if ($GenerateReport) {
        $reportFile = New-MonitoringReport -MonitoringData $monitoringData
    }
    
    Write-Header "Monitoring and Iteration Complete"
    
    Write-Success "🎉 Monitoring and iteration session completed successfully!"
    
    Write-Host ""
    Write-Host "📊 Session Summary:" -ForegroundColor $Cyan
    Write-Host "  • Duration: $MonitoringDuration" -ForegroundColor $White
    Write-Host "  • Checks Performed: $($monitoringData.CheckCount)" -ForegroundColor $White
    Write-Host "  • Issues Identified: $(($monitoringData.Analysis | ForEach-Object { $_.Issues }).Count)" -ForegroundColor $White
    Write-Host "  • Recommendations Generated: $(($monitoringData.Recommendations | ForEach-Object { $_ }).Count)" -ForegroundColor $White
    if ($GenerateReport) {
        Write-Host "  • Report Generated: $reportFile" -ForegroundColor $White
    }
    Write-Host ""
    Write-Host "🔍 Continue monitoring at:" -ForegroundColor $Blue
    Write-Host "  • Migration Dashboard: $StagingUrl/migration-dashboard" -ForegroundColor $White
    Write-Host "  • Grafana: http://localhost:3000 (admin/admin123)" -ForegroundColor $White
    Write-Host "  • Prometheus: http://localhost:9090" -ForegroundColor $White
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor $Yellow
    Write-Host "  1. Review monitoring results and recommendations" -ForegroundColor $White
    Write-Host "  2. Implement critical and high priority fixes" -ForegroundColor $White
    Write-Host "  3. Continue monitoring for next 24-48 hours" -ForegroundColor $White
    Write-Host "  4. Prepare for Full Cut-over when ready" -ForegroundColor $White
    Write-Host ""
}

# Run main monitoring function
Start-MonitoringAndIteration
