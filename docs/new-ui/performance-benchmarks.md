# Performance Benchmarks & KPIs

Metrics, targets, and monitoring for UI migration performance validation.

## Core Web Vitals Targets

### Before Migration (Baseline - Ant Design)
```
First Contentful Paint (FCP): 1.8s
Largest Contentful Paint (LCP): 2.4s  
Cumulative Layout Shift (CLS): 0.12
First Input Delay (FID): 120ms
Time to Interactive (TTI): 3.2s
```

### Target After Migration (shadcn/ui + Tailwind)
```
First Contentful Paint (FCP): ≤ 1.2s (-33%)
Largest Contentful Paint (LCP): ≤ 1.8s (-25%)
Cumulative Layout Shift (CLS): ≤ 0.08 (-33%)
First Input Delay (FID): ≤ 80ms (-33%)
Time to Interactive (TTI): ≤ 2.4s (-25%)
```

## Bundle Size Analysis

### Current Bundle (Ant Design)
```
Total Bundle Size: 2.1 MB
├── antd: 850 KB (40.5%)
├── @ant-design/icons: 320 KB (15.2%)
├── Application Code: 650 KB (31.0%)
├── React + Dependencies: 280 KB (13.3%)
└── Other Libraries: 150 KB (7.1%)

Gzipped: 680 KB
```

### Target Bundle (New UI)
```
Total Bundle Size: ≤ 1.5 MB (-28.6%)
├── Radix UI: 180 KB (12.0%)
├── Tailwind CSS: 45 KB (3.0%)
├── Application Code: 850 KB (56.7%) [+30% features]
├── React + Dependencies: 280 KB (18.7%)
├── Lucide Icons: 95 KB (6.3%)
└── Other Libraries: 150 KB (10.0%)

Gzipped Target: ≤ 420 KB (-38.2%)
```

## Route-Specific Metrics

### Materials Page (`/materials`)
**Current Performance:**
```
Initial Load: 2.8s
Table Render: 450ms (100 rows)
Search Response: 180ms
Filter Application: 220ms
Memory Usage: 45 MB
```

**Target Performance:**
```
Initial Load: ≤ 2.0s (-28.6%)
Table Render: ≤ 300ms (100 rows) (-33.3%)
Search Response: ≤ 120ms (-33.3%)
Filter Application: ≤ 150ms (-31.8%)
Memory Usage: ≤ 35 MB (-22.2%)
```

### Projects Page (`/projects`)
**Current Performance:**
```
Initial Load: 3.1s
Card Grid Render: 380ms (50 cards)
Kanban Interaction: 160ms
Sheet Open: 240ms
Memory Usage: 52 MB
```

**Target Performance:**
```
Initial Load: ≤ 2.2s (-29.0%)
Card Grid Render: ≤ 250ms (50 cards) (-34.2%)
Kanban Interaction: ≤ 100ms (-37.5%)
Sheet Open: ≤ 150ms (-37.5%)
Memory Usage: ≤ 38 MB (-26.9%)
```

## Component Performance Benchmarks

### DataTable (TanStack vs Ant Design)
```
Metric                    | Ant Table | TanStack | Target Improvement
--------------------------|-----------|----------|-------------------
Render 1000 rows         | 850ms     | ≤ 400ms  | -52.9%
Sort operation           | 120ms     | ≤ 80ms   | -33.3%
Filter application       | 200ms     | ≤ 120ms  | -40.0%
Column resize            | 180ms     | ≤ 100ms  | -44.4%
Memory (1000 rows)       | 12 MB     | ≤ 8 MB   | -33.3%
```

### Sheet vs Drawer Performance
```
Metric                    | Ant Drawer| Sheet    | Target Improvement
--------------------------|-----------|----------|-------------------
Open animation           | 240ms     | ≤ 150ms  | -37.5%
Close animation          | 220ms     | ≤ 140ms  | -36.4%
Focus trap setup         | 80ms      | ≤ 50ms   | -37.5%
Content render           | 160ms     | ≤ 100ms  | -37.5%
Memory overhead          | 3.2 MB    | ≤ 2.0 MB | -37.5%
```

### Form Performance (react-hook-form vs Ant Form)
```
Metric                    | Ant Form  | RHF      | Target Improvement
--------------------------|-----------|----------|-------------------
Form initialization      | 120ms     | ≤ 60ms   | -50.0%
Field validation         | 45ms      | ≤ 25ms   | -44.4%
Submit processing        | 80ms      | ≤ 50ms   | -37.5%
Re-render count (10 fields)| 15      | ≤ 8      | -46.7%
Memory usage             | 4.5 MB    | ≤ 2.8 MB | -37.8%
```

## Monitoring Setup

### Performance Monitoring Stack
```yaml
Tools:
  - Web Vitals: web-vitals library
  - Bundle Analysis: webpack-bundle-analyzer
  - Runtime Monitoring: Performance Observer API
  - Error Tracking: Sentry
  - A11y Monitoring: axe-core

Dashboards:
  - Core Web Vitals (Grafana)
  - Bundle Size Trends (custom)
  - Component Performance (custom)
  - Memory Usage Patterns (Chrome DevTools)
```

