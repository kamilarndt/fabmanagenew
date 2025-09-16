# New UI Migration - Tasks

Status legend: [ ] pending, [~] in progress, [x] done

## Templates

- [ ] AddForm: universal add form (title, fields[], schema, onSubmit)
- [ ] EditForm: universal edit form (initialValues, onSubmit, onDelete)
- [ ] ListPageLayout: FilterPanel + DataTable + Pagination
- [ ] DetailPageLayout: Sidebar (tabs) + Card area
- [ ] SidebarCard: title, actions, footer, children

## Organisms

- [ ] Sidebar: renders cards by route segment ("sidebar tab = card")
- [ ] Header: breadcrumbs + actions + search hook
- [ ] FilterPanel: RHF + Zod schema-driven fields
- [ ] DataTable (TanStack): MVP (columns, sort, paginate), empty/loading/error
- [ ] ProjectSummaryCard: metrics + quick actions
- [ ] ClientSummaryCard: projects list + contacts
- [ ] TileCard: status badge + actions + metrics

## Pages (v2)

- [ ] ProjectDetailsPage: DetailPageLayout + cards (summary, materials, tiles, activity)
- [ ] ClientDetailsPage: DetailPageLayout + cards (summary, projects, contacts, activity)
- [ ] TileCardViewPage: CardGridLayout + FilterPanel + DataTable

## Routing & Flags

- [ ] React Router v7: add /projects/:id/v2, /clients/:id/v2, /tiles/v2
- [ ] Feature flags: VITE_FF_NEW_UI_PROJECTS, VITE_FF_NEW_UI_CLIENTS, VITE_FF_NEW_UI_TILES

## Design Tokens Integration

- [ ] Replace hardcoded colors with semantic tokens
- [ ] Replace spacing/radius with tokens
- [ ] Import CSS variables globally and confirm Tailwind mapping

## Accessibility & Tests

- [ ] A11y: focus trap (Sheet), roles, keyboard nav; axe baseline
- [ ] RTL unit tests: templates, DataTable, FilterPanel
- [ ] E2E: navigate v2 pages, open cards, basic flows

## Docs

- [ ] Update component stories to showcase token usage
- [ ] Update README and tokens-implementation guide with examples

## Cut-over & Cleanup

- [ ] Add entries to Strangler Decision Log per page
- [ ] Define DoR/DoD for cut-over of each v2 route
- [ ] Plan removal of redundant legacy components after cut-over
