# Style Guide + Naming Conventions

## Component Naming

### Atoms
- Prefix: `App` (e.g., `AppButton`, `AppInput`, `AppLabel`)
- Rationale: Distinguish from antd components, maintain consistency

### Molecules
- Descriptive names: `FormField`, `SearchBox`, `StatusBadge`
- No prefix needed (clear context)

### Organisms
- Business context: `DataTable`, `Sheet`, `KanbanBoard`
- Domain-specific: `ProjectCard`, `MaterialCard`

### Templates
- Layout suffix: `AppShell`, `DetailPageLayout`, `ListPageLayout`
- Form suffix: `AddForm`, `EditForm`

## CSS Classes (Tailwind)

### Utility Composition
```tsx
// Good: Composed utilities
<div className="flex items-center justify-between p-4 rounded-lg border">

// Avoid: Inline styles
<div style={{ display: 'flex', padding: '16px' }}>
```

### Component Variants (CVA)
```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3"
      }
    }
  }
);
```

## File Structure Conventions

```
src/new-ui/atoms/Button/
├── Button.tsx           # Main component
├── Button.stories.tsx   # Storybook stories
├── Button.test.tsx      # Tests
└── index.ts             # Exports
```

## Props Patterns

### Boolean Props
```tsx
// Good: Descriptive boolean names
interface Props {
  isLoading?: boolean;
  hasError?: boolean;
  showActions?: boolean;
}

// Avoid: Ambiguous flags
interface Props {
  loading?: boolean;
  error?: boolean;
  actions?: boolean;
}
```

### Event Handlers
```tsx
// Good: Consistent on[Action] pattern
interface Props {
  onSubmit?: (data: FormData) => void;
  onCancel?: () => void;
  onDelete?: (id: string) => void;
}
```

### Composition
```tsx
// Good: Support children and render props
interface Props {
  children?: React.ReactNode;
  renderHeader?: (data: T) => React.ReactNode;
  actions?: React.ReactNode;
}
```

## Accessibility Patterns

### ARIA Labels
```tsx
// Good: Descriptive labels
<button aria-label="Delete project" onClick={onDelete}>
  <TrashIcon />
</button>

// Good: Using aria-describedby
<input
  aria-describedby="email-help"
  aria-invalid={hasError}
/>
<div id="email-help">Enter your email address</div>
```

### Focus Management
```tsx
// Good: Focus restoration
const handleModalClose = () => {
  setOpen(false);
  triggerRef.current?.focus();
};
```

## Performance Guidelines

### Memoization
```tsx
// Good: Memo for expensive components
const DataTable = React.memo(({ data, columns }) => {
  const processedData = useMemo(() => 
    data.map(processRow), [data]
  );
  
  return <Table data={processedData} />;
});
```

### Lazy Loading
```tsx
// Good: Lazy load heavy components
const GanttChart = lazy(() => import('./GanttChart'));

// Usage with Suspense
<Suspense fallback={<TableSkeleton />}>
  <GanttChart data={projectData} />
</Suspense>
```

## Design Token Usage

### Preferred: Token references
```tsx
// Good: Use design tokens
className="text-foreground bg-background border-border"

// Good: Custom properties
style={{ 
  color: 'var(--color-text-primary)',
  backgroundColor: 'var(--color-background)'
}}
```

### Spacing Scale
```tsx
// Good: Consistent spacing
className="p-4 m-2 gap-3"  // Uses 8px grid

// Avoid: Arbitrary values
className="p-[13px] m-[7px]"
```

## Import Conventions

### New UI Components
```tsx
// Good: Absolute imports with alias
import { Button } from '@/new-ui/atoms/Button';
import { FormField } from '@/new-ui/molecules/FormField';

// Good: Grouped imports
import {
  Button,
  Input,
  Label
} from '@/new-ui/atoms';
```

### Legacy Bridge
```tsx
// Good: Bridge for legacy compatibility
import { LegacyDrawer } from '@/bridge-ui/antd-wrappers/LegacyDrawer';

// Forbidden: Direct antd imports in new-ui
import { Drawer } from 'antd'; // ❌ ESLint error
```

## Documentation Standards

### Component Documentation
```tsx
/**
 * AppButton - Enhanced button component with consistent theming
 * 
 * @example
 * <AppButton variant="primary" size="lg" onClick={handleClick}>
 *   Save Changes
 * </AppButton>
 */
interface AppButtonProps {
  /** Button style variant */
  variant?: 'default' | 'primary' | 'destructive';
  /** Button size */
  size?: 'sm' | 'default' | 'lg';
  /** Click handler */
  onClick?: () => void;
}
```

### Storybook Stories
```tsx
export default {
  title: 'UI/AppButton',
  component: AppButton,
  parameters: {
    docs: {
      description: {
        component: 'Enhanced button with consistent theming and a11y'
      }
    }
  }
} as Meta;
```

This style guide ensures consistency across the new UI system while maintaining performance and accessibility standards.
