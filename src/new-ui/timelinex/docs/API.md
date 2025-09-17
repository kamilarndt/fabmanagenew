# TimelineX API Documentation

## Overview

TimelineX is a powerful, feature-rich timeline component library built for React. It provides advanced timeline visualization capabilities with support for large datasets, real-time collaboration, AI-powered features, and extensive customization options.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Components](#core-components)
- [Hooks](#hooks)
- [Types](#types)
- [Themes](#themes)
- [Advanced Features](#advanced-features)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Examples](#examples)

## Installation

```bash
npm install @fabmanage/timelinex
# or
yarn add @fabmanage/timelinex
```

## Quick Start

```tsx
import React from 'react';
import { Timeline } from '@fabmanage/timelinex';

const MyTimeline = () => {
  const items = [
    {
      id: '1',
      title: 'Project Kickoff',
      start: new Date('2024-01-01'),
      end: new Date('2024-01-05'),
      groupId: 'planning',
    },
    {
      id: '2',
      title: 'Development Phase',
      start: new Date('2024-01-06'),
      end: new Date('2024-01-20'),
      groupId: 'development',
    },
  ];

  const groups = [
    {
      id: 'planning',
      title: 'Planning',
      color: '#3b82f6',
    },
    {
      id: 'development',
      title: 'Development',
      color: '#10b981',
    },
  ];

  return (
    <Timeline
      items={items}
      groups={groups}
      height={400}
      width={800}
    />
  );
};
```

## Core Components

### Timeline

The main timeline component that orchestrates all functionality.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TimelineItem[]` | `[]` | Array of timeline items |
| `groups` | `TimelineGroup[]` | `[]` | Array of timeline groups |
| `height` | `number` | `400` | Height of the timeline in pixels |
| `width` | `number` | `800` | Width of the timeline in pixels |
| `mode` | `'horizontal' \| 'vertical'` | `'horizontal'` | Timeline orientation |
| `theme` | `TimelineTheme` | `defaultTheme` | Theme configuration |
| `settings` | `TimelineSettings` | `defaultSettings` | Timeline settings |
| `draggable` | `boolean` | `true` | Enable item dragging |
| `resizable` | `boolean` | `true` | Enable item resizing |
| `selectable` | `boolean` | `true` | Enable item selection |
| `onItemClick` | `(item: TimelineItem) => void` | - | Item click handler |
| `onItemDoubleClick` | `(item: TimelineItem) => void` | - | Item double-click handler |
| `onItemHover` | `(item: TimelineItem \| null) => void` | - | Item hover handler |
| `onItemUpdate` | `(item: TimelineItem) => void` | - | Item update handler |
| `onItemDelete` | `(itemId: string) => void` | - | Item delete handler |
| `onGroupToggle` | `(group: TimelineGroup, collapsed: boolean) => void` | - | Group toggle handler |
| `onZoom` | `(zoom: number) => void` | - | Zoom change handler |
| `onPan` | `(x: number, y: number) => void` | - | Pan change handler |
| `renderItem` | `(item: TimelineItem) => React.ReactNode` | - | Custom item renderer |
| `renderTooltip` | `(item: TimelineItem) => React.ReactNode` | - | Custom tooltip renderer |
| `renderControls` | `() => React.ReactNode` | - | Custom controls renderer |
| `renderOverlay` | `() => React.ReactNode` | - | Custom overlay renderer |

#### Example

```tsx
<Timeline
  items={items}
  groups={groups}
  height={600}
  width={1200}
  mode="horizontal"
  draggable={true}
  resizable={true}
  onItemClick={(item) => console.log('Clicked:', item)}
  onItemUpdate={(item) => updateItem(item)}
  renderItem={(item) => (
    <div className="custom-item">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  )}
/>
```

### TimelineItem

Individual timeline item component.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `item` | `TimelineItem` | - | Item data |
| `group` | `TimelineGroup` | - | Parent group |
| `onClick` | `(item: TimelineItem) => void` | - | Click handler |
| `onDoubleClick` | `(item: TimelineItem) => void` | - | Double-click handler |
| `onHover` | `(item: TimelineItem \| null) => void` | - | Hover handler |
| `onUpdate` | `(item: TimelineItem) => void` | - | Update handler |
| `onDelete` | `(itemId: string) => void` | - | Delete handler |
| `selected` | `boolean` | `false` | Selection state |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Item size |
| `variant` | `'default' \| 'outline' \| 'ghost'` | `'default'` | Item variant |
| `renderItem` | `(item: TimelineItem) => React.ReactNode` | - | Custom renderer |
| `renderTooltip` | `(item: TimelineItem) => React.ReactNode` | - | Custom tooltip |

### TimelineGroup

Timeline group component for organizing items.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `group` | `TimelineGroup` | - | Group data |
| `items` | `TimelineItem[]` | `[]` | Group items |
| `onToggle` | `(group: TimelineGroup, collapsed: boolean) => void` | - | Toggle handler |
| `onUpdate` | `(group: TimelineGroup) => void` | - | Update handler |
| `onDelete` | `(groupId: string) => void` | - | Delete handler |
| `selected` | `boolean` | `false` | Selection state |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Group size |
| `variant` | `'default' \| 'outline' \| 'ghost'` | `'default'` | Group variant |
| `renderGroup` | `(group: TimelineGroup) => React.ReactNode` | - | Custom renderer |
| `renderHeader` | `(group: TimelineGroup) => React.ReactNode` | - | Custom header |

## Hooks

### useTimeline

Main hook for timeline state management.

```tsx
import { useTimeline } from '@fabmanage/timelinex';

const MyComponent = () => {
  const { state, actions, utils } = useTimeline({
    items: initialItems,
    groups: initialGroups,
  });

  return (
    <div>
      <button onClick={() => actions.addItem(newItem)}>
        Add Item
      </button>
      <Timeline items={state.items} groups={state.groups} />
    </div>
  );
};
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `items` | `TimelineItem[]` | Initial items |
| `groups` | `TimelineGroup[]` | Initial groups |
| `viewport` | `Viewport` | Initial viewport |
| `mode` | `'horizontal' \| 'vertical'` | Timeline mode |
| `theme` | `TimelineTheme` | Theme configuration |
| `settings` | `TimelineSettings` | Timeline settings |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `state` | `TimelineState` | Current timeline state |
| `actions` | `TimelineActions` | State manipulation actions |
| `utils` | `TimelineUtils` | Utility functions |

### useTimelineAI

Hook for AI-powered features.

```tsx
import { useTimelineAI } from '@fabmanage/timelinex';

const MyComponent = () => {
  const {
    suggestions,
    isLoading,
    loadSuggestions,
    autoSchedule,
    optimizeTimeline,
  } = useTimelineAI({
    items,
    groups,
    autoRefresh: true,
  });

  return (
    <div>
      {suggestions.map(suggestion => (
        <div key={suggestion.id}>
          {suggestion.title}
        </div>
      ))}
    </div>
  );
};
```

### useTimelineUndoRedo

Hook for undo/redo functionality.

```tsx
import { useTimelineUndoRedo } from '@fabmanage/timelinex';

const MyComponent = () => {
  const { canUndo, canRedo, undo, redo, pushAction } = useTimelineUndoRedo();

  return (
    <div>
      <button disabled={!canUndo} onClick={undo}>
        Undo
      </button>
      <button disabled={!canRedo} onClick={redo}>
        Redo
      </button>
    </div>
  );
};
```

## Types

### TimelineItem

```tsx
interface TimelineItem {
  id: string;
  title: string;
  start: Date;
  end: Date;
  groupId: string;
  color?: string;
  priority?: 'low' | 'medium' | 'high';
  progress?: number;
  description?: string;
  tags?: string[];
  dependencies?: string[];
  draggable?: boolean;
  resizable?: boolean;
  selectable?: boolean;
  data?: any;
}
```

### TimelineGroup

```tsx
interface TimelineGroup {
  id: string;
  title: string;
  color: string;
  collapsed?: boolean;
  items?: string[];
  description?: string;
  data?: any;
}
```

### TimelineTheme

```tsx
interface TimelineTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}
```

### TimelineSettings

```tsx
interface TimelineSettings {
  snapToGrid: boolean;
  showGrid: boolean;
  gridSize: number;
  showLabels: boolean;
  showTooltips: boolean;
  enableAnimations: boolean;
  enableGestures: boolean;
  enableKeyboard: boolean;
  enableAccessibility: boolean;
  maxZoom: number;
  minZoom: number;
  zoomStep: number;
  panStep: number;
}
```

## Themes

### Default Theme

```tsx
import { defaultTheme } from '@fabmanage/timelinex';

const MyTimeline = () => (
  <Timeline
    items={items}
    groups={groups}
    theme={defaultTheme}
  />
);
```

### Custom Theme

```tsx
const customTheme = {
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    background: '#f8f9fa',
    text: '#2c3e50',
    textSecondary: '#7f8c8d',
    border: '#e9ecef',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  // ... other theme properties
};

const MyTimeline = () => (
  <Timeline
    items={items}
    groups={groups}
    theme={customTheme}
  />
);
```

## Advanced Features

### Rendering Modes

TimelineX supports multiple rendering modes for different use cases:

```tsx
<Timeline
  items={items}
  groups={groups}
  renderMode="canvas" // canvas, svg, webgl, virtual, lazy, touch, animated, mobile, accessible, collaborative
/>
```

### Export System

Export timeline data in various formats:

```tsx
import { exportTimeline } from '@fabmanage/timelinex';

const handleExport = async () => {
  // Export as SVG
  await exportTimeline('svg', { items, groups });
  
  // Export as PNG
  await exportTimeline('png', { items, groups });
  
  // Export as PDF
  await exportTimeline('pdf', { items, groups });
  
  // Export as JSON
  await exportTimeline('json', { items, groups });
};
```

### Plugin System

Extend TimelineX with plugins:

```tsx
import { PluginManager } from '@fabmanage/timelinex';

const pluginManager = new PluginManager();

// Register a plugin
pluginManager.register({
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  install: (timeline) => {
    // Plugin installation logic
  },
  uninstall: (timeline) => {
    // Plugin uninstallation logic
  },
});

// Activate plugin
pluginManager.activate('my-plugin');
```

### AI Features

Use AI-powered features for timeline optimization:

```tsx
import { useTimelineAI } from '@fabmanage/timelinex';

const MyComponent = () => {
  const { suggestions, autoSchedule, optimizeTimeline } = useTimelineAI({
    items,
    groups,
  });

  const handleAutoSchedule = async () => {
    const scheduledItems = await autoSchedule();
    // Apply scheduled items
  };

  const handleOptimize = async () => {
    const result = await optimizeTimeline();
    // Apply optimizations
  };

  return (
    <div>
      <button onClick={handleAutoSchedule}>
        Auto Schedule
      </button>
      <button onClick={handleOptimize}>
        Optimize Timeline
      </button>
    </div>
  );
};
```

## Performance

### Virtual Scrolling

For large datasets, use virtual scrolling:

```tsx
<Timeline
  items={largeItems}
  groups={groups}
  renderMode="virtual"
  virtualScrolling={{
    enabled: true,
    itemHeight: 40,
    overscan: 5,
  }}
/>
```

### Lazy Loading

Load items as they become visible:

```tsx
<Timeline
  items={items}
  groups={groups}
  renderMode="lazy"
  lazyLoading={{
    enabled: true,
    batchSize: 100,
    threshold: 0.1,
  }}
/>
```

### WebGL Acceleration

Use WebGL for high-performance rendering:

```tsx
<Timeline
  items={items}
  groups={groups}
  renderMode="webgl"
  webgl={{
    enabled: true,
    antialias: true,
    alpha: true,
  }}
/>
```

## Accessibility

TimelineX is built with accessibility in mind and supports:

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Reduced motion
- Voice control
- Mobile accessibility

### Accessibility Example

```tsx
<Timeline
  items={items}
  groups={groups}
  renderMode="accessible"
  accessibility={{
    enableKeyboard: true,
    enableScreenReader: true,
    enableHighContrast: true,
    enableReducedMotion: true,
    announceChanges: true,
  }}
/>
```

## Examples

### Basic Timeline

```tsx
import React from 'react';
import { Timeline } from '@fabmanage/timelinex';

const BasicTimeline = () => {
  const items = [
    {
      id: '1',
      title: 'Task 1',
      start: new Date('2024-01-01'),
      end: new Date('2024-01-05'),
      groupId: 'group1',
    },
  ];

  const groups = [
    {
      id: 'group1',
      title: 'Group 1',
      color: '#3b82f6',
    },
  ];

  return (
    <Timeline
      items={items}
      groups={groups}
      height={400}
      width={800}
    />
  );
};
```

### Interactive Timeline

```tsx
import React, { useState } from 'react';
import { Timeline } from '@fabmanage/timelinex';

const InteractiveTimeline = () => {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleItemUpdate = (updatedItem) => {
    setItems(items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  return (
    <div>
      <Timeline
        items={items}
        groups={groups}
        onItemClick={handleItemClick}
        onItemUpdate={handleItemUpdate}
        height={600}
        width={1200}
      />
      {selectedItem && (
        <div className="item-details">
          <h3>{selectedItem.title}</h3>
          <p>{selectedItem.description}</p>
        </div>
      )}
    </div>
  );
};
```

### Custom Styled Timeline

```tsx
import React from 'react';
import { Timeline } from '@fabmanage/timelinex';

const CustomStyledTimeline = () => {
  const customTheme = {
    colors: {
      primary: '#ff6b6b',
      background: '#f8f9fa',
      text: '#2c3e50',
      border: '#e9ecef',
    },
    spacing: {
      md: 20,
    },
  };

  return (
    <Timeline
      items={items}
      groups={groups}
      theme={customTheme}
      height={500}
      width={1000}
      renderItem={(item) => (
        <div className="custom-item">
          <div className="item-header">
            <h4>{item.title}</h4>
            <span className="priority">{item.priority}</span>
          </div>
          <div className="item-progress">
            <div 
              className="progress-bar"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      )}
    />
  );
};
```

## Troubleshooting

### Common Issues

1. **Items not rendering**: Check that items have valid `start` and `end` dates
2. **Performance issues**: Use virtual scrolling or lazy loading for large datasets
3. **Accessibility issues**: Ensure proper ARIA labels and keyboard navigation
4. **Theme not applying**: Verify theme object structure matches `TimelineTheme` interface

### Debug Mode

Enable debug mode for development:

```tsx
<Timeline
  items={items}
  groups={groups}
  debug={true}
  onDebug={(message, data) => {
    console.log('[TimelineX Debug]', message, data);
  }}
/>
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.

