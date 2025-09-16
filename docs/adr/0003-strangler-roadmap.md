## ADR 0003: Strangler Roadmap for UI Migration

Status: Proposed
Date: 2025-09-16

### Context

We are migrating Ant Design UI to shadcn/ui + Radix with a bridge layer. We need a route-by-route and component-by-component plan, cut-over criteria, and rollback guarantees.

### Decision

Adopt a phased roadmap:

1. Bridge layer active; block `antd` in `src/new-ui/**`.
2. Migrate organisms: Sheet (Drawer), DataTable, Navigation.
3. Introduce v2 routes (`/materials/v2`, `/projects/v2`).
4. Cut-over per route when success criteria are met; keep feature flags for rollback.

Cut-over criteria per route

- Functional parity verified; a11y checks pass (WCAG AA).
- Bundle size improvement or neutral; no performance regressions (TTI, CWV).
- Error rate within baseline; UX sign-off.

Rollback plan

- Disable feature flag to revert to legacy.
- Route-level rollback supported; component-level rollback via adapters.

### Consequences

- Predictable incremental delivery; reduced risk.
- Temporary duplication during migration; bridge maintenance overhead.

### References

- docs/new-ui/bridge-spec.md
- docs/new-ui/implementation-roadmap.md
