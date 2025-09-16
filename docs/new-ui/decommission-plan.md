# Legacy UI Decommission Plan

Step-by-step plan for safely removing Ant Design dependencies and bridge layer after successful migration.

## Prerequisites for Decommission

### Success Criteria (All Must Be Met)
- [ ] 100% of routes migrated to new UI
- [ ] No critical bugs reported for 30 days
- [ ] Performance targets met across all pages
- [ ] A11y compliance verified (WCAG AA)
- [ ] User satisfaction > 90%
- [ ] Error rate < 0.5%

### Validation Checklist
- [ ] All production traffic on new UI (no legacy routes)
- [ ] All bridge adapters unused (verified by dependency analysis)
- [ ] No antd imports outside bridge layer
- [ ] Documentation updated
- [ ] Team trained on new components

## Phase 1: Dependency Analysis (Week 1)

### 1.1 Identify Legacy Dependencies
```bash
# Analyze antd usage across codebase
npx dependency-cruiser --validate .dependency-cruiser.js src/

# Find all antd imports
grep -r "from 'antd'" src/ --include="*.ts" --include="*.tsx"
grep -r "import.*antd" src/ --include="*.ts" --include="*.tsx"

# Analyze bundle dependencies
npm run build -- --analyze
npx webpack-bundle-analyzer dist/stats.json
```

### 1.2 Create Removal Plan
```typescript
// scripts/analyze-legacy-usage.ts
import { execSync } from 'child_process';
import fs from 'fs';

interface LegacyUsage {
  file: string;
  component: string;
  line: number;
  type: 'direct' | 'bridge' | 'type';
}

function analyzeLegacyUsage(): LegacyUsage[] {
  const antdImports = execSync(
    "grep -rn \"from 'antd'\" src/ --include='*.ts' --include='*.tsx'",
    { encoding: 'utf-8' }
  );
  
  // Parse and categorize usage
  return parseUsage(antdImports);
}
```

### 1.3 Risk Assessment
```
High Risk Dependencies:
- antd core components (Button, Table, Form)
- @ant-design/icons (if heavily used)
- CSS theme variables

Medium Risk:
- Bridge adapters (safe to remove after validation)
- Type definitions

Low Risk:
- Development dependencies
- Storybook addons
```

## Phase 2: Bridge Layer Removal (Week 2)

### 2.1 Remove Bridge Adapters
```bash
# Verify no usage of bridge adapters
grep -r "from.*bridge-ui" src/ --include="*.ts" --include="*.tsx"

# If clean, remove bridge directory
rm -rf src/bridge-ui/

# Update ESLint config (remove bridge-specific rules)
# Remove from tsconfig.json paths
```

### 2.2 Remove Import Restrictions
```javascript
// eslint.config.js - Remove antd restrictions since no longer needed
export default tseslint.config([
  // Remove this block after decommission:
  // {
  //   files: ["src/new-ui/**/*.{ts,tsx}"],
  //   rules: {
  //     "no-restricted-imports": [...]
  //   }
  // }
]);
```

### 2.3 Clean Up Type Definitions
```typescript
// Remove antd type imports
// Before:
import type { ButtonProps } from 'antd';

// After: (if needed)
import type { ButtonHTMLAttributes } from 'react';
```

## Phase 3: Dependency Removal (Week 3)

### 3.1 Remove Ant Design Packages
```bash
# Remove main antd packages
npm uninstall antd @ant-design/icons @ant-design/colors

# Remove related packages if unused elsewhere
npm uninstall @ant-design/pro-components
npm uninstall @ant-design/pro-layout

# Remove development dependencies
npm uninstall @storybook/addon-docs-antd # if exists
```

### 3.2 Clean Package.json
```json
{
  "dependencies": {
    // Remove these after uninstall:
    // "antd": "^5.27.3",
    // "@ant-design/icons": "^6.0.2",
    // "@ant-design/colors": "^7.0.0"
  },
  "devDependencies": {
    // Remove antd-related dev deps
  }
}
```

### 3.3 Bundle Analysis Validation
```bash
# Verify antd removal from bundle
npm run build
npx webpack-bundle-analyzer dist/stats.json

# Check for any remaining antd references
grep -r "antd" dist/ || echo "✅ No antd references found"
```

## Phase 4: Code Cleanup (Week 4)

