# RFC: Sheet (Drawer replacement)

## 1. Problem

Unify right-side edit experiences replacing AntD Drawer with accessible Sheet.

## 2. Context / Constraints

- Focus trap, ESC to close, aria-modal
- Feature parity with AntD Drawer patterns used in app

## 3. Options

- A) Radix Dialog-based Sheet (preferred)
- B) Keep AntD Drawer via `LegacyDrawer`

## 4. Decision

Implement `src/new-ui/organisms/Sheet/*` and use via bridge where needed.

## 5. ADR links

- ADR 0003 Strangler Roadmap

## 6. Rollout

- Replace highest-traffic drawers first; keep adapters for legacy

## 7. Metrics

- A11y checks, interaction latency, error rate
