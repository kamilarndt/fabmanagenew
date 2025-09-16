# Release & Rollback Runbook

Operational procedures for UI migration releases and emergency rollbacks.

## Feature Flags Configuration

### Environment Variables
```bash
# Development
VITE_FF_NEW_UI_MATERIALS=true
VITE_FF_NEW_UI_PROJECTS=false
VITE_FF_NEW_UI_GLOBAL=false

# Staging
VITE_FF_NEW_UI_MATERIALS=true
VITE_FF_NEW_UI_PROJECTS=true
VITE_FF_NEW_UI_GLOBAL=false

# Production
VITE_FF_NEW_UI_MATERIALS=false  # Gradual rollout
VITE_FF_NEW_UI_PROJECTS=false
VITE_FF_NEW_UI_GLOBAL=false
```

### Runtime Feature Flags
```typescript
// Dynamic feature flags (if using external service)
const featureFlags = useFeatureFlags();

// Route-level flags
const isMaterialsV2Enabled = featureFlags.newUI?.materials ?? false;
const isProjectsV2Enabled = featureFlags.newUI?.projects ?? false;
```

## A/B Traffic Routing

### Route Configuration
```typescript
// App.tsx routing logic
function App() {
  const { user } = useAuth();
  const featureFlags = useFeatureFlags();
  
  // Determine route based on flags and user cohort
  const shouldUseV2 = (route: string) => {
    if (route === 'materials') {
      return featureFlags.newUI?.materials || isUserInCohort(user, 'materials-v2');
    }
    return false;
  };

  return (
    <Routes>
      {/* Legacy routes */}
      <Route 
        path="/materials" 
        element={shouldUseV2('materials') ? <MaterialsPageV2 /> : <MaterialsPage />} 
      />
      
      {/* Explicit v2 routes for testing */}
      <Route path="/materials/v2" element={<MaterialsPageV2 />} />
    </Routes>
  );
}
```

### Gradual Rollout Strategy
1. **Phase 1**: Internal testing (dev team only)
2. **Phase 2**: Beta users (5% traffic)
3. **Phase 3**: Early adopters (20% traffic)
4. **Phase 4**: Full rollout (100% traffic)

## Release Procedures

### Pre-Release Checklist
- [ ] All DoD criteria met
- [ ] Staging deployment successful
- [ ] Performance benchmarks validated
- [ ] Feature flags configured
- [ ] Monitoring dashboards ready
- [ ] Rollback plan reviewed

### Release Steps

#### 1. Deploy Application
```bash
# 1. Build with feature flags disabled
npm run build

# 2. Deploy to production
npm run deploy:prod

# 3. Verify deployment health
curl -f https://app.fabmanage.com/health
```

#### 2. Enable Feature Flags (Gradual)
```bash
# Start with 5% traffic
VITE_FF_NEW_UI_MATERIALS_PERCENT=5

# Monitor for 2 hours, then increase
VITE_FF_NEW_UI_MATERIALS_PERCENT=20

# Continue monitoring and increasing
VITE_FF_NEW_UI_MATERIALS_PERCENT=50
VITE_FF_NEW_UI_MATERIALS_PERCENT=100
```

#### 3. Monitor Key Metrics
- Error rate (target: <1% increase)
- Response time (target: <10% degradation)
- User satisfaction (target: >85%)
- A11y compliance (target: 100% WCAG AA)

### Post-Release Validation
- [ ] Smoke tests pass
- [ ] Error logs reviewed
- [ ] Performance metrics stable
- [ ] User feedback positive
- [ ] A11y tools report clean

## Rollback Procedures

### Automatic Rollback Triggers
```typescript
// Monitoring thresholds
const ROLLBACK_THRESHOLDS = {
  errorRate: 0.05,        // 5% error rate
  responseTime: 1.2,      // 20% slower than baseline
  userSatisfaction: 0.8   // Below 80% satisfaction
};

// Automatic rollback logic
if (metrics.errorRate > ROLLBACK_THRESHOLDS.errorRate) {
  await executeRollback('ERROR_RATE_EXCEEDED');
}
```

### Manual Rollback Types

#### 1. Feature Flag Rollback (Immediate)
```bash
# Disable feature flag immediately
VITE_FF_NEW_UI_MATERIALS=false

# Or reduce traffic percentage
VITE_FF_NEW_UI_MATERIALS_PERCENT=0
```

#### 2. Route-Level Rollback
```typescript
// Redirect specific routes to legacy
const ROLLBACK_ROUTES = ['materials', 'projects'];

function shouldRollback(route: string): boolean {
  return ROLLBACK_ROUTES.includes(route);
}
```

#### 3. Component-Level Rollback
```typescript
// Use bridge adapters to revert to antd
import { LegacyDrawer } from '@/bridge-ui/antd-wrappers/LegacyDrawer';

// Replace Sheet with LegacyDrawer
const DrawerComponent = rollbackFlags.drawer ? LegacyDrawer : Sheet;
```

#### 4. Full Application Rollback
```bash
# Deploy previous version
git checkout v1.2.3
npm run build
npm run deploy:prod

# Verify rollback successful
curl -f https://app.fabmanage.com/health
```

### Rollback Decision Matrix

| Issue Type | Severity | Rollback Method | Timeline |
|------------|----------|-----------------|----------|
| High error rate | Critical | Feature flag disable | 2 minutes |
| Performance degradation | High | Traffic percentage reduction | 5 minutes |
| A11y compliance issue | Medium | Component-level rollback | 15 minutes |
| User experience issue | Medium | Route-level rollback | 30 minutes |
| Minor bugs | Low | Hotfix deployment | 2 hours |

## Emergency Procedures

### Incident Response Team
- **Incident Commander**: Technical Lead
- **Engineering**: Frontend Developer
- **Monitoring**: DevOps Engineer
- **Communication**: Product Manager

### Emergency Contacts
```
Technical Lead: +48 XXX XXX XXX
DevOps Engineer: +48 XXX XXX XXX
Product Manager: +48 XXX XXX XXX
```

### Emergency Rollback (< 5 minutes)
```bash
# 1. Immediate flag disable
export VITE_FF_NEW_UI_GLOBAL=false

# 2. Force cache invalidation
curl -X POST https://api.fabmanage.com/cache/invalidate

# 3. Verify rollback
curl -f https://app.fabmanage.com/health

# 4. Notify team
slack-notify "#engineering" "Emergency rollback executed for UI migration"
```

### Communication Templates

#### User Notification
```
We're experiencing technical difficulties with our new interface. 
We've temporarily reverted to the previous version while we resolve the issue. 
Your data is safe and all functionality is available.
```

#### Team Notification
```
INCIDENT: UI Migration Rollback Executed
Reason: [ERROR_RATE_EXCEEDED|PERFORMANCE_DEGRADATION|A11Y_VIOLATION]
Actions Taken: [Feature flag disabled|Traffic reduced|Component rollback]
Next Steps: [Investigation|Hotfix|Re-evaluation]
ETA: [2h|4h|24h]
```

## Post-Rollback Analysis

### Investigation Checklist
- [ ] Root cause identified
- [ ] Error logs analyzed
- [ ] Performance data reviewed
- [ ] User feedback collected
- [ ] Fix strategy developed

### Recovery Planning
1. **Immediate**: Hotfix for critical issues
2. **Short-term**: Component-level fixes
3. **Long-term**: Architecture improvements

### Documentation Updates
- [ ] Incident report created
- [ ] Runbook updated with lessons learned
- [ ] Team training materials revised
- [ ] Monitoring thresholds adjusted

This runbook ensures rapid response to issues while maintaining system stability during the UI migration.
