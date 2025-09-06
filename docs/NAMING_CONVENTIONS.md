## Naming Conventions (inspired by Ant Design)

Reference: Ant Design documentation for component consistency and enterprise UI standards [link](https://ant.design/docs/react/introduce)

### 1) Language policy
- Code identifiers: English (files, components, variables, enums, routes, API).
- UI copy visible to users: Polish via i18n/messages (not hardcoded identifiers).

### 2) Files and directories
- React components: PascalCase file and export, e.g. `ProjectList.tsx` exports `ProjectList`.
- Hooks: `useX.ts` (camelCase export), e.g. `useProjects.ts`.
- Stores (Zustand): `xStore.ts` exporting `useXStore` (camelCase), e.g. `projectsStore.ts` → `useProjectsStore`.
- Types: `x.types.ts` with PascalCase types, e.g. `project.types.ts` exports `Project`.
- Utilities/libs: `kebab-case.ts`, exports camelCase functions.
- Styles (if used): co-located, `ComponentName.module.css`.

### 3) Components and props
- Component names: PascalCase (ProjectCard), single responsibility.
- Props: camelCase, events `onX`, handlers `handleX`.
- Booleans: `isX`, `hasX`, `canX` prefixes.
- Local UI lib wrappers (optional): prefix if needed (e.g. `FmButton`) when creating app-wide wrappers.

### 4) Routing (React Router)
- Paths: kebab-case English nouns, plural where list: `/projects`, `/projects/:id`, `/warehouse`, `/demands`.
- Layouts: PascalCase components (`AppLayout`, `ClientsLayout`).
- Navigation labels via i18n (Polish), route segment remains English.

### 5) API (REST)
- Base path: `/api`.
- Resources: plural kebab-case: `/api/projects`, `/api/materials`, `/api/demands`, `/api/tiles/:tileId/demands`.
- IDs: path params `:id`, `:tileId`.
- DTOs: explicit, PascalCase TypeScript interfaces in `src/types` with JSON fields in camelCase.

### 6) State (stores, selectors)
- Store var: `useXStore`.
- Selectors: imperative verb phrases: `getProjectsByClient`, `getModuleStats`.
- Enums/status: English constants in code (e.g. `"queued"`), UI labels translated to Polish.

### 7) Events and async
- Async fns: verb + object: `fetchProjects`, `createDemand`, `syncFromBackend`.
- Error channels: `logger.error` with English codes, Polish user messages via toast/i18n.

### 8) Realtime / channels
- Table/channel names: kebab-case resource names (`projects`, `tiles`, `materials`).
- Centralize through `lib/realtime.ts` (no manual channel wiring in stores).

### 9) Example migrations (current → target)
- Pages:
  - `Klienci.tsx` → `Clients.tsx` (route `/clients`, label "Klienci")
  - `Klient.tsx` → `Client.tsx` (route `/clients/:id`, label "Klient")
  - `MagazynNew.tsx` → `Warehouse.tsx` (route `/warehouse`, label "Magazyn")
  - `Produkcja.tsx` → `Production.tsx` (route `/production`, label "Produkcja")
- Stores:
  - `clientDataStore.ts` → `clientsStore.ts` (`useClientsStore`)
  - `projectsStore.ts` export name already `useProjectsStore`
- Enums/statuses (code):
  - `"W KOLEJCE"` → `"queued"`
  - `"W TRAKCIE CIĘCIA"` → `"cutting"`
  - `"WYCIĘTE"` → `"cut"`
  - UI shows Polish via i18n mapping.

### 10) Linting guardrails
- Enforce with ESLint `@typescript-eslint/naming-convention`:
  - Types/Interfaces: PascalCase
  - Variables/props: camelCase
  - Booleans: `is|has|can` prefixes
  - Functions: camelCase

### 11) Rollout strategy
1. Freeze new names per this doc; new code must comply.
2. Introduce i18n mapping for statuses/labels; convert code constants to English.
3. Migrate routes to English segments with temporary redirects from Polish.
4. Rename pages/stores/types incrementally (per-module PRs).
5. Add ESLint naming rules to prevent regressions.


