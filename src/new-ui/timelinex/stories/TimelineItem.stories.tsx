/**
 * TimelineItem Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { TimelineItem as TimelineItemComponent } from '../components/TimelineItem';
import { TimelineItem as TimelineItemType } from '../types';

const meta: Meta<typeof TimelineItemComponent> = {
  title: 'TimelineX/TimelineItem',
  component: TimelineItemComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Individual timeline item component with various states and customization options.',
      },
    },
  },
  argTypes: {
    selected: {
      control: { type: 'boolean' },
      description: 'Selection state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Item size',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'ghost'],
      description: 'Item variant',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimelineItemComponent>;

// Sample item data
const sampleItem: TimelineItemType = {
  id: '1',
  title: 'Sample Task',
  start: new Date('2024-01-01T09:00:00Z'),
  end: new Date('2024-01-05T17:00:00Z'),
  groupId: 'group1',
  color: '#3b82f6',
  priority: 'high',
  progress: 75,
  description: 'This is a sample task with a description.',
  tags: ['urgent', 'frontend'],
  dependencies: ['task-2', 'task-3'],
};

const sampleGroup = {
  id: 'group1',
  title: 'Development',
  color: '#3b82f6',
  collapsed: false,
};

// Default Item
export const Default: Story = {
  args: {
    item: sampleItem,
    group: sampleGroup,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

// Selected Item
export const Selected: Story = {
  args: {
    item: sampleItem,
    group: sampleGroup,
    selected: true,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

// Disabled Item
export const Disabled: Story = {
  args: {
    item: sampleItem,
    group: sampleGroup,
    disabled: true,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

// Loading Item
export const Loading: Story = {
  args: {
    item: sampleItem,
    group: sampleGroup,
    loading: true,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

// Different Sizes
export const Small: Story = {
  args: {
    item: sampleItem,
    group: sampleGroup,
    size: 'small',
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

export const Medium: Story = {
  args: {
    item: sampleItem,
    group: sampleGroup,
    size: 'medium',
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

export const Large: Story = {
  args: {
    item: sampleItem,
    group: sampleGroup,
    size: 'large',
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

// Different Variants
export const Outline: Story = {
  args: {
    item: sampleItem,
    group: sampleGroup,
    variant: 'outline',
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

export const Ghost: Story = {
  args: {
    item: sampleItem,
    group: sampleGroup,
    variant: 'ghost',
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

// Different Priorities
export const HighPriority: Story = {
  args: {
    item: { ...sampleItem, priority: 'high' as const },
    group: sampleGroup,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

export const MediumPriority: Story = {
  args: {
    item: { ...sampleItem, priority: 'medium' as const },
    group: sampleGroup,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

export const LowPriority: Story = {
  args: {
    item: { ...sampleItem, priority: 'low' as const },
    group: sampleGroup,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

// Different Progress States
export const NotStarted: Story = {
  args: {
    item: { ...sampleItem, progress: 0 },
    group: sampleGroup,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

export const InProgress: Story = {
  args: {
    item: { ...sampleItem, progress: 50 },
    group: sampleGroup,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

export const Completed: Story = {
  args: {
    item: { ...sampleItem, progress: 100 },
    group: sampleGroup,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

// Different Colors
export const BlueItem: Story = {
  args: {
    item: { ...sampleItem, color: '#3b82f6' },
    group: sampleGroup,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

export const GreenItem: Story = {
  args: {
    item: { ...sampleItem, color: '#10b981' },
    group: sampleGroup,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

export const RedItem: Story = {
  args: {
    item: { ...sampleItem, color: '#ef4444' },
    group: sampleGroup,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

export const PurpleItem: Story = {
  args: {
    item: { ...sampleItem, color: '#8b5cf6' },
    group: sampleGroup,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

// Custom Renderer
export const CustomRenderer: Story = {
  args: {
    item: sampleItem,
    group: sampleGroup,
    renderItem: (item) => (
      <div style={{
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: item.color,
        color: 'white',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        border: '2px solid transparent',
        transition: 'all 0.2s ease',
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
            {item.title}
          </h4>
          <span style={{
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            textTransform: 'uppercase',
            fontWeight: '500',
          }}>
            {item.priority}
          </span>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${item.progress}%`,
              height: '100%',
              backgroundColor: 'white',
              transition: 'width 0.3s ease',
            }} />
          </div>
          <div style={{
            fontSize: '10px',
            marginTop: '4px',
            opacity: 0.8,
          }}>
            {item.progress}% complete
          </div>
        </div>
        {item.description && (
          <div style={{
            fontSize: '11px',
            opacity: 0.9,
            lineHeight: '1.4',
          }}>
            {item.description}
          </div>
        )}
        {item.tags && item.tags.length > 0 && (
          <div style={{
            marginTop: '8px',
            display: 'flex',
            gap: '4px',
            flexWrap: 'wrap',
          }}>
            {item.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  fontSize: '9px',
                  padding: '2px 4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '2px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    ),
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

// Long Title
export const LongTitle: Story = {
  args: {
    item: {
      ...sampleItem,
      title: 'This is a very long task title that should wrap or truncate appropriately',
    },
    group: sampleGroup,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

// With Dependencies
export const WithDependencies: Story = {
  args: {
    item: {
      ...sampleItem,
      dependencies: ['task-1', 'task-2', 'task-3'],
    },
    group: sampleGroup,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

// With Tags
export const WithTags: Story = {
  args: {
    item: {
      ...sampleItem,
      tags: ['urgent', 'frontend', 'react', 'typescript', 'high-priority'],
    },
    group: sampleGroup,
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

// All States Combined
export const AllStates: Story = {
  args: {
    item: sampleItem,
    group: sampleGroup,
    selected: true,
    disabled: false,
    loading: false,
    size: 'large',
    variant: 'outline',
    onClick: (item) => console.log('Clicked:', item),
    onDoubleClick: (item) => console.log('Double-clicked:', item),
    onHover: (item) => console.log('Hovered:', item),
    onUpdate: (item) => console.log('Updated:', item),
    onDelete: (itemId) => console.log('Deleted:', itemId),
  },
};