### Automated Performance Tests
```typescript
// tests/performance/core-web-vitals.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Core Web Vitals', () => {
  test('Materials page meets CWV targets', async ({ page }) => {
    // Start performance measurement
    await page.goto('/materials/v2');
    
    // Measure FCP
    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) resolve(fcpEntry.startTime);
        }).observe({ entryTypes: ['paint'] });
      });
    });
    
    expect(fcp).toBeLessThan(1200); // 1.2s target
    
    // Measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcpEntry = entries[entries.length - 1];
          resolve(lcpEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    
    expect(lcp).toBeLessThan(1800); // 1.8s target
  });
});
```

### Memory Leak Detection
```typescript
// tests/performance/memory-leaks.spec.ts
test('DataTable does not leak memory', async ({ page }) => {
  await page.goto('/materials/v2');
  
  // Get initial memory usage
  const initialMemory = await page.evaluate(() => {
    return (performance as any).memory?.usedJSHeapSize || 0;
  });
  
  // Perform operations that might cause leaks
  for (let i = 0; i < 10; i++) {
    await page.click('[data-testid="sort-button"]');
    await page.waitForTimeout(100);
  }
  
  // Force garbage collection and measure
  await page.evaluate(() => {
    if ((window as any).gc) (window as any).gc();
  });
  
  const finalMemory = await page.evaluate(() => {
    return (performance as any).memory?.usedJSHeapSize || 0;
  });
  
  const memoryIncrease = finalMemory - initialMemory;
  expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024); // 5MB threshold
});
```

## Performance Budget Enforcement

### Webpack Budget Configuration
```javascript
// webpack.config.js
module.exports = {
  performance: {
    maxAssetSize: 500000, // 500KB
    maxEntrypointSize: 800000, // 800KB
    hints: 'error'
  },
  
  // Bundle analysis
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false
    })
  ]
};
```

### CI/CD Performance Gates
```yaml
# .github/workflows/performance.yml
- name: Performance Budget Check
  run: |
    npm run build
    npm run bundle:analyze
    
    # Check bundle size
    BUNDLE_SIZE=$(cat dist/stats.json | jq '.assets[0].size')
    if [ $BUNDLE_SIZE -gt 800000 ]; then
      echo "Bundle size exceeds budget: ${BUNDLE_SIZE} > 800000"
      exit 1
    fi
    
    # Run performance tests
    npm run test:performance
```

## Regression Detection

### Performance Regression Alerts
```typescript
// monitoring/performance-alerts.ts
const PERFORMANCE_THRESHOLDS = {
  FCP_REGRESSION: 1.3, // Alert if FCP > 1.3s
  LCP_REGRESSION: 2.0, // Alert if LCP > 2.0s
  BUNDLE_SIZE_INCREASE: 0.1, // Alert if bundle grows >10%
  MEMORY_LEAK: 10 * 1024 * 1024 // Alert if memory increases >10MB
};

function checkPerformanceRegression(metrics: PerformanceMetrics) {
  const alerts = [];
  
  if (metrics.fcp > PERFORMANCE_THRESHOLDS.FCP_REGRESSION) {
    alerts.push({
      type: 'FCP_REGRESSION',
      message: `FCP increased to ${metrics.fcp}ms`,
      severity: 'high'
    });
  }
  
  // ... other checks
  
  return alerts;
}
```

### Automated Rollback Triggers
```typescript
// If performance degrades beyond thresholds
if (performanceScore < ROLLBACK_THRESHOLD) {
  await executeEmergencyRollback('PERFORMANCE_DEGRADATION');
  notifyTeam(`Performance regression detected: ${performanceScore}`);
}
```

## Reporting & Analytics

### Performance Dashboard Metrics
- Real User Monitoring (RUM) data
- Synthetic testing results
- Bundle size trends over time
- Component-level performance breakdown
- Memory usage patterns
- Error correlation with performance

### Weekly Performance Reports
```
Performance Summary (Week of 2025-09-16)
==========================================

Core Web Vitals:
✅ FCP: 1.1s (Target: ≤1.2s)
✅ LCP: 1.6s (Target: ≤1.8s)
⚠️  CLS: 0.09 (Target: ≤0.08)
✅ FID: 75ms (Target: ≤80ms)

Bundle Size:
✅ Total: 1.42 MB (Target: ≤1.5 MB)
✅ Gzipped: 398 KB (Target: ≤420 KB)

Route Performance:
✅ /materials/v2: 1.8s load time
✅ /projects/v2: 2.0s load time

Action Items:
- Investigate CLS regression in DataTable
- Optimize image loading for LCP improvement
```

This comprehensive benchmarking ensures the UI migration delivers measurable performance improvements while maintaining quality standards.
