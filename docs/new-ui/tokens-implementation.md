# Design Tokens Implementation Guide

Complete guide for using the processed Figma design tokens in your FabManage components.

## Generated Files Structure

```
src/
├── new-ui/
│   └── tokens/
│       ├── design-tokens.ts      # Raw token values
│       ├── tailwind-tokens.ts    # Tailwind-compatible tokens
│       └── index.ts              # Main exports
└── styles/
    └── design-tokens.css         # CSS custom properties
```

## Usage Examples

### 1. TypeScript/JavaScript Components

```typescript
import { designTokens, semanticColors } from "@/new-ui/tokens";

// Direct token access
const primaryColor = designTokens.colors.foreground.primary; // "#18181bff"

// Semantic color mapping
const buttonColor = semanticColors.primary; // Primary color value

// Spacing tokens
const padding = designTokens.spacing.lg; // "16px"

// Radius tokens
const borderRadius = designTokens.radius.md; // "8px"
```

### 2. CSS Custom Properties

Import the CSS file in your main stylesheet:

```css
/* src/index.css */
@import "./styles/design-tokens.css";

.my-component {
  color: var(--color-foreground-primary);
  background-color: var(--color-background-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
}
```

### 3. Tailwind CSS Classes

The tokens are automatically integrated into Tailwind via `tailwind.config.js`:

```tsx
// Use Figma tokens as Tailwind classes
<div className="tw-bg-primary tw-text-foreground tw-p-lg tw-rounded-md">
  Content using Figma design tokens
</div>

// Chart colors
<div className="tw-bg-chart-chart-1-opacity100">
  Chart element with consistent colors
</div>
```

### 4. shadcn/ui Components

Use semantic colors for shadcn/ui compatibility:

```tsx
import { semanticColors } from "@/new-ui/tokens";

const Button = ({ variant = "primary", ...props }) => {
  const variantStyles = {
    primary: {
      backgroundColor: semanticColors.primary,
      color: semanticColors.foreground,
    },
    destructive: {
      backgroundColor: semanticColors.destructive,
      color: semanticColors.background,
    },
  };

  return <button style={variantStyles[variant]} {...props} />;
};
```

## Token Categories

### Colors

- **Foreground**: Text and icon colors (primary, secondary, destructive, success, warning, muted)
- **Background**: Surface colors (default, card, popover, input, primary, secondary, destructive, success, warning)
- **Border**: Border and outline colors
- **Chart**: Data visualization colors with opacity variants
- **Icon**: Icon-specific color tokens

### Spacing & Layout

- **Spacing**: none, xxs(2px), xs(4px), sm(8px), md(12px), lg(16px), xl(24px), xxl(32px), 3xl(40px), 4xl(40px)
- **Padding**: Similar scale but optimized for component padding
- **Radius**: none, xs(2px), sm(4px), md(8px), lg(12px), xl(16px), xxl(24px), full(400px)

## Best Practices

### 1. Use Semantic Colors

```typescript
// ✅ Good - semantic meaning
const alertColor = semanticColors.destructive;

// ❌ Avoid - specific color reference
const alertColor = designTokens.colors.foreground.destructive;
```

### 2. Component Variants

```typescript
// Use design tokens for component variants
const buttonVariants = cva("base-button-styles", {
  variants: {
    variant: {
      primary: `tw-bg-primary tw-text-primary-foreground`,
      secondary: `tw-bg-secondary tw-text-secondary-foreground`,
      destructive: `tw-bg-destructive tw-text-destructive-foreground`,
    },
    size: {
      sm: `tw-p-sm tw-text-sm`,
      md: `tw-p-md tw-text-base`,
      lg: `tw-p-lg tw-text-lg`,
    },
  },
});
```

### 3. Consistent Spacing

```tsx
// Use token-based spacing
<div className="tw-space-y-md">
  <div className="tw-p-lg tw-mb-xl">Content with consistent spacing</div>
</div>
```

## Synchronization Workflow

### 1. Export from Figma

1. Use Figma Variables export plugin
2. Export to `assets/design-tokens.tokens.json`
3. Ensure both tokens and primitives are included

### 2. Process Tokens

```bash
npm run tokens:process
```

### 3. Validate Integration

```bash
npm run build  # Check for any compilation errors
npm run lint   # Verify linting passes
```

### 4. Update Components

After token updates, check for:

- New color tokens that should replace hardcoded values
- Spacing changes that affect component layouts
- Radius updates that affect component styling

## Migration Checklist

When migrating components to use design tokens:

- [ ] Replace hardcoded colors with semantic tokens
- [ ] Replace magic number spacing with token values
- [ ] Use token-based border radius values
- [ ] Update Tailwind classes to use token-based utilities
- [ ] Test dark/light theme compatibility
- [ ] Verify accessibility contrast ratios
- [ ] Document token usage in component stories

## Troubleshooting

### Token Resolution Errors

If you see unresolved token references like `{primitives.primary.900}`:

1. Ensure the Figma export includes both tokens and primitives
2. Re-run `npm run tokens:process`
3. Check console for specific resolution warnings

### Tailwind Integration Issues

1. Verify import path in `tailwind.config.js`
2. Check that `.js` extension is used for the import
3. Restart dev server after config changes

### Type Errors

1. Regenerate tokens: `npm run tokens:process`
2. Restart TypeScript server in your IDE
3. Check import paths match generated files
