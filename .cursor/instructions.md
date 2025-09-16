# FabManage AI Instructions

## Development Guidelines

### Code Quality

- Follow TypeScript strict mode - no `any` or `unknown`
- Use interfaces for component props, types for data
- Named exports only, avoid default exports
- React.memo for performance optimization
- RORO pattern for functions

### UI Development

- **New Components**: Use `src/new-ui/` with Shadcn/UI + Radix
- **Legacy Components**: Keep in `src/components/` (Ant Design)
- **Migration**: Use Strangler Fig pattern via `src/bridge-ui/`
- **Design Tokens**: Always use `src/new-ui/tokens/` from Figma
- **Styling**: Tailwind CSS with design tokens, avoid inline styles

### Component Patterns

- All modals are right-side Drawers
- Unified tile edit experience across pages
- Loading states for all async operations
- Error boundaries for robust error handling
- Accessibility compliance (WCAG 2.1 AA)

### State Management

- Zustand with slice pattern for client state
- TanStack Query for server state
- Persist critical UX state only
- Use immer for complex state updates

### Testing Strategy

- Unit tests with Vitest + Testing Library
- E2E tests with Playwright
- Component stories with Storybook
- Test critical user journeys

### Performance

- Code splitting per route
- Lazy loading for heavy components
- Virtualization for long lists
- Image optimization (WebP)
- Bundle analysis with rollup-plugin-visualizer

### Security

- RLS policies in Supabase
- Input validation with Zod
- HTML sanitization with DOMPurify
- Environment variables in .env only
