# Migration Guide: Legacy to Modern UI

This guide provides step-by-step instructions for migrating from the legacy UI components to the modern design system in FabManage-Clean.

## 🎯 Overview

The migration from legacy UI to the modern design system involves:

- **Atomic Design Structure**: Moving from ad-hoc components to organized atomic design
- **Design Token Integration**: Using centralized design tokens instead of hardcoded values
- **TypeScript Enhancement**: Improved type safety and component APIs
- **Accessibility Improvements**: Better WCAG 2.1 AA compliance
- **Performance Optimization**: Better performance through code splitting and optimization

## 📋 Migration Checklist

### Phase 1: Preparation

- [ ] Audit existing components and identify migration candidates
- [ ] Set up design token synchronization from Figma
- [ ] Create migration branch and backup current state
- [ ] Review component dependencies and usage patterns

### Phase 2: Core Components Migration

- [ ] Migrate atomic components (Button, Input, Icon, etc.)
- [ ] Update component imports and usage
- [ ] Test component functionality and accessibility
- [ ] Update Storybook stories for new components

### Phase 3: Complex Components Migration

- [ ] Migrate molecular components (Card, FormField, etc.)
- [ ] Migrate organism components (DataTable, Navigation, etc.)
- [ ] Update page templates and layouts
- [ ] Test integration and user workflows

### Phase 4: Cleanup and Optimization

- [ ] Remove legacy components
- [ ] Update documentation and examples
- [ ] Performance testing and optimization
- [ ] User acceptance testing

## 🔄 Component Migration Patterns

### Button Migration

#### Legacy Button

```typescript
// ❌ Legacy - Ant Design Button with custom styling
import { Button as AntButton } from "antd";

<AntButton
  type="primary"
  size="large"
  style={{
    backgroundColor: "#1677ff",
    borderRadius: "6px",
    fontWeight: 500,
  }}
  onClick={handleClick}
>
  Click me
</AntButton>;
```

#### Modern Button

```typescript
// ✅ Modern - Design system Button with tokens
import { Button } from "@/new-ui/atoms/Button/Button";

<Button variant="primary" size="lg" onClick={handleClick}>
  Click me
</Button>;
```

### Input Migration

#### Legacy Input

```typescript
// ❌ Legacy - Ant Design Input with custom styling
import { Input as AntInput } from "antd";

<AntInput
  placeholder="Enter text..."
  style={{
    borderRadius: "6px",
    borderColor: "#d9d9d9",
    fontSize: "14px",
  }}
  onChange={handleChange}
/>;
```

#### Modern Input

```typescript
// ✅ Modern - Design system Input with tokens
import { Input } from "@/new-ui/atoms/Input/Input";

<Input placeholder="Enter text..." onChange={handleChange} />;
```

### Card Migration

#### Legacy Card

```typescript
// ❌ Legacy - Ant Design Card with custom styling
import { Card as AntCard } from "antd";

<AntCard
  title="Card Title"
  style={{
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    border: "1px solid #f0f0f0",
  }}
>
  Card content
</AntCard>;
```

#### Modern Card

```typescript
// ✅ Modern - Design system Card with tokens
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/new-ui/molecules/Card/Card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>Card content</CardContent>
</Card>;
```

## 🎨 Design Token Migration

### Color Migration

#### Legacy Colors

```typescript
// ❌ Legacy - Hardcoded colors
const styles = {
  primary: "#1677ff",
  success: "#52c41a",
  warning: "#faad14",
  error: "#ff4d4f",
};
```

#### Modern Design Tokens

```typescript
// ✅ Modern - Design tokens
import { designTokens } from "@/new-ui/tokens/design-tokens";

const colors = {
  primary: designTokens.colors.primary,
  success: designTokens.semantic.success,
  warning: designTokens.semantic.warning,
  error: designTokens.semantic.destructive,
};
```

### Spacing Migration

#### Legacy Spacing

```typescript
// ❌ Legacy - Hardcoded spacing
const styles = {
  padding: "16px",
  margin: "8px",
  gap: "12px",
};
```

#### Modern Spacing

```typescript
// ✅ Modern - Design token spacing
import { designTokens } from "@/new-ui/tokens/design-tokens";

const styles = {
  padding: designTokens.spacing.md, // 16px
  margin: designTokens.spacing.sm, // 8px
  gap: designTokens.spacing.md, // 12px
};
```

## 🧩 Component Structure Migration

### File Structure Changes

#### Legacy Structure

```
src/components/
├── Button.tsx
├── Input.tsx
├── Card.tsx
└── index.ts
```

#### Modern Structure

```
src/new-ui/
├── atoms/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   └── Input/
│       ├── Input.tsx
│       ├── Input.test.tsx
│       ├── Input.stories.tsx
│       └── index.ts
├── molecules/
│   └── Card/
│       ├── Card.tsx
│       ├── Card.test.tsx
│       ├── Card.stories.tsx
│       └── index.ts
└── tokens/
    ├── design-tokens.ts
    └── tailwind-tokens.ts
```

## 🔧 Import Updates

### Global Import Updates

#### Legacy Imports

```typescript
// ❌ Legacy - Direct Ant Design imports
import { Button, Input, Card, Table } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
```

#### Modern Imports

```typescript
// ✅ Modern - Design system imports
import { Button } from "@/new-ui/atoms/Button/Button";
import { Input } from "@/new-ui/atoms/Input/Input";
import { Card } from "@/new-ui/molecules/Card/Card";
import { DataTable } from "@/new-ui/organisms/DataTable/DataTable";
import { Icon } from "@/new-ui/atoms/Icon/Icon";
```

