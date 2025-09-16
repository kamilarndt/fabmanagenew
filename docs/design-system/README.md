# FabManage Design System

A comprehensive design system built with React, TypeScript, and Tailwind CSS, following atomic design principles and integrated with Figma design tokens.

## 🎯 Overview

The FabManage Design System provides a complete set of reusable components, design tokens, and guidelines for building consistent, accessible, and beautiful user interfaces. It follows the atomic design methodology and integrates seamlessly with Figma for design-to-code workflows.

## 📚 Table of Contents

- [Getting Started](#getting-started)
- [Design Tokens](#design-tokens)
- [Components](#components)
- [Layouts](#layouts)
- [Themes](#themes)
- [Accessibility](#accessibility)
- [Figma Integration](#figma-integration)
- [Best Practices](#best-practices)
- [Contributing](#contributing)

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Basic Usage

```tsx
import { Button } from "@/new-ui/atoms/Button/Button";
import { Card } from "@/new-ui/molecules/Card/Card";
import { DataTable } from "@/new-ui/organisms/DataTable/DataTable";

function App() {
  return (
    <div className="tw-p-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to FabManage</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Get Started</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 🎨 Design Tokens

Design tokens are the foundation of our design system, providing consistent values for colors, spacing, typography, and more.

### Colors

```tsx
import { designTokens } from "@/new-ui/tokens/design-tokens";

// Primary colors
const primaryColor = designTokens.colors.foreground.primary;
const backgroundColor = designTokens.colors.background.primary;

// Semantic colors
const successColor = designTokens.semantic.success;
const warningColor = designTokens.semantic.warning;
const destructiveColor = designTokens.semantic.destructive;
```

### Spacing

```tsx
// Spacing scale
const spacing = {
  none: "0px",
  xxs: "2px",
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  xxl: "32px",
  "3xl": "40px",
  "4xl": "40px",
};
```

### Typography

```tsx
// Font sizes and weights
const typography = {
  sizes: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};
```

## 🧩 Components

### Atomic Design Structure

```
src/new-ui/
├── atoms/           # Basic building blocks
│   ├── Button/
│   ├── Input/
│   ├── Label/
│   └── Icon/
├── molecules/       # Simple combinations
│   ├── Card/
│   ├── FormField/
│   ├── SearchBox/
│   └── Alert/
├── organisms/       # Complex components
│   ├── DataTable/
│   ├── Navigation/
│   ├── Form/
│   └── Header/
└── templates/       # Page layouts
    ├── DashboardPage/
    ├── ProjectPage/
    └── LoginPage/
```

### Atoms

#### Button

```tsx
import { Button } from "@/new-ui/atoms/Button/Button";

// Basic usage
<Button>Click me</Button>

// Variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Skip</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// With icons
<Button leftIcon="plus">Add Item</Button>
<Button rightIcon="arrow-right">Continue</Button>

// Loading state
<Button loading>Processing...</Button>

// Button groups
<ButtonGroup>
  <Button variant="outline">Previous</Button>
  <Button>Next</Button>
</ButtonGroup>
```

#### Input

```tsx
import { Input } from "@/new-ui/atoms/Input/Input";

// Basic input
<Input placeholder="Enter text..." />

// With icon
<Input icon="search" placeholder="Search..." />

// Different types
<Input type="email" placeholder="Email address" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="Amount" />

// States
<Input error placeholder="Invalid input" />
<Input disabled placeholder="Disabled input" />
```

### Molecules

#### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/new-ui/molecules/Card/Card";

// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Card with stats
<CardStats
  stats={[
    { label: "Total Users", value: "1,234", change: { value: 12, type: "increase" } },
    { label: "Active Sessions", value: "567", change: { value: 5, type: "decrease" } }
  ]}
/>

// Card with image
<CardWithImage
  image="/path/to/image.jpg"
  imageAlt="Description"
  overlay
>
  <CardTitle>Image Card</CardTitle>
  <CardContent>Content over image</CardContent>
</CardWithImage>
```

#### Alert

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/new-ui/molecules/Alert/Alert";

// Basic alert
<Alert>
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>This is an informational message.</AlertDescription>
</Alert>

// Variants
<Alert variant="success">
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>Operation completed successfully.</AlertDescription>
</Alert>

<Alert variant="warning">
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Please review before proceeding.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong. Please try again.</AlertDescription>
</Alert>

// Dismissible alert
<Alert dismissible onDismiss={() => console.log('Dismissed')}>
  <AlertTitle>Dismissible Alert</AlertTitle>
  <AlertDescription>This alert can be dismissed.</AlertDescription>
</Alert>
```

### Organisms

#### DataTable

```tsx
import { DataTable } from "@/new-ui/organisms/DataTable/DataTable";

const columns = [
  {
    key: "name",
    title: "Name",
    sortable: true,
    render: (value, record) => (
      <div className="tw-flex tw-items-center tw-gap-2">
        <Avatar src={record.avatar} size="sm" />
        <span>{value}</span>
      </div>
    ),
  },
  {
    key: "email",
    title: "Email",
    sortable: true,
  },
  {
    key: "status",
    title: "Status",
    render: (value) => (
      <Badge variant={value === "active" ? "success" : "secondary"}>
        {value}
      </Badge>
    ),
  },
];

const data = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "inactive" },
];

<DataTable
  columns={columns}
  data={data}
  pagination={{
    current: 1,
    pageSize: 10,
    total: 100,
  }}
  rowSelection={{
    type: "checkbox",
    onChange: (selectedKeys, selectedRows) => {
      console.log("Selected:", selectedKeys, selectedRows);
    },
  }}
  searchable
  exportable
  onExport={(format) => console.log("Export as:", format)}
/>;
```

#### Navigation

```tsx
import { Navigation } from "@/new-ui/organisms/Navigation/Navigation";

const navigationItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "home",
    href: "/dashboard",
  },
  {
    key: "projects",
    label: "Projects",
    icon: "folder",
    badge: "5",
    children: [
      { key: "active", label: "Active Projects", href: "/projects/active" },
      { key: "completed", label: "Completed", href: "/projects/completed" },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    icon: "settings",
    href: "/settings",
  },
];

<Navigation
  items={navigationItems}
  activeKey="dashboard"
  orientation="vertical"
  variant="pills"
  user={{
    name: "John Doe",
    email: "john@example.com",
    avatar: "/path/to/avatar.jpg",
    role: "Administrator",
  }}
  onItemClick={(key, item) => console.log("Clicked:", key, item)}
/>;
```

#### Form

```tsx
import { Form } from "@/new-ui/organisms/Form/Form";

const formFields = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    required: true,
    validation: {
      required: "Name is required",
      minLength: 2,
    },
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
    validation: {
      required: "Email is required",
      email: "Please enter a valid email",
    },
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: [
      { value: "admin", label: "Administrator" },
      { value: "user", label: "User" },
      { value: "guest", label: "Guest" },
    ],
  },
  {
    name: "newsletter",
    label: "Subscribe to newsletter",
    type: "checkbox",
  },
];

<Form
  fields={formFields}
  initialValues={{ newsletter: true }}
  onSubmit={(values) => console.log("Form submitted:", values)}
  validationMode="onBlur"
  showValidationSummary
/>;
```

## 🎨 Themes

### Light Theme (Default)

```tsx
// Light theme is applied by default
// Uses design tokens for consistent colors
```

### Dark Theme

```tsx
// Dark theme can be applied by adding the 'dark' class to the root element
document.documentElement.classList.add("dark");

// Or using a theme provider
import { ThemeProvider } from "@/new-ui/providers/ThemeProvider";

<ThemeProvider theme="dark">
  <App />
</ThemeProvider>;
```

### Custom Themes

```tsx
// Create custom themes by extending design tokens
const customTheme = {
  ...designTokens,
  colors: {
    ...designTokens.colors,
    primary: "#your-custom-color",
  },
};
```

## ♿ Accessibility

### WCAG 2.1 AA Compliance

All components are built with accessibility in mind:

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: Meets WCAG AA contrast requirements
- **Focus Management**: Clear focus indicators and logical tab order

### Usage Examples

```tsx
// Accessible button
<Button
  aria-label="Close dialog"
  onClick={handleClose}
>
  <Icon name="x" />
</Button>

// Accessible form field
<FormField
  label="Email Address"
  error="Please enter a valid email"
  required
>
  <Input
    type="email"
    aria-describedby="email-error"
    aria-invalid={!!error}
  />
</FormField>

// Accessible data table
<DataTable
  columns={columns}
  data={data}
  aria-label="User data table"
  role="table"
/>
```

## 🎨 Figma Integration

### Design Tokens Sync

Design tokens are automatically synced from Figma:

```bash
# Sync design tokens from Figma
npm run tokens:sync

# Process tokens for development
npm run tokens:process
```

### Component Export

Components can be exported from Figma to React:

```tsx
// Generated from Figma
import { MoleculesDesignSystem } from "./generated/MoleculesDesignSystem";

// Use in your application
<MoleculesDesignSystem />;
```

### Figma MCP Integration

```tsx
// Get component code from Figma
import { getFigmaCode } from "@/new-ui/utils/figma-mcp";

const componentCode = await getFigmaCode("node-id");
```

## 📋 Best Practices

### Component Development

1. **Use TypeScript**: Always define proper types for props and state
2. **Follow Atomic Design**: Organize components by complexity level
3. **Use Design Tokens**: Never hardcode colors, spacing, or typography
4. **Implement Variants**: Provide multiple variants for different use cases
5. **Add Loading States**: Include loading and error states for async operations

### Styling Guidelines

1. **Use Tailwind Classes**: Prefer Tailwind utilities over custom CSS
2. **Consistent Spacing**: Use the 8px grid system
3. **Responsive Design**: Build mobile-first, responsive components
4. **Dark Mode Support**: Ensure components work in both light and dark themes

### Performance

1. **React.memo**: Use for expensive components
2. **Lazy Loading**: Implement code splitting for large components
3. **Virtualization**: Use for large lists and tables
4. **Bundle Size**: Keep component bundles small and focused

### Testing

1. **Unit Tests**: Test component behavior and props
2. **Visual Tests**: Use Storybook for visual regression testing
3. **Accessibility Tests**: Ensure components meet accessibility standards
4. **Integration Tests**: Test component interactions

## 🤝 Contributing

### Development Setup

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### Adding New Components

1. **Create Component Structure**:

   ```
   src/new-ui/[level]/[ComponentName]/
   ├── [ComponentName].tsx
   ├── [ComponentName].test.tsx
   ├── [ComponentName].stories.tsx
   └── index.ts
   ```

2. **Follow Naming Conventions**:

   - Use PascalCase for component names
   - Use kebab-case for file names
   - Export from index.ts

3. **Add Documentation**:

   - Include JSDoc comments
   - Add Storybook stories
   - Update this README

4. **Test Your Component**:
   - Write unit tests
   - Test accessibility
   - Test different variants

### Design Token Updates

1. **Update Figma**: Make changes in Figma design tokens
2. **Sync Tokens**: Run `npm run tokens:sync`
3. **Update Components**: Update components to use new tokens
4. **Test Changes**: Ensure all components still work correctly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions, issues, or contributions:

- **Issues**: [GitHub Issues](https://github.com/your-org/fabmanage/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/fabmanage/discussions)
- **Documentation**: [Storybook](https://your-storybook-url.com)

---

Built with ❤️ by the FabManage team
