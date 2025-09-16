# Definition of Done (DoD) - New UI Components

Checklist for component completion before merge/release.

## Component Implementation

### Code Quality
- [ ] TypeScript strict mode compliance (no `any`, proper types)
- [ ] ESLint passes with no warnings
- [ ] Follows style guide naming conventions
- [ ] Uses design tokens (no hardcoded colors/spacing)
- [ ] Implements required variants using CVA

### Accessibility (WCAG AA)
- [ ] Semantic HTML elements used
- [ ] ARIA labels and roles implemented
- [ ] Keyboard navigation functional
- [ ] Focus management (visible focus indicators)
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Screen reader compatible

### Testing
- [ ] Unit tests written (RTL + Jest)
- [ ] Accessibility tests included (jest-axe)
- [ ] Snapshot tests for variants
- [ ] Coverage ≥ 80% for component logic
- [ ] Manual testing across browsers

### Documentation
- [ ] Storybook story created
- [ ] JSDoc comments for props
- [ ] Usage examples provided
- [ ] Props table complete
- [ ] Design token usage documented

### Performance
- [ ] Memoization where appropriate
- [ ] No unnecessary re-renders
- [ ] Bundle size impact assessed
- [ ] Lazy loading for heavy components

## Route Migration (v1 → v2)

### Functional Parity
- [ ] All existing features implemented
- [ ] Data flows preserved
- [ ] Error handling equivalent
- [ ] Loading states implemented
- [ ] Navigation patterns consistent

### Performance Metrics
- [ ] Bundle size neutral or improved
- [ ] TTI (Time to Interactive) ≤ baseline
- [ ] Core Web Vitals maintained/improved
- [ ] Memory usage stable

### Quality Gates
- [ ] E2E tests passing
- [ ] Visual regression tests green
- [ ] A11y audit clean (axe + manual)
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness checked

### Migration Safety
- [ ] Feature flag implemented
- [ ] Rollback plan documented
- [ ] Bridge adapter available (if needed)
- [ ] Error monitoring configured
- [ ] Analytics/metrics tracking

## Organism Components

### Integration
- [ ] Works with existing stores (Zustand)
- [ ] TanStack Query integration
- [ ] Form validation (Zod schemas)
- [ ] Error boundaries implemented

### Business Logic
- [ ] Domain models properly typed
- [ ] Service layer integration
- [ ] Proper data validation
- [ ] Loading/error states

### Composition
- [ ] Uses atoms/molecules correctly
- [ ] Proper props drilling avoided
- [ ] Context usage minimized
- [ ] Performance optimized

## Release Checklist

### Pre-Release
- [ ] Staging deployment successful
- [ ] QA sign-off received
- [ ] Design system compliance verified
- [ ] Performance benchmarks met

### Documentation
- [ ] ADR updated (if architectural)
- [ ] RFC completed (if applicable)
- [ ] Migration guide updated
- [ ] Team training completed

### Monitoring
- [ ] Error tracking configured
- [ ] Performance monitoring enabled
- [ ] Feature flag monitoring
- [ ] User feedback collection ready

## Quality Thresholds

### Performance Targets
- First Paint: ≤ 1.5s
- TTI: ≤ 3s
- Bundle size increase: ≤ 10%
- Memory usage: ≤ baseline + 15%

### Accessibility Standards
- WCAG AA compliance: 100%
- Color contrast: ≥ 4.5:1
- Keyboard navigation: Full support
- Screen reader: Complete compatibility

### Testing Coverage
- Unit tests: ≥ 80%
- E2E critical paths: 100%
- Visual regression: Baseline established
- Cross-browser: Chrome, Firefox, Safari, Edge

## Approval Gates

### Component Level
1. Developer self-review ✓
2. Peer code review ✓
3. Design system review ✓
4. QA validation ✓

### Route Migration
1. Technical lead approval ✓
2. Product owner sign-off ✓
3. UX review completed ✓
4. Performance validated ✓

## Emergency Rollback Criteria

Immediate rollback triggers:
- Error rate > 5% increase
- Performance degradation > 20%
- A11y compliance broken
- Critical functionality lost
- User satisfaction < 80%

This DoD ensures consistent quality and reduces risk during the UI migration process.