### 4.1 Remove Legacy Styles
```bash
# Remove antd CSS imports
grep -r "@import.*antd" src/ --include="*.css" --include="*.scss"

# Remove theme customizations
rm -f src/styles/antd-theme.less # if exists
rm -f src/styles/antd-overrides.css # if exists
```

### 4.2 Update Configuration Files

#### Vite Configuration
```typescript
// vite.config.ts - Remove antd-specific optimizations
export default defineConfig({
  optimizeDeps: {
    include: [
      // Remove: 'antd', '@ant-design/icons'
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu'
    ]
  }
});
```

#### Tailwind Configuration
```javascript
// tailwind.config.js - Remove antd compatibility classes
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  corePlugins: {
    // Remove antd compatibility if added
    // preflight: false  // Remove this line
  }
};
```

### 4.3 Update Tests
```bash
# Find tests importing antd
grep -r "from 'antd'" tests/ src/ --include="*.test.ts" --include="*.test.tsx"

# Update test utilities
# Remove antd-specific test helpers
```

## Phase 5: Documentation Updates (Week 5)

### 5.1 Update Component Documentation
```markdown
# Remove from README.md, component docs:
- Ant Design references
- Bridge layer documentation
- Legacy component examples

# Update with:
- New UI component examples
- Radix UI + Tailwind patterns
- Migration completion notes
```

### 5.2 Update ADRs
```markdown
# Create new ADR
## ADR 0004: Ant Design Decommission Completed

Status: Accepted
Date: 2025-XX-XX

### Context
Successfully migrated all UI components to shadcn/ui + Radix.
Ant Design and bridge layer no longer needed.

### Decision
Remove all Ant Design dependencies and bridge layer.

### Consequences
- Reduced bundle size by 850KB
- Simplified architecture
- No legacy UI code maintenance
```

### 5.3 Update Team Documentation
- Remove antd references from onboarding docs
- Update component style guides
- Revise development workflows
- Update Storybook documentation

## Phase 6: Monitoring & Validation (Week 6)

### 6.1 Post-Removal Monitoring
```typescript
// monitoring/post-decommission-checks.ts
const MONITORING_CHECKS = {
  bundleSize: {
    before: 2100, // KB
    after: 1250,  // KB
    target: '<= 1300' // KB
  },
  
  buildTime: {
    before: 45, // seconds
    after: 32,  // seconds
    target: '<= 35' // seconds
  },
  
  errors: {
    target: 'zero antd-related errors'
  }
};
```

### 6.2 Performance Validation
```bash
# Run full performance test suite
npm run test:performance

# Verify Core Web Vitals improvements
npm run test:cwv

# Check for any console errors
npm run test:e2e -- --reporter=json > test-results.json
```

### 6.3 User Acceptance Testing
- [ ] Internal QA sign-off
- [ ] User feedback collection
- [ ] Performance metrics validation
- [ ] A11y compliance verification

## Rollback Plan (Emergency Only)

### If Critical Issues Found After Decommission

#### Emergency Rollback Procedure
```bash
# 1. Reinstall antd (specific version)
npm install antd@5.27.3 @ant-design/icons@6.0.2

# 2. Restore bridge layer from git
git checkout HEAD~1 -- src/bridge-ui/

# 3. Revert component imports temporarily
# 4. Deploy hotfix

# 5. Investigate and fix properly
```

#### Rollback Decision Criteria
- Critical functionality broken
- Performance regression > 50%
- User satisfaction < 70%
- Accessibility violations introduced

## Success Metrics

### Bundle Size Reduction
```
Before: 2.1 MB total (850 KB antd)
After:  1.25 MB total (0 KB antd)
Reduction: 40.5% overall bundle size
```

### Build Performance
```
Before: 45s build time
After:  32s build time  
Improvement: 28.9% faster builds
```

### Maintenance Burden
```
- 0 legacy components to maintain
- Simplified dependency tree
- Single UI framework (Radix + Tailwind)
- Reduced security surface area
```

## Post-Decommission Benefits

### Developer Experience
- Faster build times
- Simpler component model
- Better TypeScript integration
- Improved tree-shaking

### Performance
- Smaller bundle size
- Better Core Web Vitals
- Reduced memory usage
- Faster initial page loads

### Maintenance
- Single source of truth for UI
- No dual-framework complexity
- Simplified testing strategies
- Cleaner architecture

This decommission plan ensures safe removal of legacy dependencies while maintaining system stability and performance.
