# Strangler Decision Log

Track per-route and per-organism cut-over status.

| Area           | Scope                      | Cut-over Date | Status      | Notes                        |
| -------------- | -------------------------- | ------------- | ----------- | ---------------------------- |
| Materials      | /materials → /materials/v2 | —             | Planned     | Awaiting DataTable v2        |
| Projects       | /projects → /projects/v2   | —             | Planned     | Depends on Sidebar/Header    |
| Drawer → Sheet | organism                   | —             | In progress | Bridge `LegacyDrawer` active |

Process

- Propose via RFC; record ADR if architectural change.
- Define DoR/DoD; validate KPIs (bundle, TTI, a11y) before switching traffic.
- Rollback via feature flag if regression detected.
