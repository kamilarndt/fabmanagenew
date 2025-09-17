#!/bin/bash

# FabManage Health Check Script
# This script performs comprehensive health checks on the deployed application

set -e

# Configuration
NAMESPACE="fabmanage-prod"
MONITORING_NAMESPACE="monitoring"
APP_NAME="fabmanage"

echo "🏥 FabManage Health Check"
echo "========================"

# Function to check pod status
check_pods() {
    echo "📦 Checking pod status..."
    
    # Check application pods
    echo "Application pods:"
    kubectl get pods -n $NAMESPACE -l app=$APP_NAME
    
    # Check monitoring pods
    echo "Monitoring pods:"
    kubectl get pods -n $MONITORING_NAMESPACE
    
    # Check if all pods are running
    FAILED_PODS=$(kubectl get pods -n $NAMESPACE -l app=$APP_NAME --field-selector=status.phase!=Running --no-headers | wc -l)
    if [ $FAILED_PODS -gt 0 ]; then
        echo "❌ Some application pods are not running"
        return 1
    fi
    
    echo "✅ All pods are running"
}

# Function to check service endpoints
check_services() {
    echo "🔗 Checking service endpoints..."
    
    # Check application service
    kubectl get svc -n $NAMESPACE $APP_NAME
    
    # Check monitoring services
    kubectl get svc -n $MONITORING_NAMESPACE
    
    echo "✅ Services are configured"
}

# Function to check ingress
check_ingress() {
    echo "🌐 Checking ingress configuration..."
    
    # Check application ingress
    kubectl get ingress -n $NAMESPACE
    
    # Check monitoring ingress
    kubectl get ingress -n $MONITORING_NAMESPACE
    
    echo "✅ Ingress is configured"
}

# Function to check application health endpoint
check_application_health() {
    echo "🔍 Checking application health..."
    
    # Get application URL
    APP_URL=$(kubectl get ingress $APP_NAME -n $NAMESPACE -o jsonpath='{.spec.rules[0].host}' 2>/dev/null)
    
    if [ -z "$APP_URL" ]; then
        echo "❌ Could not determine application URL"
        return 1
    fi
    
    echo "Application URL: https://$APP_URL"
    
    # Test health endpoint
    if curl -f -s "https://$APP_URL/health" > /dev/null; then
        echo "✅ Application health endpoint is responding"
    else
        echo "❌ Application health endpoint is not responding"
        return 1
    fi
    
    # Test main application
    if curl -f -s "https://$APP_URL" > /dev/null; then
        echo "✅ Application is accessible"
    else
        echo "❌ Application is not accessible"
        return 1
    fi
}

# Function to check monitoring endpoints
check_monitoring_health() {
    echo "📊 Checking monitoring endpoints..."
    
    # Get monitoring URLs
    GRAFANA_URL=$(kubectl get ingress monitoring-ingress -n $MONITORING_NAMESPACE -o jsonpath='{.spec.rules[0].host}' 2>/dev/null)
    PROMETHEUS_URL=$(kubectl get ingress monitoring-ingress -n $MONITORING_NAMESPACE -o jsonpath='{.spec.rules[1].host}' 2>/dev/null)
    ALERTMANAGER_URL=$(kubectl get ingress monitoring-ingress -n $MONITORING_NAMESPACE -o jsonpath='{.spec.rules[2].host}' 2>/dev/null)
    
    # Test Grafana
    if [ ! -z "$GRAFANA_URL" ]; then
        if curl -f -s "https://$GRAFANA_URL" > /dev/null; then
            echo "✅ Grafana is accessible at https://$GRAFANA_URL"
        else
            echo "❌ Grafana is not accessible"
        fi
    fi
    
    # Test Prometheus
    if [ ! -z "$PROMETHEUS_URL" ]; then
        if curl -f -s "https://$PROMETHEUS_URL" > /dev/null; then
            echo "✅ Prometheus is accessible at https://$PROMETHEUS_URL"
        else
            echo "❌ Prometheus is not accessible"
        fi
    fi
    
    # Test AlertManager
    if [ ! -z "$ALERTMANAGER_URL" ]; then
        if curl -f -s "https://$ALERTMANAGER_URL" > /dev/null; then
            echo "✅ AlertManager is accessible at https://$ALERTMANAGER_URL"
        else
            echo "❌ AlertManager is not accessible"
        fi
    fi
}

