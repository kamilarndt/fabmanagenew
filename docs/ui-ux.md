# UI/UX Guidelines

This document outlines the user interface and user experience guidelines for the FabManage-Clean application. It covers design system usage, component patterns, accessibility, and best practices for creating consistent and user-friendly interfaces.

## 🎨 Design System

### Modern Design System Architecture

- **Atomic Design**: Components organized by complexity (atoms, molecules, organisms, templates)
- **Design Tokens**: Centralized design values in `src/new-ui/tokens/`
- **Figma Integration**: Automatic token synchronization from Figma
- **Theme Support**: Light and dark theme variants
- **Tailwind CSS**: Utility-first styling with design token integration

### Design Token Usage

```typescript
// ✅ Good - Use design tokens
import { designTokens } from '@/new-ui/tokens/design-tokens'

const primaryColor = designTokens.colors.primary
const spacing = designTokens.spacing.md

// ✅ Good - Use Tailwind classes with design tokens
<div className="tw-bg-primary tw-p-md tw-rounded-lg">
  Content
</div>

// ❌ Bad - Hardcoded values
<div style={{ backgroundColor: '#1677ff', padding: '16px' }}>
  Content
</div>
```

## 🧩 Component Patterns

### Modal & Drawer Patterns

- **Side Drawers**: All modals use side drawers with `placement="right"`
- **Destroy on Close**: Always use `destroyOnClose` for performance
- **Focus Management**: Proper focus trapping and escape key handling
- **Backdrop**: Consistent backdrop styling and behavior

```typescript
// ✅ Good - Side drawer pattern
<Drawer
  title="Edit Project"
  placement="right"
  open={isOpen}
  onClose={onClose}
  destroyOnClose
  width={600}
>
  <ProjectForm onSubmit={handleSubmit} />
</Drawer>
```

### Form Patterns

- **Validation Feedback**: Real-time validation with clear error messages
- **Loading States**: Show loading indicators during form submission
- **Success Feedback**: Clear confirmation of successful operations
- **Accessibility**: Proper labels, error associations, and keyboard navigation

```typescript
// ✅ Good - Form with validation
<Form
  form={form}
  onFinish={handleSubmit}
  layout="vertical"
  validateMessages={validationMessages}
>
  <Form.Item
    name="name"
    label="Project Name"
    rules={[{ required: true, message: "Please enter project name" }]}
  >
    <Input placeholder="Enter project name" />
  </Form.Item>

  <Form.Item>
    <Button type="primary" htmlType="submit" loading={isSubmitting}>
      Save Project
    </Button>
  </Form.Item>
</Form>
```

### Table Patterns

- **Pagination**: Consistent pagination with configurable page sizes
- **Row Keys**: Always provide unique `rowKey` for performance
- **Responsive Columns**: Hide less important columns on smaller screens
- **Virtualization**: Use for large datasets (1000+ rows)
- **Sorting & Filtering**: Built-in sorting and filtering capabilities

```typescript
// ✅ Good - Table with pagination and responsive columns
<Table
  dataSource={projects}
  columns={columns}
  rowKey="id"
  pagination={{
    current: currentPage,
    pageSize: pageSize,
    total: totalCount,
    showSizeChanger: true,
    showQuickJumper: true,
  }}
  scroll={{ x: 800 }}
  loading={isLoading}
/>
```

## 🎯 Layout Patterns

### Page Layout Structure

- **App Shell**: Consistent header, sidebar, and main content area
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Grid System**: Use Ant Design Grid (`Row`/`Col`) for responsive layouts
- **Spacing**: Consistent spacing using design tokens

```typescript
// ✅ Good - Page layout structure
<Layout className="tw-min-h-screen">
  <Header className="tw-bg-white tw-shadow-sm">
    <AppHeader />
  </Header>

  <Layout>
    <Sider width={240} className="tw-bg-gray-50">
      <AppSidebar />
    </Sider>

    <Content className="tw-p-6">
      <PageHeader title="Projects" />
      <div className="tw-mt-6">{children}</div>
    </Content>
  </Layout>
</Layout>
```

### Navigation Patterns

- **Sidebar Navigation**: Primary navigation in collapsible sidebar
- **Breadcrumbs**: Show current location and navigation path
- **Contextual Actions**: Show relevant actions based on current page
- **User Menu**: User profile and account actions

## 🎨 Visual Design

### Color System