### Component-Specific Updates

#### Button Updates

```typescript
// ❌ Legacy
<Button type="primary" size="large" icon={<PlusOutlined />}>
  Add Item
</Button>

// ✅ Modern
<Button variant="primary" size="lg" leftIcon="plus">
  Add Item
</Button>
```

#### Input Updates

```typescript
// ❌ Legacy
<Input
  prefix={<SearchOutlined />}
  placeholder="Search..."
  size="large"
/>

// ✅ Modern
<Input
  icon="search"
  placeholder="Search..."
  size="lg"
/>
```

## 🧪 Testing Migration

### Test File Updates

#### Legacy Tests

```typescript
// ❌ Legacy - Basic testing
import { render, screen } from "@testing-library/react";
import { Button } from "antd";

test("renders button", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole("button")).toBeInTheDocument();
});
```

#### Modern Tests

```typescript
// ✅ Modern - Comprehensive testing
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/new-ui/atoms/Button/Button";

describe("Button", () => {
  test("renders with correct variant", () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("tw-bg-primary");
  });

  test("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("is accessible", () => {
    render(<Button aria-label="Save changes">Save</Button>);
    expect(screen.getByLabelText("Save changes")).toBeInTheDocument();
  });
});
```

## 📚 Storybook Migration

### Story Updates

#### Legacy Stories

```typescript
// ❌ Legacy - Basic stories
import { Button } from "antd";

export default {
  title: "Components/Button",
  component: Button,
};

export const Primary = () => <Button type="primary">Primary</Button>;
export const Secondary = () => <Button>Secondary</Button>;
```

#### Modern Stories

```typescript
// ✅ Modern - Comprehensive stories
import { Button } from "@/new-ui/atoms/Button/Button";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "destructive", "outline", "ghost"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="tw-space-x-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};
```

## 🚀 Performance Optimization

### Code Splitting

```typescript
// ✅ Modern - Lazy loading for heavy components
import { lazy, Suspense } from "react";

const DataTable = lazy(() => import("@/new-ui/organisms/DataTable/DataTable"));
const Chart = lazy(() => import("@/new-ui/organisms/Chart/Chart"));

function Dashboard() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable />
      </Suspense>
      <Suspense fallback={<div>Loading chart...</div>}>
        <Chart />
      </Suspense>
    </div>
  );
}
```

### Memoization

```typescript
// ✅ Modern - Memoized components
import { memo, useMemo, useCallback } from "react";

export const ExpensiveComponent = memo(function ExpensiveComponent({
  data,
  onUpdate,
}: ExpensiveComponentProps) {
  const processedData = useMemo(() => {
    return data.map((item) => processItem(item));
  }, [data]);

  const handleUpdate = useCallback(
    (id: string) => {
      onUpdate(id);
    },
    [onUpdate]
  );

  return (
    <div>
      {processedData.map((item) => (
        <Item key={item.id} data={item} onUpdate={handleUpdate} />
      ))}
    </div>
  );
});
```

## 🔍 Migration Tools

### Automated Migration Scripts

```bash
# Run migration scripts
npm run migrate:components
npm run migrate:tokens
npm run migrate:imports

# Validate migration
npm run validate:migration
npm run test:migration
```

### Manual Migration Checklist

- [ ] Update component imports
- [ ] Replace hardcoded styles with design tokens
- [ ] Update component props to match new API
- [ ] Add proper TypeScript types
- [ ] Update tests and stories
- [ ] Test accessibility compliance
- [ ] Verify responsive behavior
- [ ] Check performance impact

## 🐛 Common Migration Issues

### Issue 1: Styling Conflicts

**Problem**: Legacy styles conflicting with new design tokens
**Solution**: Remove legacy CSS and use design tokens consistently

### Issue 2: Prop API Changes

**Problem**: Component props have changed in new version
**Solution**: Update prop names and types according to new API

### Issue 3: Import Path Changes

**Problem**: Import paths have changed for new components
**Solution**: Update all import statements to use new paths

### Issue 4: TypeScript Errors

**Problem**: TypeScript errors due to changed component interfaces
**Solution**: Update type definitions and component usage

## 📊 Migration Progress Tracking

### Component Migration Status

- [ ] Atoms (Button, Input, Icon, etc.) - ✅ Complete
- [ ] Molecules (Card, FormField, SearchBox, etc.) - ✅ Complete
- [ ] Organisms (DataTable, Navigation, Forms, etc.) - 🔄 In Progress
- [ ] Templates (Page layouts) - 🔄 In Progress

### Page Migration Status

- [ ] Dashboard - ✅ Complete
- [ ] Projects - 🔄 In Progress
- [ ] Materials - 🔄 In Progress
- [ ] Settings - ⏳ Pending

## 🎯 Post-Migration Checklist

### Quality Assurance

- [ ] All components render correctly
- [ ] No console errors or warnings
- [ ] Accessibility tests pass
- [ ] Performance metrics are acceptable
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness tested

### Documentation Updates

- [ ] Update component documentation
- [ ] Update Storybook stories
- [ ] Update migration guide
- [ ] Update API documentation

### Team Training

- [ ] Train team on new component usage
- [ ] Update development guidelines
- [ ] Create component usage examples
- [ ] Conduct code review sessions

---

**Last Updated**: January 2025  
**Migration Guide Version**: 2.0.0  
**Next Review**: March 2025