# Function to check resource usage
check_resources() {
    echo "💾 Checking resource usage..."
    
    # Check node resources
    kubectl top nodes
    
    # Check pod resources
    echo "Application pod resources:"
    kubectl top pods -n $NAMESPACE -l app=$APP_NAME
    
    echo "Monitoring pod resources:"
    kubectl top pods -n $MONITORING_NAMESPACE
}

# Function to check logs for errors
check_logs() {
    echo "📋 Checking recent logs for errors..."
    
    # Check application logs
    echo "Recent application logs:"
    kubectl logs -n $NAMESPACE -l app=$APP_NAME --tail=20
    
    # Check for error patterns
    ERROR_COUNT=$(kubectl logs -n $NAMESPACE -l app=$APP_NAME --tail=100 | grep -i error | wc -l)
    if [ $ERROR_COUNT -gt 0 ]; then
        echo "⚠️ Found $ERROR_COUNT error messages in recent logs"
    else
        echo "✅ No recent errors found in logs"
    fi
}

# Function to check database connectivity
check_database() {
    echo "🗄️ Checking database connectivity..."
    
    # Check if database pods are running
    DB_PODS=$(kubectl get pods -n $NAMESPACE -l app=database --no-headers | wc -l)
    if [ $DB_PODS -gt 0 ]; then
        echo "Database pods found:"
        kubectl get pods -n $NAMESPACE -l app=database
        
        # Test database connectivity
        kubectl exec -n $NAMESPACE -l app=$APP_NAME -- pg_isready -h database -p 5432
        if [ $? -eq 0 ]; then
            echo "✅ Database connectivity is working"
        else
            echo "❌ Database connectivity failed"
        fi
    else
        echo "ℹ️ No database pods found (using external database)"
    fi
}

# Function to run comprehensive health check
run_comprehensive_check() {
    echo "🔍 Running comprehensive health check..."
    
    local exit_code=0
    
    # Run all checks
    check_pods || exit_code=1
    check_services || exit_code=1
    check_ingress || exit_code=1
    check_application_health || exit_code=1
    check_monitoring_health || exit_code=1
    check_resources
    check_logs
    check_database || exit_code=1
    
    if [ $exit_code -eq 0 ]; then
        echo ""
        echo "🎉 All health checks passed!"
        echo "✅ System is healthy and operational"
    else
        echo ""
        echo "❌ Some health checks failed!"
        echo "⚠️ Please review the issues above"
    fi
    
    return $exit_code
}

# Function to display system status
display_status() {
    echo ""
    echo "📊 System Status Summary"
    echo "========================"
    
    # Application status
    echo "Application:"
    kubectl get deployment $APP_NAME -n $NAMESPACE -o wide
    
    # Monitoring status
    echo "Monitoring:"
    kubectl get deployments -n $MONITORING_NAMESPACE
    
    # Resource usage
    echo "Resource Usage:"
    kubectl top nodes
}

# Main execution
main() {
    case "${1:-comprehensive}" in
        "pods")
            check_pods
            ;;
        "services")
            check_services
            ;;
        "ingress")
            check_ingress
            ;;
        "app")
            check_application_health
            ;;
        "monitoring")
            check_monitoring_health
            ;;
        "resources")
            check_resources
            ;;
        "logs")
            check_logs
            ;;
        "database")
            check_database
            ;;
        "status")
            display_status
            ;;
        "comprehensive")
            run_comprehensive_check
            ;;
        *)
            echo "Usage: $0 [pods|services|ingress|app|monitoring|resources|logs|database|status|comprehensive]"
            echo "Default: comprehensive"
            ;;
    esac
}

main "$@"