- **Primary Colors**: Brand colors for primary actions and highlights
- **Semantic Colors**: Success, warning, error, and info colors
- **Neutral Colors**: Grays for text, borders, and backgrounds
- **Accessibility**: All color combinations meet WCAG AA contrast requirements

### Typography

- **Font Hierarchy**: Clear hierarchy with consistent font sizes and weights
- **Readability**: Sufficient line height and letter spacing
- **Responsive Typography**: Scale appropriately across devices
- **Font Loading**: Optimized font loading with fallbacks

### Spacing & Layout

- **8px Grid System**: Consistent spacing based on 8px increments
- **Component Spacing**: Consistent margins and padding
- **Content Width**: Maximum content width for readability
- **White Space**: Appropriate use of white space for visual breathing room

## ♿ Accessibility Guidelines

### WCAG 2.1 AA Compliance

- **Color Contrast**: Minimum 4.5:1 contrast ratio for normal text
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators and logical tab order

### Interactive Elements

- **Button States**: Clear hover, active, and disabled states
- **Form Controls**: Proper labels and error associations
- **Navigation**: Logical navigation order and skip links
- **Feedback**: Clear feedback for user actions

```typescript
// ✅ Good - Accessible button
<Button
  type="primary"
  onClick={handleClick}
  disabled={isDisabled}
  aria-label="Save project changes"
  className="tw-focus:tw-ring-2 tw-focus:tw-ring-blue-500"
>
  Save Changes
</Button>
```

## 📱 Responsive Design

### Breakpoint System

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Large Desktop**: 1440px+

### Responsive Patterns

- **Mobile-First**: Design for mobile first, then enhance for larger screens
- **Progressive Enhancement**: Add features as screen size increases
- **Touch-Friendly**: Appropriate touch targets (minimum 44px)
- **Content Priority**: Show most important content first on smaller screens

## 🔄 Loading & Error States

### Loading States

- **Skeleton Screens**: Show content structure while loading
- **Progress Indicators**: Show progress for long-running operations
- **Button Loading**: Show loading state on action buttons
- **Page Loading**: Full-page loading for initial page loads

```typescript
// ✅ Good - Loading states
{
  isLoading ? (
    <Skeleton active paragraph={{ rows: 4 }} />
  ) : (
    <ProjectList projects={projects} />
  );
}

<Button loading={isSubmitting} onClick={handleSubmit}>
  {isSubmitting ? "Saving..." : "Save"}
</Button>;
```

### Error States

- **Error Boundaries**: Catch and display component errors gracefully
- **Form Validation**: Real-time validation with clear error messages
- **Network Errors**: Handle network failures with retry options
- **Empty States**: Provide helpful empty state messages

## 🎭 Animation & Transitions

### Animation Principles

- **Purposeful**: Animations should serve a functional purpose
- **Performance**: Use CSS transforms and opacity for smooth animations
- **Duration**: Keep animations short (200-300ms) for UI feedback
- **Easing**: Use appropriate easing functions for natural motion

### Common Animations

- **Page Transitions**: Smooth transitions between pages
- **Modal Animations**: Slide-in animations for drawers and modals
- **Hover Effects**: Subtle hover effects for interactive elements
- **Loading Animations**: Engaging loading animations

## 📊 Data Visualization

### Chart & Graph Guidelines

- **Color Coding**: Use consistent colors for data categories
- **Accessibility**: Provide alternative text and data tables
- **Responsive**: Charts should scale appropriately
- **Interactivity**: Provide meaningful interactions and tooltips

### Table Data Display

- **Sortable Columns**: Allow sorting by relevant columns
- **Filterable Data**: Provide filtering options for large datasets
- **Export Options**: Allow data export in common formats
- **Pagination**: Break large datasets into manageable pages

## 🧪 Testing & Quality Assurance

### Visual Testing

- **Storybook**: Component documentation and visual testing
- **Screenshot Testing**: Automated visual regression testing
- **Cross-Browser Testing**: Test across different browsers and devices
- **Accessibility Testing**: Automated and manual accessibility testing

### User Testing

- **Usability Testing**: Regular usability testing with real users
- **A/B Testing**: Test different UI approaches
- **Performance Testing**: Monitor and optimize performance metrics
- **Accessibility Audits**: Regular accessibility audits

---

**Last Updated**: January 2025  
**UI/UX Guidelines Version**: 2.0.0  
**Next Review**: March 2025
