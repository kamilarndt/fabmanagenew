# Testing Strategy

This document outlines the comprehensive testing strategy for the FabManage-Clean application, covering unit tests, integration tests, end-to-end tests, and visual regression testing.

## 🎯 Testing Philosophy

### Testing Pyramid

- **Unit Tests (70%)**: Fast, isolated tests for individual components and functions
- **Integration Tests (20%)**: Test component interactions and API integration
- **E2E Tests (10%)**: Full user workflow testing in real browser environment

### Quality Gates

- **Code Coverage**: Minimum 80% code coverage for all components
- **Performance**: All tests must complete within acceptable time limits
- **Accessibility**: All components must pass accessibility tests
- **Visual Regression**: No unintended visual changes allowed

## 🧪 Testing Tools & Setup

### Core Testing Framework

- **Vitest**: Fast unit testing framework
- **Testing Library**: Component testing utilities (`@testing-library/react`, `@testing-library/user-event`)
- **Playwright**: End-to-end testing
- **Storybook**: Component documentation and visual testing
- **Jest DOM**: Custom matchers for DOM testing

### Testing Levels

- **Unit Tests**: Utilities and store actions
- **Component Tests**: React Testing Library for interactive components
- **Integration Tests**: API/service layer and store-query interactions
- **E2E Tests**: Playwright for critical user journeys

## 🔬 Unit Testing

### Component Testing Patterns

- **Vitest** for component and utility testing
- **Testing Library** for component interaction testing
- **Mock external dependencies** (Supabase, API calls)
- **Test coverage target**: 80%+

### Integration Tests

- Test component interactions and data flow
- Mock API responses with MSW (Mock Service Worker)
- Test error handling and loading states

### E2E Tests

- **Playwright** for full user workflow testing
- Test critical user journeys (project creation, tile management)
- Cross-browser testing (Chrome, Firefox, Safari)

### Visual Regression Testing

- **Storybook** for component visual testing
- **Chromatic** for visual regression detection
- Screenshot comparison for UI consistency

### Accessibility Testing

- **Jest-axe** for automated accessibility testing
- Manual testing with screen readers
- WCAG 2.1 AA compliance verification

### Performance Testing

- **Lighthouse CI** for performance metrics
- Bundle size monitoring
- Component render performance testing

### Test Data Management

- Factory functions for test data generation
- Seed data for consistent test environments
- Database cleanup between tests

## 🚀 Test Execution

### Commands

- **Lint**: `npm run lint`
- **Type Check**: `npm run type-check`
- **Unit/Integration**: `npm run test`
- **E2E**: `npm run test:e2e`
- **Coverage**: `npm run test:coverage`
- **Watch Mode**: `npm run test:watch`

### Test Scope

- **Stores**: Verify state transitions, optimistic updates, and error paths
- **Services**: Mock network; verify Zod validation and error mapping
- **Components**: Accessibility, keyboard navigation, drawer flows
- **E2E**: Project creation, tile edit drawer, materials view filters, CNC queue transitions

### CI/CD Integration

- **Automated Execution**: Run lint + type-check + unit tests on PRs
- **E2E Smoke Tests**: Run on protected branches
- **Coverage Reporting**: Track coverage trends and enforce minimums
- **Quality Gates**: Prevent deployment of failing tests

## 📊 Test Metrics & Reporting

### Coverage Reports

- **Line Coverage**: Percentage of code lines executed
- **Branch Coverage**: Percentage of code branches executed
- **Function Coverage**: Percentage of functions executed
- **Statement Coverage**: Percentage of statements executed

### Quality Metrics

- **Test Execution Time**: Track test performance
- **Flaky Test Detection**: Identify unreliable tests
- **Coverage Trends**: Monitor coverage over time
- **Test Maintenance**: Track test maintenance effort

---

**Last Updated**: January 2025  
**Testing Strategy Version**: 2.0.0  
**Next Review**: March 2025
