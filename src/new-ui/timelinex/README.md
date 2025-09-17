# TimelineX

A powerful, feature-rich timeline component library built for React with TypeScript. TimelineX provides advanced timeline visualization capabilities with support for large datasets, real-time collaboration, AI-powered features, and extensive customization options.

## ✨ Features

### Core Features
- **Multiple Rendering Modes**: Canvas, SVG, WebGL, Virtual Scrolling, Lazy Loading
- **Interactive Timeline**: Drag & drop, resize, select, zoom, pan
- **Group Management**: Organize items into collapsible groups
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support

### Advanced Features
- **AI-Powered Suggestions**: Smart scheduling, optimization, and predictions
- **Real-time Collaboration**: WebSocket-based real-time updates
- **Export System**: Export to SVG, PNG, PDF, JSON, CSV, Excel, PowerPoint
- **Plugin System**: Extensible architecture with marketplace
- **Performance**: Handles 1M+ items with virtual scrolling and WebGL acceleration
- **Animations**: GSAP-powered smooth animations and transitions

### Developer Experience
- **TypeScript**: Full type safety and IntelliSense support
- **Storybook**: Comprehensive component documentation and examples
- **Testing**: Unit, integration, and E2E tests with high coverage
- **Theming**: Customizable themes with design tokens
- **Hooks**: Powerful React hooks for state management

## 🚀 Quick Start

### Installation

```bash
npm install @fabmanage/timelinex
# or
yarn add @fabmanage/timelinex
```

### Basic Usage

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

## 📚 Documentation

### API Reference
- [Complete API Documentation](docs/API.md)
- [Component Props](docs/API.md#core-components)
- [Hooks](docs/API.md#hooks)
- [Types](docs/API.md#types)
- [Themes](docs/API.md#themes)

### Examples
- [Basic Timeline](docs/API.md#basic-timeline)
- [Interactive Timeline](docs/API.md#interactive-timeline)
- [Custom Styled Timeline](docs/API.md#custom-styled-timeline)
- [Advanced Features](docs/API.md#advanced-features)

### Storybook
View all components and examples in our interactive Storybook:
```bash
npm run storybook
```

## 🎨 Rendering Modes

TimelineX supports multiple rendering modes for different use cases:

### Canvas Mode (Default)
```tsx
<Timeline renderMode="canvas" items={items} groups={groups} />
```

### SVG Mode
```tsx
<Timeline renderMode="svg" items={items} groups={groups} />
```

### WebGL Mode (High Performance)
```tsx
<Timeline renderMode="webgl" items={items} groups={groups} />
```

### Virtual Scrolling (Large Datasets)
```tsx
<Timeline renderMode="virtual" items={largeItems} groups={groups} />
```

### Lazy Loading
```tsx
<Timeline renderMode="lazy" items={items} groups={groups} />
```

### Touch Optimized
```tsx
<Timeline renderMode="touch" items={items} groups={groups} />
```

### Mobile Optimized
```tsx
<Timeline renderMode="mobile" items={items} groups={groups} />
```

### Accessibility Mode
```tsx
<Timeline renderMode="accessible" items={items} groups={groups} />
```

### Collaborative Mode
```tsx
<Timeline renderMode="collaborative" items={items} groups={groups} />
```

## 🤖 AI Features

TimelineX includes powerful AI features for timeline optimization:

### Smart Suggestions
```tsx
import { useTimelineAI } from '@fabmanage/timelinex';

const MyComponent = () => {
  const { suggestions, loadSuggestions } = useTimelineAI({
    items,
    groups,
  });

  return (
    <div>
      {suggestions.map(suggestion => (
        <div key={suggestion.id}>
          {suggestion.title}: {suggestion.description}
        </div>
      ))}
    </div>
  );
};
```

### Auto-Scheduling
```tsx
const { autoSchedule } = useTimelineAI({ items, groups });

const handleAutoSchedule = async () => {
  const scheduledItems = await autoSchedule();
  // Apply scheduled items
};
```

### Timeline Optimization
```tsx
const { optimizeTimeline } = useTimelineAI({ items, groups });

const handleOptimize = async () => {
  const result = await optimizeTimeline();
  // Apply optimizations
};
```

## 🔌 Plugin System

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
```

## 📊 Export System

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

## 🎨 Theming

Customize the appearance with themes:

```tsx
const customTheme = {
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    background: '#f8f9fa',
    text: '#2c3e50',
  },
  spacing: {
    md: 16,
    lg: 24,
  },
  // ... other theme properties
};

<Timeline theme={customTheme} items={items} groups={groups} />
```

## 🧪 Testing

TimelineX includes comprehensive testing:

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### Coverage Report
```bash
npm run test:coverage
```

## 📱 Mobile Support

TimelineX is fully responsive and optimized for mobile devices:

- Touch gestures (pinch, swipe, long press)
- Mobile-optimized rendering
- Responsive design
- Haptic feedback support
- Pull-to-refresh
- Infinite scroll

## ♿ Accessibility

TimelineX is built with accessibility in mind:

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Reduced motion support
- Voice control compatibility
- Focus management
- ARIA labels and descriptions

## 🚀 Performance

TimelineX is optimized for performance:

- Virtual scrolling for large datasets
- WebGL acceleration for smooth animations
- Lazy loading for better memory usage
- Efficient rendering algorithms
- Optimized event handling
- Memory leak prevention

## 📦 Bundle Size

TimelineX is designed to be lightweight:

- Tree-shakable exports
- Modular architecture
- Optional features
- Optimized builds
- Minimal dependencies

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/fabmanage/timelinex.git

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build
npm run build
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- [Documentation](docs/API.md)
- [Storybook](https://timelinex.fabmanage.com/storybook)
- [GitHub Issues](https://github.com/fabmanage/timelinex/issues)
- [Discord Community](https://discord.gg/timelinex)

## 🗺️ Roadmap

- [ ] Advanced AI features
- [ ] More export formats
- [ ] Additional plugins
- [ ] Performance improvements
- [ ] New rendering modes
- [ ] Enhanced accessibility
- [ ] Mobile app integration

## 🙏 Acknowledgments

- React team for the amazing framework
- TypeScript team for type safety
- Canvas API for high-performance rendering
- WebGL for advanced graphics
- GSAP for smooth animations
- All contributors and users

---

Made with ❤️ by the FabManage team