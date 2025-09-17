# Production Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying FabManage-Clean2 to production with full monitoring, security, and high availability.

## Prerequisites

### Infrastructure Requirements

- **Kubernetes Cluster**: Version 1.21 or higher
- **Node Resources**: Minimum 4 CPU cores, 8GB RAM per node
- **Storage**: Persistent volumes for application data
- **Network**: Load balancer and ingress controller
- **SSL/TLS**: Certificate management (Let's Encrypt recommended)

### Required Tools

- `kubectl` - Kubernetes command-line tool
- `helm` - Package manager for Kubernetes (optional)
- `curl` - For health checks
- `jq` - JSON processor (optional)

### Access Requirements

- Kubernetes cluster admin access
- Docker registry access for image pulls
- DNS management for domain configuration
- SSL certificate provisioning

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Environment                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Application   │  │   Monitoring    │  │   Security   │ │
│  │   Namespace     │  │   Namespace     │  │   Policies   │ │
│  │                 │  │                 │  │              │ │
│  │ • FabManage App │  │ • Prometheus    │  │ • RBAC       │ │
│  │ • Database      │  │ • Grafana       │  │ • Network    │ │
│  │ • Redis Cache   │  │ • AlertManager  │  │   Policies   │ │
│  │ • File Storage  │  │ • Node Exporter │  │ • Pod        │ │
│  └─────────────────┘  └─────────────────┘  │   Security   │ │
│                                            └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Ingress & Load Balancer                  │
│  • SSL Termination                                          │
│  • Domain Routing                                           │
│  • Rate Limiting                                            │
└─────────────────────────────────────────────────────────────┘
```

## Step-by-Step Deployment

### 1. Environment Preparation

#### Create Namespaces

```bash
# Create application namespace
kubectl create namespace fabmanage-prod

# Create monitoring namespace
kubectl create namespace monitoring

# Label namespaces
kubectl label namespace fabmanage-prod app=fabmanage
kubectl label namespace monitoring app=monitoring
```

#### Configure Secrets

```bash
# Create application secrets
kubectl create secret generic fabmanage-secrets \
  --from-literal=database-url="postgresql://user:pass@db:5432/fabmanage" \
  --from-literal=jwt-secret="your-jwt-secret-key" \
  --from-literal=encryption-key="your-encryption-key" \
  -n fabmanage-prod

# Create monitoring secrets
kubectl create secret generic grafana-secret \
  --from-literal=admin-password="admin123" \
  -n monitoring
```

### 2. Deploy Monitoring Stack

#### Deploy Prometheus

```bash
# Apply Prometheus configuration
kubectl apply -f k8s/monitoring/prometheus-deployment.yaml

# Verify deployment
kubectl get pods -n monitoring -l app=prometheus
```

#### Deploy Grafana

```bash
# Apply Grafana configuration
kubectl apply -f k8s/monitoring/grafana-deployment.yaml

# Verify deployment
kubectl get pods -n monitoring -l app=grafana
```

#### Deploy AlertManager

```bash
# Apply AlertManager configuration
kubectl apply -f k8s/monitoring/alertmanager-deployment.yaml

# Verify deployment
kubectl get pods -n monitoring -l app=alertmanager
```

### 3. Deploy Application

#### Build and Push Docker Image

```bash
# Build production image
docker build -f Dockerfile.production -t fabmanage:latest .

# Tag for registry
docker tag fabmanage:latest your-registry.com/fabmanage:latest

# Push to registry
docker push your-registry.com/fabmanage:latest
```

#### Deploy Application Components

```bash
# Deploy application
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/configmap.yaml

# Verify deployment
kubectl get pods -n fabmanage-prod -l app=fabmanage
```

### 4. Configure Ingress and SSL

#### Deploy Ingress

```bash
# Update domain in ingress files
sed -i 's/DOMAIN/your-domain.com/g' k8s/ingress.yaml
sed -i 's/DOMAIN/your-domain.com/g' k8s/monitoring/ingress.yaml

# Apply ingress configurations
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/monitoring/ingress.yaml
```

#### Configure SSL Certificates

```bash
# Install cert-manager (if not already installed)
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create Let's Encrypt issuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@your-domain.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### 5. Automated Deployment

#### Using Deployment Script

```bash
# Make script executable
chmod +x scripts/deploy-production.sh

# Deploy with custom parameters
./scripts/deploy-production.sh v1.0.0 your-domain.com

# Or use default values
./scripts/deploy-production.sh
```

#### Deployment Options

```bash
# Deploy specific version
./scripts/deploy-production.sh v1.2.3

# Deploy with custom domain
./scripts/deploy-production.sh latest myapp.example.com

# Rollback deployment
./scripts/deploy-production.sh rollback

# Run health checks
./scripts/deploy-production.sh health-check

# Display deployment info
./scripts/deploy-production.sh info
```

## Health Checks and Monitoring

### Automated Health Checks

```bash
# Run comprehensive health check
./scripts/health-check.sh comprehensive

# Check specific components
./scripts/health-check.sh pods
./scripts/health-check.sh services
./scripts/health-check.sh app
./scripts/health-check.sh monitoring
```

### Monitoring Dashboards

#### Access URLs

- **Application**: https://your-domain.com
- **Grafana**: https://grafana.your-domain.com
- **Prometheus**: https://prometheus.your-domain.com
- **AlertManager**: https://alertmanager.your-domain.com

#### Default Credentials

- **Grafana**: admin / admin123
- **Application**: Use your configured authentication

### Key Metrics to Monitor

#### Application Metrics

- Request rate and response time
- Error rate (4xx and 5xx responses)
- Active user sessions
- Database connection pool usage
- Memory and CPU utilization

#### Infrastructure Metrics

- Node resource usage
- Pod health and restart counts
- Network traffic and latency
- Storage usage and I/O
- SSL certificate expiration

#### Business Metrics

- User registration and login rates
- Project creation and completion
- File upload/download volumes
- API usage patterns
- Cost tracking accuracy

## Security Configuration

### Network Policies

```yaml
# Example network policy
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: fabmanage-network-policy
  namespace: fabmanage-prod
spec:
  podSelector:
    matchLabels:
      app: fabmanage
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - protocol: TCP
          port: 3000
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: monitoring
      ports:
        - protocol: TCP
          port: 9090
```

### Pod Security Policies

```yaml
# Example pod security policy
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: fabmanage-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - "configMap"
    - "emptyDir"
    - "projected"
    - "secret"
    - "downwardAPI"
    - "persistentVolumeClaim"
  runAsUser:
    rule: "MustRunAsNonRoot"
  seLinux:
    rule: "RunAsAny"
  fsGroup:
    rule: "RunAsAny"
```

## Backup and Recovery

### Database Backup

```bash
# Create database backup
kubectl exec -n fabmanage-prod deployment/fabmanage-db -- \
  pg_dump -U postgres fabmanage > backup-$(date +%Y%m%d).sql

# Restore from backup
kubectl exec -i -n fabmanage-prod deployment/fabmanage-db -- \
  psql -U postgres fabmanage < backup-20240301.sql
```

### Application Data Backup

```bash
# Backup persistent volumes
kubectl get pv -o name | xargs -I {} kubectl get {} -o yaml > pv-backup.yaml

# Backup configuration
kubectl get configmaps,secrets -n fabmanage-prod -o yaml > config-backup.yaml
```

## Troubleshooting

### Common Issues

#### Pod Startup Issues

```bash
# Check pod status
kubectl get pods -n fabmanage-prod

# Check pod logs
kubectl logs -n fabmanage-prod deployment/fabmanage

# Describe pod for events
kubectl describe pod -n fabmanage-prod -l app=fabmanage
```

#### Service Connectivity Issues

```bash
# Check service endpoints
kubectl get endpoints -n fabmanage-prod

# Test service connectivity
kubectl run test-pod --image=busybox -it --rm -- nslookup fabmanage-service
```

#### Ingress Issues

```bash
# Check ingress status
kubectl get ingress -n fabmanage-prod

# Check ingress controller logs
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller
```

### Performance Issues

#### High Resource Usage

```bash
# Check resource usage
kubectl top pods -n fabmanage-prod
kubectl top nodes

# Scale deployment if needed
kubectl scale deployment fabmanage --replicas=3 -n fabmanage-prod
```

#### Database Performance

```bash
# Check database connections
kubectl exec -n fabmanage-prod deployment/fabmanage-db -- \
  psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Check slow queries
kubectl exec -n fabmanage-prod deployment/fabmanage-db -- \
  psql -U postgres -c "SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"
```

## Maintenance

### Regular Maintenance Tasks

#### Weekly Tasks

- Review monitoring dashboards
- Check SSL certificate expiration
- Verify backup integrity
- Update security patches

#### Monthly Tasks

- Review and update dependencies
- Analyze performance metrics
- Update documentation
- Security audit

#### Quarterly Tasks

- Disaster recovery testing
- Capacity planning review
- Security penetration testing
- Performance optimization

### Updates and Upgrades

#### Application Updates

```bash
# Update application image
kubectl set image deployment/fabmanage fabmanage=your-registry.com/fabmanage:v1.1.0 -n fabmanage-prod

# Monitor rollout
kubectl rollout status deployment/fabmanage -n fabmanage-prod

# Rollback if needed
kubectl rollout undo deployment/fabmanage -n fabmanage-prod
```

#### Kubernetes Updates

```bash
# Check current version
kubectl version

# Plan upgrade strategy
# Follow Kubernetes upgrade documentation for your cluster
```

## Support and Documentation

### Emergency Contacts

- **Technical Lead**: [Name] - [Email] - [Phone]
- **DevOps Engineer**: [Name] - [Email] - [Phone]
- **On-call Support**: [Phone] - [Email]

### Documentation Resources

- **Application Documentation**: `/docs/`
- **API Documentation**: `/api/docs`
- **Monitoring Dashboards**: Grafana
- **Log Aggregation**: ELK Stack (if configured)

### Escalation Procedures

1. **Level 1**: Application issues, minor performance problems
2. **Level 2**: Infrastructure issues, security concerns
3. **Level 3**: Critical system failures, data loss

## Conclusion

This production deployment guide provides comprehensive instructions for deploying and maintaining FabManage-Clean2 in a production environment. Regular monitoring, maintenance, and updates are essential for ensuring system reliability and performance.

For additional support or questions, please refer to the project documentation or contact the development team.
