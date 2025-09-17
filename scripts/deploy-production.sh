#!/bin/bash

# FabManage Production Deployment Script
# This script deploys the FabManage application to production with monitoring

set -e

# Configuration
NAMESPACE="fabmanage-prod"
MONITORING_NAMESPACE="monitoring"
APP_NAME="fabmanage"
IMAGE_TAG=${1:-"latest"}
DOMAIN=${2:-"fabmanage.com"}

echo "🚀 Starting FabManage Production Deployment"
echo "Namespace: $NAMESPACE"
echo "Image Tag: $IMAGE_TAG"
echo "Domain: $DOMAIN"

# Function to check if kubectl is available
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        echo "❌ kubectl is not installed or not in PATH"
        exit 1
    fi
    echo "✅ kubectl is available"
}

# Function to check if cluster is accessible
check_cluster() {
    if ! kubectl cluster-info &> /dev/null; then
        echo "❌ Cannot connect to Kubernetes cluster"
        exit 1
    fi
    echo "✅ Connected to Kubernetes cluster"
}

# Function to create namespaces
create_namespaces() {
    echo "📦 Creating namespaces..."
    
    # Create main application namespace
    kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
    
    # Create monitoring namespace
    kubectl create namespace $MONITORING_NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
    
    echo "✅ Namespaces created"
}

# Function to deploy monitoring stack
deploy_monitoring() {
    echo "📊 Deploying monitoring stack..."
    
    # Deploy Prometheus
    kubectl apply -f k8s/monitoring/prometheus-deployment.yaml
    
    # Deploy Grafana
    kubectl apply -f k8s/monitoring/grafana-deployment.yaml
    
    # Deploy AlertManager
    kubectl apply -f k8s/monitoring/alertmanager-deployment.yaml
    
    # Wait for monitoring components to be ready
    echo "⏳ Waiting for monitoring components to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/prometheus -n $MONITORING_NAMESPACE
    kubectl wait --for=condition=available --timeout=300s deployment/grafana -n $MONITORING_NAMESPACE
    kubectl wait --for=condition=available --timeout=300s deployment/alertmanager -n $MONITORING_NAMESPACE
    
    echo "✅ Monitoring stack deployed"
}

# Function to deploy application
deploy_application() {
    echo "🏗️ Deploying FabManage application..."
    
    # Update image tag in deployment
    sed "s|IMAGE_TAG|$IMAGE_TAG|g" k8s/deployment.yaml | kubectl apply -f -
    
    # Apply other application resources
    kubectl apply -f k8s/configmap.yaml
    kubectl apply -f k8s/service.yaml
    
    # Wait for application to be ready
    echo "⏳ Waiting for application to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/$APP_NAME -n $NAMESPACE
    
    echo "✅ Application deployed"
}

# Function to deploy ingress
deploy_ingress() {
    echo "🌐 Deploying ingress..."
    
    # Update domain in ingress
    sed "s|DOMAIN|$DOMAIN|g" k8s/ingress.yaml | kubectl apply -f -
    sed "s|DOMAIN|$DOMAIN|g" k8s/monitoring/ingress.yaml | kubectl apply -f -
    
    echo "✅ Ingress deployed"
}

