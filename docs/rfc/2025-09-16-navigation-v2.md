# RFC: Navigation v2 (Sidebar + Header)

## 1. Problem

Legacy navigation mixes concerns and blocks code splitting.

## 2. Context / Constraints

- Must support route-based lazy loading and keyboard navigation
- Sidebar cards map 1:1 with tabs

## 3. Options

- A) New Sidebar/Header organisms in new-ui (preferred)
- B) Keep legacy layout with tweaks

## 4. Decision

Create `src/new-ui/organisms/Sidebar`, `Header`; adopt "sidebar tab = card" principle.

## 5. ADR links

- ADR 0003 Strangler Roadmap

## 6. Rollout

- Introduce in v2 routes; switch default post cut-over

## 7. Metrics

- TTI per route, navigation a11y checks, user satisfaction
