/**
 * TimelineX Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from '../components/Timeline';
import { TimelineItem, TimelineGroup } from '../types';

const meta: Meta<typeof Timeline> = {
  title: 'TimelineX/Timeline',
  component: Timeline,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A powerful timeline component with advanced features and customization options.',
      },
    },
  },
  argTypes: {
    height: {
      control: { type: 'range', min: 200, max: 1000, step: 50 },
      description: 'Height of the timeline in pixels',
    },
    width: {
      control: { type: 'range', min: 400, max: 2000, step: 100 },
      description: 'Width of the timeline in pixels',
    },
    mode: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Timeline orientation',
    },
    draggable: {
      control: { type: 'boolean' },
      description: 'Enable item dragging',
    },
    resizable: {
      control: { type: 'boolean' },
      description: 'Enable item resizing',
    },
    selectable: {
      control: { type: 'boolean' },
      description: 'Enable item selection',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

// Sample data
const sampleItems: TimelineItem[] = [
  {
    id: '1',
    title: 'Project Planning',
    start: new Date('2024-01-01T09:00:00Z'),
    end: new Date('2024-01-05T17:00:00Z'),
    groupId: 'planning',
    color: '#3b82f6',
    priority: 'high',
    progress: 100,
    description: 'Initial project planning and requirements gathering',
  },
  {
    id: '2',
    title: 'Design Phase',
    start: new Date('2024-01-06T09:00:00Z'),
    end: new Date('2024-01-15T17:00:00Z'),
    groupId: 'design',
    color: '#10b981',
    priority: 'high',
    progress: 80,
    description: 'UI/UX design and prototyping',
  },
  {
    id: '3',
    title: 'Development Sprint 1',
    start: new Date('2024-01-16T09:00:00Z'),
    end: new Date('2024-01-30T17:00:00Z'),
    groupId: 'development',
    color: '#f59e0b',
    priority: 'medium',
    progress: 60,
    description: 'First development sprint with core features',
  },
  {
    id: '4',
    title: 'Testing Phase',
    start: new Date('2024-01-31T09:00:00Z'),
    end: new Date('2024-02-10T17:00:00Z'),
    groupId: 'testing',
    color: '#ef4444',
    priority: 'medium',
    progress: 30,
    description: 'Quality assurance and testing',
  },
  {
    id: '5',
    title: 'Deployment',
    start: new Date('2024-02-11T09:00:00Z'),
    end: new Date('2024-02-15T17:00:00Z'),
    groupId: 'deployment',
    color: '#8b5cf6',
    priority: 'high',
    progress: 0,
    description: 'Production deployment and launch',
  },
];

const sampleGroups: TimelineGroup[] = [
  {
    id: 'planning',
    title: 'Planning',
    color: '#3b82f6',
    collapsed: false,
  },
  {
    id: 'design',
    title: 'Design',
    color: '#10b981',
    collapsed: false,
  },
  {
    id: 'development',
    title: 'Development',
    color: '#f59e0b',
    collapsed: false,
  },
  {
    id: 'testing',
    title: 'Testing',
    color: '#ef4444',
    collapsed: false,
  },
  {
    id: 'deployment',
    title: 'Deployment',
    color: '#8b5cf6',
    collapsed: false,
  },
];

// Basic Timeline
export const Default: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    height: 400,
    width: 800,
    mode: 'horizontal',
    draggable: true,
    resizable: true,
    selectable: true,
  },
};

// Large Timeline
export const Large: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    height: 600,
    width: 1200,
    mode: 'horizontal',
    draggable: true,
    resizable: true,
    selectable: true,
  },
};

// Vertical Timeline
export const Vertical: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    height: 600,
    width: 400,
    mode: 'vertical',
    draggable: true,
    resizable: true,
    selectable: true,
  },
};

// Minimal Timeline
export const Minimal: Story = {
  args: {
    items: sampleItems.slice(0, 2),
    groups: sampleGroups.slice(0, 2),
    height: 300,
    width: 600,
    mode: 'horizontal',
    draggable: false,
    resizable: false,
    selectable: false,
  },
};

// Many Items
export const ManyItems: Story = {
  args: {
    items: Array.from({ length: 50 }, (_, i) => ({
      id: `item-${i}`,
      title: `Task ${i + 1}`,
      start: new Date(`2024-01-${(i % 30) + 1}T09:00:00Z`),
      end: new Date(`2024-01-${(i % 30) + 1}T17:00:00Z`),
      groupId: `group-${i % 5}`,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5],
      priority: ['low', 'medium', 'high'][i % 3],
      progress: Math.floor(Math.random() * 100),
    })),
    groups: Array.from({ length: 5 }, (_, i) => ({
      id: `group-${i}`,
      title: `Group ${i + 1}`,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i],
      collapsed: false,
    })),
    height: 500,
    width: 1000,
    mode: 'horizontal',
    draggable: true,
    resizable: true,
    selectable: true,
  },
};

// Custom Theme
export const CustomTheme: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    height: 400,
    width: 800,
    mode: 'horizontal',
    draggable: true,
    resizable: true,
    selectable: true,
    theme: {
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
      typography: {
        fontFamily: 'Inter, sans-serif',
        fontSize: {
          xs: 12,
          sm: 14,
          md: 16,
          lg: 18,
          xl: 20,
        },
        fontWeight: {
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
        },
      },
      borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
      },
      shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
    },
  },
};

// Interactive Timeline
export const Interactive: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    height: 400,
    width: 800,
    mode: 'horizontal',
    draggable: true,
    resizable: true,
    selectable: true,
    onItemClick: (item) => {
      console.log('Item clicked:', item);
    },
    onItemDoubleClick: (item) => {
      console.log('Item double-clicked:', item);
    },
    onItemHover: (item) => {
      console.log('Item hovered:', item);
    },
    onItemUpdate: (item) => {
      console.log('Item updated:', item);
    },
    onItemDelete: (itemId) => {
      console.log('Item deleted:', itemId);
    },
    onGroupToggle: (group, collapsed) => {
      console.log('Group toggled:', group, collapsed);
    },
    onZoom: (zoom) => {
      console.log('Zoom changed:', zoom);
    },
    onPan: (x, y) => {
      console.log('Pan changed:', x, y);
    },
  },
};

// Custom Renderers
export const CustomRenderers: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    height: 400,
    width: 800,
    mode: 'horizontal',
    draggable: true,
    resizable: true,
    selectable: true,
    renderItem: (item) => (
      <div style={{
        padding: '8px',
        borderRadius: '4px',
        backgroundColor: item.color,
        color: 'white',
        fontSize: '12px',
        fontWeight: '500',
      }}>
        <div style={{ marginBottom: '4px' }}>{item.title}</div>
        <div style={{ fontSize: '10px', opacity: 0.8 }}>
          {item.progress}% complete
        </div>
      </div>
    ),
    renderTooltip: (item) => (
      <div style={{
        padding: '8px',
        backgroundColor: '#333',
        color: 'white',
        borderRadius: '4px',
        fontSize: '12px',
      }}>
        <div style={{ fontWeight: 'bold' }}>{item.title}</div>
        <div style={{ marginTop: '4px' }}>{item.description}</div>
        <div style={{ marginTop: '4px', fontSize: '10px' }}>
          Priority: {item.priority} | Progress: {item.progress}%
        </div>
      </div>
    ),
  },
};

// Different Render Modes
export const CanvasMode: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    height: 400,
    width: 800,
    mode: 'horizontal',
    renderMode: 'canvas',
  },
};

export const SVGMode: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    height: 400,
    width: 800,
    mode: 'horizontal',
    renderMode: 'svg',
  },
};

export const WebGLMode: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    height: 400,
    width: 800,
    mode: 'horizontal',
    renderMode: 'webgl',
  },
};

export const VirtualMode: Story = {
  args: {
    items: Array.from({ length: 1000 }, (_, i) => ({
      id: `item-${i}`,
      title: `Task ${i + 1}`,
      start: new Date(`2024-01-${(i % 30) + 1}T09:00:00Z`),
      end: new Date(`2024-01-${(i % 30) + 1}T17:00:00Z`),
      groupId: `group-${i % 10}`,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5],
    })),
    groups: Array.from({ length: 10 }, (_, i) => ({
      id: `group-${i}`,
      title: `Group ${i + 1}`,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i],
      collapsed: false,
    })),
    height: 500,
    width: 1000,
    mode: 'horizontal',
    renderMode: 'virtual',
  },
};

export const TouchMode: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    height: 400,
    width: 800,
    mode: 'horizontal',
    renderMode: 'touch',
  },
};

export const MobileMode: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    height: 400,
    width: 800,
    mode: 'horizontal',
    renderMode: 'mobile',
  },
};

export const AccessibleMode: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    height: 400,
    width: 800,
    mode: 'horizontal',
    renderMode: 'accessible',
  },
};

export const CollaborativeMode: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    height: 400,
    width: 800,
    mode: 'horizontal',
    renderMode: 'collaborative',
  },
};

// Performance Test
export const PerformanceTest: Story = {
  args: {
    items: Array.from({ length: 10000 }, (_, i) => ({
      id: `item-${i}`,
      title: `Task ${i + 1}`,
      start: new Date(`2024-01-${(i % 30) + 1}T09:00:00Z`),
      end: new Date(`2024-01-${(i % 30) + 1}T17:00:00Z`),
      groupId: `group-${i % 100}`,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5],
    })),
    groups: Array.from({ length: 100 }, (_, i) => ({
      id: `group-${i}`,
      title: `Group ${i + 1}`,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5],
      collapsed: false,
    })),
    height: 600,
    width: 1200,
    mode: 'horizontal',
    renderMode: 'virtual',
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance test with 10,000 items using virtual scrolling.',
      },
    },
  },
};