# TimelineX - Ultimate Timeline Component

TimelineX is a powerful, flexible, and high-performance timeline component built with React and TypeScript. It provides a comprehensive solution for visualizing temporal data with advanced features like virtual scrolling, multiple display modes, and real-time collaboration.

## Features

### 🚀 Core Features
- **Multiple Display Modes**: Horizontal, vertical, alternating, spiral, masonry, and Gantt views
- **High Performance**: Virtual scrolling for handling large datasets (10,000+ items)
- **Interactive**: Drag & drop, resize, zoom, pan, and selection
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Accessible**: WCAG 2.1 AA compliant with keyboard navigation
- **Customizable**: Extensive theming and styling options

### 🎨 Advanced Features
- **Real-time Collaboration**: Multi-user editing with conflict resolution
- **Rich Media Support**: Images, videos, audio, and 3D models
- **Export/Import**: Multiple formats (JSON, CSV, PDF, SVG, PNG)
- **Plugin System**: Extensible architecture for custom functionality
- **AI-Powered**: Smart suggestions and auto-layout optimization
- **Progressive Enhancement**: Works without JavaScript

### 🛠️ Developer Experience
- **TypeScript First**: Full type safety and IntelliSense support
- **Framework Agnostic**: Works with React, Vue, Angular, and Svelte
- **Hot Reload**: Fast development with instant updates
- **Comprehensive Testing**: Unit, integration, and E2E tests
- **Storybook**: Interactive component documentation

## Installation

```bash
npm install @fabmanage/timelinex
# or
yarn add @fabmanage/timelinex
# or
pnpm add @fabmanage/timelinex
```

## Quick Start

```tsx
import React from 'react';
import { Timeline } from '@fabmanage/timelinex';

const items = [
  {
    id: '1',
    title: 'Project Kickoff',
    start: new Date('2024-01-01'),
    end: new Date('2024-01-15'),
    description: 'Initial project planning',
    progress: 100,
    color: '#3B82F6',
  },
  {
    id: '2',
    title: 'Development',
    start: new Date('2024-01-16'),
    end: new Date('2024-02-15'),
    description: 'Core development phase',
    progress: 75,
    color: '#10B981',
  },
];

function App() {
  return (
    <Timeline
      items={items}
      mode="horizontal"
      width="100%"
      height="400px"
      selectable={true}
      editable={true}
      draggable={true}
      resizable={true}
      onItemClick={(item) => console.log('Item clicked:', item)}
      onItemUpdate={(item) => console.log('Item updated:', item)}
    />
  );
}

export default App;
```

## API Reference

### Timeline Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TimelineItem[]` | `[]` | Array of timeline items |
| `groups` | `TimelineGroup[]` | `[]` | Array of timeline groups |
| `mode` | `TimelineMode` | `'horizontal'` | Display mode |
| `width` | `string \| number` | `'100%'` | Timeline width |
| `height` | `string \| number` | `'400px'` | Timeline height |
| `readonly` | `boolean` | `false` | Disable editing |
| `selectable` | `boolean` | `true` | Enable item selection |
| `editable` | `boolean` | `true` | Enable item editing |
| `draggable` | `boolean` | `true` | Enable drag & drop |
| `resizable` | `boolean` | `true` | Enable item resizing |

### TimelineItem Interface

```typescript
interface TimelineItem {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  description?: string;
  progress?: number;
  color?: string;
  group?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  media?: {
    type: 'image' | 'video' | 'audio' | '3d';
    url: string;
    thumbnail?: string;
  };
  dependencies?: string[];
  isDraggable?: boolean;
  isResizable?: boolean;
  isEditable?: boolean;
  isGroup?: boolean;
  clusterItems?: TimelineItem[];
  style?: React.CSSProperties;
  className?: string;
}
```

### TimelineGroup Interface

```typescript
interface TimelineGroup {
  id: string;
  title: string;
  items?: TimelineItem[];
  nestedGroups?: string[];
  color?: string;
  collapsed?: boolean;
  style?: React.CSSProperties;
  className?: string;
}
```

## Display Modes

### Horizontal
```tsx
<Timeline mode="horizontal" items={items} />
```

### Vertical
```tsx
<Timeline mode="vertical" items={items} />
```

### Alternating
```tsx
<Timeline mode="alternating" items={items} />
```

### Spiral
```tsx
<Timeline mode="spiral" items={items} />
```

### Masonry
```tsx
<Timeline mode="masonry" items={items} />
```

### Gantt
```tsx
<Timeline mode="gantt" items={items} groups={groups} />
```

## Theming

```tsx
const theme = {
  primaryColor: '#3B82F6',
  secondaryColor: '#6B7280',
  backgroundColor: '#F9FAFB',
  itemColor: '#DBEAFE',
  groupColor: '#F3F4F6',
  textColor: '#1F2937',
  borderColor: '#E5E7EB',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
};

<Timeline theme={theme} items={items} />
```

## Event Handlers

```tsx
<Timeline
  items={items}
  onItemClick={(item, event) => console.log('Item clicked:', item)}
  onItemDoubleClick={(item, event) => console.log('Item double clicked:', item)}
  onItemHover={(item, event) => console.log('Item hovered:', item)}
  onItemDrag={(item, newPosition) => console.log('Item dragged:', item, newPosition)}
  onItemResize={(item, newDuration) => console.log('Item resized:', item, newDuration)}
  onItemCreate={(item) => console.log('Item created:', item)}
  onItemUpdate={(item) => console.log('Item updated:', item)}
  onItemDelete={(itemId) => console.log('Item deleted:', itemId)}
  onGroupToggle={(group, collapsed) => console.log('Group toggled:', group, collapsed)}
  onSelectionChange={(items, groups) => console.log('Selection changed:', items, groups)}
  onViewportChange={(viewport) => console.log('Viewport changed:', viewport)}
  onZoom={(zoom, center) => console.log('Zoomed:', zoom, center)}
  onPan={(pan) => console.log('Panned:', pan)}
  onExport={(format, data) => console.log('Exporting:', format, data)}
  onImport={(data) => console.log('Importing:', data)}
/>
```

## Performance Optimization

TimelineX automatically optimizes performance for large datasets:

- **Virtual Scrolling**: Only renders visible items
- **Item Clustering**: Groups overlapping items
- **Lazy Loading**: Loads data on demand
- **Memoization**: Caches expensive calculations
- **Web Workers**: Offloads heavy computations
- **Canvas Rendering**: High-performance drawing

## Accessibility

TimelineX is fully accessible with:

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels
- **Focus Management**: Clear focus indicators
- **High Contrast**: WCAG 2.1 AA compliant
- **Reduced Motion**: Respects user preferences

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- 📖 [Documentation](https://timelinex.fabmanage.com/docs)
- 🐛 [Issue Tracker](https://github.com/fabmanage/timelinex/issues)
- 💬 [Discord Community](https://discord.gg/fabmanage)
- 📧 [Email Support](mailto:support@fabmanage.com)
