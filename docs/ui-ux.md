## UI/UX Guidelines (Ant Design)

### Design system
- Ant Design components with custom theme tokens (`src/styles/ant-design-theme.ts`)
- Consistent spacing and typography from `styles/design-system.css` and `styles/components.css`

### Core patterns
- All modals are side Drawers with `placement="right"` and `destroyOnClose`
- Forms use `Form` + input components with validation feedback
- Provide loading states for all async operations (`LoadingSpinner` helpers)
- Tables: pagination, `rowKey`, responsive columns; virtualize long lists where needed
- Feedback: `message` and `notification` for success/error/info

### Layout
- Use Ant Design `Layout`, `Grid` (`Row`/`Col`), and `Space`
- Keep headers contextual (`components/Layout/ContextualHeader.tsx`)
- Navigation in `components/Layout/BrandedSidebar.tsx`

### Components library
- Reusable components under `components/Ui/*` (e.g., `SlideOver`, `StatusBadge`, `EntityTable`)
- Gantt: `components/Gantt/*`
- Kanban: `components/Kanban/*`
- Materials: `components/Magazyn/*`

### Theming and tokens
- Update theme tokens centrally; avoid inline styles beyond layout tweaks
- Prefer semantic classes and CSS variables from the design system

### Accessibility
- Follow WCAG AA color contrasts
- Ensure Drawer, Dropdown, and Modal focus traps and escape-to-close


