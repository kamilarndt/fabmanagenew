## Testing Strategy

### Levels
- Unit tests: utilities and store actions
- Component tests: React Testing Library for interactive components
- Integration tests: API/service layer and store-query interactions
- E2E tests: Playwright for critical user journeys

### Tools
- Vitest (unit/integration)
- @testing-library/react, @testing-library/user-event
- Playwright (E2E)

### Commands
- Lint: `npm run lint`
- Type check: `npm run type-check`
- Unit/integration: `npm run test`
- E2E: `npm run test:e2e` (project provides `@playwright/test`)

### Scope
- Stores: verify state transitions, optimistic updates, and error paths
- Services: mock network; verify Zod validation and error mapping
- Components: accessibility, keyboard navigation, drawer flows
- E2E: project creation, tile edit drawer, materials view filters, CNC queue transitions

### CI baseline
- Run lint + type-check + unit tests on PRs
- E2E smoke on protected branches