# Function to run health checks
run_health_checks() {
    echo "🏥 Running health checks..."
    
    # Get application URL
    APP_URL=$(kubectl get ingress $APP_NAME -n $NAMESPACE -o jsonpath='{.spec.rules[0].host}')
    
    if [ -z "$APP_URL" ]; then
        echo "❌ Could not determine application URL"
        return 1
    fi
    
    echo "Application URL: https://$APP_URL"
    
    # Wait for ingress to be ready
    echo "⏳ Waiting for ingress to be ready..."
    kubectl wait --for=condition=ready --timeout=300s ingress/$APP_NAME -n $NAMESPACE
    
    # Test application health endpoint
    echo "🔍 Testing application health..."
    if curl -f -s "https://$APP_URL/health" > /dev/null; then
        echo "✅ Application health check passed"
    else
        echo "❌ Application health check failed"
        return 1
    fi
    
    # Test monitoring endpoints
    echo "🔍 Testing monitoring endpoints..."
    
    # Grafana
    GRAFANA_URL=$(kubectl get ingress monitoring-ingress -n $MONITORING_NAMESPACE -o jsonpath='{.spec.rules[0].host}')
    if curl -f -s "https://$GRAFANA_URL" > /dev/null; then
        echo "✅ Grafana is accessible"
    else
        echo "❌ Grafana health check failed"
    fi
    
    # Prometheus
    PROMETHEUS_URL=$(kubectl get ingress monitoring-ingress -n $MONITORING_NAMESPACE -o jsonpath='{.spec.rules[1].host}')
    if curl -f -s "https://$PROMETHEUS_URL" > /dev/null; then
        echo "✅ Prometheus is accessible"
    else
        echo "❌ Prometheus health check failed"
    fi
}

# Function to display deployment information
display_info() {
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 Deployment Information:"
    echo "  Namespace: $NAMESPACE"
    echo "  Image Tag: $IMAGE_TAG"
    echo "  Domain: $DOMAIN"
    echo ""
    echo "🔗 Access URLs:"
    
    # Application URL
    APP_URL=$(kubectl get ingress $APP_NAME -n $NAMESPACE -o jsonpath='{.spec.rules[0].host}' 2>/dev/null || echo "Not available")
    echo "  Application: https://$APP_URL"
    
    # Monitoring URLs
    GRAFANA_URL=$(kubectl get ingress monitoring-ingress -n $MONITORING_NAMESPACE -o jsonpath='{.spec.rules[0].host}' 2>/dev/null || echo "Not available")
    PROMETHEUS_URL=$(kubectl get ingress monitoring-ingress -n $MONITORING_NAMESPACE -o jsonpath='{.spec.rules[1].host}' 2>/dev/null || echo "Not available")
    ALERTMANAGER_URL=$(kubectl get ingress monitoring-ingress -n $MONITORING_NAMESPACE -o jsonpath='{.spec.rules[2].host}' 2>/dev/null || echo "Not available")
    
    echo "  Grafana: https://$GRAFANA_URL"
    echo "  Prometheus: https://$PROMETHEUS_URL"
    echo "  AlertManager: https://$ALERTMANAGER_URL"
    echo ""
    echo "🔐 Default Credentials:"
    echo "  Grafana: admin / admin123"
    echo ""
    echo "📊 Monitoring:"
    echo "  - Application metrics are automatically collected"
    echo "  - Alerts are configured for critical issues"
    echo "  - Dashboards are pre-configured"
    echo ""
    echo "🛠️ Useful Commands:"
    echo "  kubectl get pods -n $NAMESPACE"
    echo "  kubectl get pods -n $MONITORING_NAMESPACE"
    echo "  kubectl logs -f deployment/$APP_NAME -n $NAMESPACE"
    echo ""
}

# Function to rollback deployment
rollback() {
    echo "🔄 Rolling back deployment..."
    
    # Rollback application deployment
    kubectl rollout undo deployment/$APP_NAME -n $NAMESPACE
    
    # Wait for rollback to complete
    kubectl rollout status deployment/$APP_NAME -n $NAMESPACE
    
    echo "✅ Rollback completed"
}

# Main execution
main() {
    echo "🚀 FabManage Production Deployment"
    echo "=================================="
    
    # Pre-deployment checks
    check_kubectl
    check_cluster
    
    # Deployment steps
    create_namespaces
    deploy_monitoring
    deploy_application
    deploy_ingress
    
    # Post-deployment verification
    if run_health_checks; then
        display_info
        echo "✅ Deployment completed successfully!"
        exit 0
    else
        echo "❌ Health checks failed. Rolling back..."
        rollback
        exit 1
    fi
}

# Handle script arguments
case "${1:-}" in
    "rollback")
        rollback
        ;;
    "health-check")
        run_health_checks
        ;;
    "info")
        display_info
        ;;
    *)
        main
        ;;
esac
