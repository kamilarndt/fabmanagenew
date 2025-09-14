## ADR 0002: Split projectsStore into core/selectors/computed

Status: Proposed
Date: 2025-09-12

### Context
The current `projectsStore` aggregates core CRUD, initialization, and a wide set of selectors in a single file. This increases file size, cognitive load, and can lead to excessive re-renders when components subscribe broadly.

### Decision
Split `projectsStore` into three modules under `src/stores/projects/`:
- core.ts: state, CRUD actions, initialization, minimal synchronous selectors
- selectors.ts: memoized selector functions operating on core state
- computed.ts: heavier derived data (stats, joins with tiles) exposed via helper hooks and selector factories

Adopt selective subscriptions in components: `useProjectsStore(s => s.projects)` and import memoized selectors when needed.

### Consequences
- Smaller, focused files improve maintainability
- Reduced re-renders via selective subscriptions
- Clear separation between state mutation and derivation

### Implementation notes
- Create `src/stores/projects/` and move code incrementally
- Preserve public API by re-exporting from `src/stores/projectsStore.ts` for compatibility
- Add unit tests for selectors to ensure correctness/performance


