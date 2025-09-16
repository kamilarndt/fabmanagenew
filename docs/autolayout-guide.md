# 🎯 Autolayout Guide for FabManage Design System

## Overview

This guide provides comprehensive autolayout standards for the FabManage design system, based on our design tokens and atomic design principles.

## 📏 Design Token Mapping

### Spacing Standards

Based on our design tokens (`src/new-ui/tokens/design-tokens.ts`):

| Token | Value | Usage                            |
| ----- | ----- | -------------------------------- |
| `xxs` | 2px   | Micro spacing, borders           |
| `xs`  | 4px   | Small gaps, tight layouts        |
| `sm`  | 8px   | Button padding, small components |
| `md`  | 12px  | Card padding, form fields        |
| `lg`  | 16px  | **Primary item spacing**         |
| `xl`  | 24px  | Section spacing, large gaps      |
| `xxl` | 32px  | Page margins, major sections     |
| `3xl` | 40px  | Hero sections, large containers  |

### Padding Standards

| Token | Value | Usage                           |
| ----- | ----- | ------------------------------- |
| `xxs` | 8px   | Small buttons, compact elements |
| `xs`  | 12px  | Form inputs, small cards        |
| `sm`  | 16px  | **Standard card padding**       |
| `md`  | 20px  | Large cards, containers         |
| `lg`  | 24px  | Page sections                   |
| `xl`  | 32px  | Major containers                |
| `xxl` | 40px  | Hero sections                   |
| `3xl` | 48px  | Large layouts                   |
| `4xl` | 64px  | Full-page containers            |

## 🔧 Autolayout Configuration Standards

### 1. Layout Modes

#### Horizontal Layout

- **Use for**: Navigation bars, button groups, form rows
- **Item Spacing**: `sm` (8px) for buttons, `lg` (16px) for general
- **Alignment**: `SPACE_BETWEEN` for navigation, `MIN` for button groups

#### Vertical Layout

- **Use for**: Cards, forms, page sections
- **Item Spacing**: `lg` (16px) for cards, `xl` (24px) for sections
- **Alignment**: `MIN` for most cases, `CENTER` for centered content

### 2. Sizing Modes

#### Horizontal Sizing

- **FILL**: Main content areas, flexible containers
- **HUG**: Buttons, labels, fixed-width elements
- **FIXED**: Sidebars, fixed-width components

#### Vertical Sizing

- **FILL**: Main content areas, flexible containers
- **HUG**: Cards, buttons, content that adapts to content
- **FIXED**: Fixed-height components, headers

### 3. Alignment Standards

#### Primary Axis (Main Direction)

- **MIN**: Left/top alignment (default)
- **CENTER**: Centered content
- **MAX**: Right/bottom alignment
- **SPACE_BETWEEN**: Distribute evenly with space between

#### Counter Axis (Perpendicular)

- **MIN**: Top/left alignment (default)
- **CENTER**: Centered alignment
- **MAX**: Bottom/right alignment
- **BASELINE**: Text baseline alignment

## 🎨 Component-Specific Standards

### Buttons

```figma
Layout Mode: HORIZONTAL
Padding: 8px 16px (sm horizontal, lg vertical)
Item Spacing: 8px (sm)
Primary Axis: CENTER
Counter Axis: CENTER
Horizontal Sizing: HUG
Vertical Sizing: FIXED (40px height)
```

### Cards

```figma
Layout Mode: VERTICAL
Padding: 16px (sm)
Item Spacing: 12px (md)
Primary Axis: MIN
Counter Axis: MIN
Horizontal Sizing: FILL
Vertical Sizing: HUG
```

### Form Fields

```figma
Layout Mode: VERTICAL
Padding: 0px
Item Spacing: 4px (xs)
Primary Axis: MIN
Counter Axis: MIN
Horizontal Sizing: FILL
Vertical Sizing: HUG
```

### Navigation Bars

