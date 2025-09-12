# Constructor X 6.0 UI Kit for FabrykaManage V2

This UI Kit provides modern, consistent design components inspired by Constructor X 6.0 design patterns, specifically tailored for our FabrykaManage application.

## 🚀 Quick Start

```tsx
import { 
  ConstructorCard, 
  StatusBadge, 
  ActionButton,
  ConstructorGrid 
} from '../ui-kit';

// Use in your components
<ConstructorCard variant="elevated" size="lg">
  <StatusBadge status="W KOLEJCE" />
  <ActionButton action="add">Dodaj Kafelek</ActionButton>
</ConstructorCard>
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue shades for main actions and branding
- **Success**: Green shades for completed states
- **Warning**: Yellow/Orange shades for in-progress states
- **Error**: Red shades for errors and high priority
- **Gray**: Neutral shades for text and borders

### Typography Scale
- **xs**: 12px - Small labels, captions
- **sm**: 14px - Body text, buttons
- **base**: 16px - Default text size
- **lg**: 18px - Subheadings
- **xl**: 20px - Section headers
- **2xl**: 24px - Page titles
- **3xl**: 30px - Hero titles

### Spacing Scale
- **1**: 4px - Tight spacing
- **2**: 8px - Component spacing
- **4**: 16px - Section spacing
- **6**: 24px - Large spacing
- **8**: 32px - Page margins

## 🧩 Components

### Cards
```tsx
// Basic card
<ConstructorCard variant="default" size="md">
  Content here
</ConstructorCard>

// Project tile card with priority and status
<ProjectTileCard 
  priority="Wysoki" 
  status="W KOLEJCE"
  onClick={handleClick}
>
  Tile content
</ProjectTileCard>

// Dashboard card with title and icon
<DashboardCard 
  title="Project Overview" 
  subtitle="Current project status"
  icon={<ProjectIcon />}
>
  Dashboard content
</DashboardCard>
```

### Badges
```tsx
// Status badges
<StatusBadge status="W KOLEJCE" size="md" />
<StatusBadge status="W TRAKCIE CIĘCIA" size="md" />
<StatusBadge status="WYCIĘTE" size="md" />

// Priority badges
<PriorityBadge priority="Wysoki" size="sm" />
<PriorityBadge priority="Średni" size="sm" />
<PriorityBadge priority="Niski" size="sm" />

// Zone badges
<ZoneBadge zone="Strefa A" size="sm" />
```

### Buttons
```tsx
// Action buttons with built-in icons
<ActionButton action="add" size="md">
  Dodaj Kafelek
</ActionButton>

<ActionButton action="edit" size="sm">
  Edytuj
</ActionButton>

<ActionButton action="delete" size="sm">
  Usuń
</ActionButton>

// Icon buttons
<IconButton 
  icon={<SettingsIcon />} 
  variant="ghost" 
  size="md"
  onClick={handleSettings}
/>

// Floating action button
<FloatingActionButton 
  icon={<PlusIcon />}
  onClick={handleAdd}
/>
```

### Layout Components
```tsx
// Container with responsive max-width
<ConstructorContainer size="lg" padding="md">
  Content here
</ConstructorContainer>

// Section with title and spacing
<ConstructorSection 
  title="Project Details" 
  subtitle="Manage project information"
  spacing="lg"
>
  Section content
</ConstructorSection>

// Responsive grid
<ConstructorGrid cols={4} gap="md">
  <div>Grid item 1</div>
  <div>Grid item 2</div>
  <div>Grid item 3</div>
  <div>Grid item 4</div>
</ConstructorGrid>

// Flexbox layouts
<ConstructorFlex 
  direction="row" 
  justify="between" 
  align="center"
  gap="md"
>
  <div>Left content</div>
  <div>Right content</div>
</ConstructorFlex>

// Vertical stack
<ConstructorStack spacing="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</ConstructorStack>
```

## 🎯 Usage Patterns

### Project Tile Layout
```tsx
<ProjectTileCard 
  priority={tile.priority} 
  status={tile.status}
  onClick={() => handleEditTile(tile)}
