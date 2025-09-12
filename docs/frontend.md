## Frontend Guidelines

### Framework and language
- React 18 + TypeScript (strict). No `any`/`unknown`. Prefer `interface` for public shapes.

### Components
- Functional components using the `function` keyword
- Named exports only; one component per file
- Shallow JSX; avoid inline lambdas in render
- Expensive components guarded by `React.memo`
- Handlers passed as props wrapped in `useCallback`
- Heavy computations in `useMemo`

### State management
- Zustand slice pattern in `src/stores/*`
- Keep domain boundaries clear (projects, tiles, materials, logistics, calendar, subcontractors)
- Persist only critical UX state; do not persist server caches

### Data fetching
- TanStack Query for server data caching
- Service layer in `src/services/*`; never call Supabase directly from components
- `src/lib/httpClient.ts` handles strategy (REST vs Supabase), auth tokens, retries, error mapping

### Validation and typing
- Validate user inputs and request payloads with Zod
- Rich types in `src/types/*`; model real domain entities
- Avoid type assertions; prefer type guards

### Error handling
- `ApiError` as base error type; bubble user-meaningful messages
- `components/ErrorBoundary` for global and sectional boundaries with fallback UI
- Use Ant Design `message`/`notification` for feedback on operations

### Realtime
- Subscriptions via `src/lib/realtime.ts`; ensure proper cleanup in `useEffect`

### Logging and analytics
- Use `src/lib/logger.ts` for structured logs (debug/info/warn/error)
- Avoid `console.*` in production code paths

### Routing
- React Router v7; pages under `src/pages/*`
- Code-split heavy routes with `lazy` + `Suspense`

### Accessibility (a11y)
- Use semantic HTML
- Keyboard navigation and focus management in drawers and modals
- ARIA attributes via helpers in `src/lib/a11y.ts`