```figma
Layout Mode: HORIZONTAL
Padding: 0px
Item Spacing: 16px (lg)
Primary Axis: SPACE_BETWEEN
Counter Axis: CENTER
Horizontal Sizing: FILL
Vertical Sizing: HUG
```

### Page Headers

```figma
Layout Mode: HORIZONTAL
Padding: 0px
Item Spacing: 16px (lg)
Primary Axis: SPACE_BETWEEN
Counter Axis: MIN
Horizontal Sizing: FILL
Vertical Sizing: HUG
```

### Two-Column Layouts

```figma
Main Content:
- Layout Mode: VERTICAL
- Item Spacing: 16px (lg)
- Horizontal Sizing: FILL
- Vertical Sizing: FILL

Sidebar:
- Layout Mode: VERTICAL
- Item Spacing: 16px (lg)
- Horizontal Sizing: FIXED (264px)
- Vertical Sizing: FILL
```

## 🚀 Best Practices

### 1. Consistency

- Always use design token values for spacing and padding
- Maintain consistent autolayout patterns across similar components
- Use the same sizing modes for similar element types

### 2. Responsiveness

- Use `FILL` for flexible content areas
- Use `HUG` for content that should adapt to its content
- Use `FIXED` sparingly, only for elements that need specific dimensions

### 3. Performance

- Avoid deeply nested autolayout structures
- Use appropriate sizing modes to prevent unnecessary recalculations
- Group related elements in the same autolayout container

### 4. Accessibility

- Ensure sufficient spacing for touch targets (minimum 44px)
- Maintain consistent spacing for screen readers
- Use logical tab order through autolayout structure

## 🔍 Common Patterns

### Card Grid

```figma
Container:
- Layout Mode: HORIZONTAL
- Layout Wrap: WRAP
- Item Spacing: 16px (lg)
- Counter Axis Spacing: 16px (lg)
- Primary Axis: MIN
- Counter Axis: MIN
```

### Form Layout

```figma
Container:
- Layout Mode: VERTICAL
- Item Spacing: 24px (xl)
- Primary Axis: MIN
- Counter Axis: MIN
- Horizontal Sizing: FILL
- Vertical Sizing: HUG
```

### Dashboard Layout

```figma
Stats Grid:
- Layout Mode: HORIZONTAL
- Layout Wrap: WRAP
- Item Spacing: 24px (xl)
- Counter Axis Spacing: 24px (xl)
- Primary Axis: SPACE_BETWEEN
- Counter Axis: MIN
```

## 🛠️ Implementation Checklist

When setting up autolayout for a new component:

- [ ] Choose appropriate layout mode (HORIZONTAL/VERTICAL)
- [ ] Set padding using design token values
- [ ] Configure item spacing using design token values
- [ ] Set primary and counter axis alignment
- [ ] Configure horizontal and vertical sizing modes
- [ ] Test with different content lengths
- [ ] Verify responsive behavior
- [ ] Check accessibility requirements

## 📱 Responsive Considerations

### Mobile (< 768px)

- Reduce item spacing to `sm` (8px) or `md` (12px)
- Use `WRAP` for horizontal layouts
- Increase padding for touch targets

### Tablet (768px - 1024px)

- Use standard spacing values
- Consider two-column layouts with `FIXED` sidebar

### Desktop (> 1024px)

- Use full spacing values
- Implement multi-column layouts
- Utilize `SPACE_BETWEEN` for navigation

## 🎯 Quality Assurance

### Visual Testing

- [ ] Components maintain proper spacing at all sizes
- [ ] Text doesn't overflow containers
- [ ] Buttons maintain minimum touch target size
- [ ] Cards have consistent padding and spacing

### Functional Testing

- [ ] Autolayout responds correctly to content changes
- [ ] Components resize appropriately
- [ ] Nested autolayout works correctly
- [ ] Export maintains proper spacing

This guide ensures consistent, maintainable, and accessible autolayout implementations across the entire FabManage design system.
