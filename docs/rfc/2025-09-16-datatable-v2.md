# RFC: DataTable v2 (TanStack)

## 1. Problem

AntD Table constrains flexibility and bundle size. We need a typed, virtualized, accessible table aligned with shadcn/ui.

## 2. Context / Constraints

- Must integrate with @tanstack/react-table
- A11y (roles, headers), virtualization, column pinning, server-side modes
- Keep bridge `LegacyTable` until cut-over

## 3. Options

- A) TanStack + custom UI (preferred)
- B) Keep AntD Table via adapter only
- C) Headless UI alternative

## 4. Decision

Proceed with TanStack + custom components under `src/new-ui/organisms/DataTable`.

## 5. ADR links

- ADR 0003 Strangler Roadmap (docs/adr/0003-strangler-roadmap.md)

## 6. Rollout

- Ship MVP (sort/paginate), then filters, pinning, virtualization
- Maintain `LegacyTable` adapter until route cut-over

## 7. Metrics

- Render time (P95), bundle size diff, memory footprint, a11y score