>
  <div className="space-y-3">
    <div className="flex items-start justify-between">
      <div>
        <h4 className="font-medium text-sm">{tile.name}</h4>
        <p className="text-xs text-muted-foreground">{tile.id}</p>
      </div>
      <PriorityBadge priority={tile.priority} size="sm" />
    </div>
    
    <StatusBadge status={tile.status} size="sm" />
    
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs">
        <UserIcon className="w-3 h-3" />
        <span>{tile.assignedTo}</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <TimerIcon className="w-3 h-3" />
        <span>{tile.estimatedTime}</span>
      </div>
    </div>
  </div>
</ProjectTileCard>
```

### Dashboard Layout
```tsx
<ConstructorContainer size="xl" padding="lg">
  <ConstructorSection 
    title="Production Overview" 
    subtitle="Real-time production status"
    spacing="lg"
  >
    <ConstructorGrid cols={3} gap="lg">
      <DashboardCard 
        title="Active Projects" 
        subtitle="Currently in production"
        icon={<ProjectIcon />}
      >
        <div className="text-3xl font-bold text-blue-600">12</div>
      </DashboardCard>
      
      <DashboardCard 
        title="CNC Queue" 
        subtitle="Tiles waiting for cutting"
        icon={<CncIcon />}
      >
        <div className="text-3xl font-bold text-orange-600">8</div>
      </DashboardCard>
      
      <DashboardCard 
        title="Completed Today" 
        subtitle="Finished tiles"
        icon={<CheckIcon />}
      >
        <div className="text-3xl font-bold text-green-600">24</div>
      </DashboardCard>
    </ConstructorGrid>
  </ConstructorSection>
</ConstructorContainer>
```

## 🎨 Customization

### CSS Variables
The design system uses CSS custom properties for easy theming:

```css
:root {
  --constructor-primary-500: #3b82f6;
  --constructor-success-500: #22c55e;
  --constructor-warning-500: #f59e0b;
  --constructor-error-500: #ef4444;
}
```

### Component Variants
Most components support multiple variants:

```tsx
// Card variants
<ConstructorCard variant="default" />     // Basic card
<ConstructorCard variant="elevated" />    // With shadow
<ConstructorCard variant="outlined" />    // Bordered only
<ConstructorCard variant="ghost" />       // Transparent

// Button variants
<ConstructorButton variant="primary" />   // Blue primary
<ConstructorButton variant="secondary" /> // Gray secondary
<ConstructorButton variant="outline" />   // Bordered
<ConstructorButton variant="ghost" />     // Transparent
<ConstructorButton variant="danger" />    // Red danger
<ConstructorButton variant="success" />   // Green success
```

## 📱 Responsive Design

All components are built with responsive design in mind:

```tsx
// Grid automatically adjusts columns
<ConstructorGrid cols={4} gap="md">
  {/* 
    Mobile: 1 column
    Tablet: 2 columns  
    Desktop: 3 columns
    Large: 4 columns
  */}
</ConstructorGrid>

// Responsive utilities
<div className="constructor-responsive-hide-sm">Hidden on mobile</div>
<div className="constructor-responsive-hide-md">Hidden on tablet</div>
<div className="constructor-responsive-hide-lg">Hidden on desktop</div>
```

## 🚀 Performance Features

- **CSS-in-JS**: No runtime CSS generation
- **Tree-shaking**: Only import what you use
- **Optimized transitions**: Hardware-accelerated animations
- **Lazy loading**: Components load on demand

## 🔧 Development

### Adding New Components
1. Create component file in `src/components/ui-kit/`
2. Follow naming convention: `Constructor[ComponentName].tsx`
3. Export from `index.ts`
4. Add to this README

### Testing Components
```bash
# Run component tests
npm run test:components

# Run visual regression tests
npm run test:visual
```

### Building
```bash
# Build UI kit
npm run build:ui-kit

# Build with optimizations
npm run build:ui-kit:prod
```

## 📚 Resources

- [Constructor X 6.0 Design System](https://www.spline.one/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Follow the existing component patterns
2. Use TypeScript for all components
3. Include proper JSDoc comments
4. Add examples to this README
5. Test across different screen sizes
6. Ensure accessibility compliance

---

**Built with ❤️ for FabrykaManage V2**
