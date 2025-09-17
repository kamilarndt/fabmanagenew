/**
 * TimelineGroup Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { TimelineGroup as TimelineGroupComponent } from '../components/TimelineGroup';
import { TimelineGroup as TimelineGroupType } from '../types';

const meta: Meta<typeof TimelineGroupComponent> = {
  title: 'TimelineX/TimelineGroup',
  component: TimelineGroupComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Timeline group component for organizing timeline items.',
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
      description: 'Group size',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'ghost'],
      description: 'Group variant',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimelineGroupComponent>;

// Sample group data
const sampleGroup: TimelineGroupType = {
  id: 'group1',
  title: 'Development',
  color: '#3b82f6',
  collapsed: false,
  description: 'Development tasks and features',
};

const sampleItems = [
  {
    id: '1',
    title: 'Task 1',
    start: new Date('2024-01-01T09:00:00Z'),
    end: new Date('2024-01-05T17:00:00Z'),
    groupId: 'group1',
  },
  {
    id: '2',
    title: 'Task 2',
    start: new Date('2024-01-06T09:00:00Z'),
    end: new Date('2024-01-10T17:00:00Z'),
    groupId: 'group1',
  },
];

// Default Group
export const Default: Story = {
  args: {
    group: sampleGroup,
    items: sampleItems,
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

// Expanded Group
export const Expanded: Story = {
  args: {
    group: { ...sampleGroup, collapsed: false },
    items: sampleItems,
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

// Collapsed Group
export const Collapsed: Story = {
  args: {
    group: { ...sampleGroup, collapsed: true },
    items: sampleItems,
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

// Selected Group
export const Selected: Story = {
  args: {
    group: sampleGroup,
    items: sampleItems,
    selected: true,
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

// Disabled Group
export const Disabled: Story = {
  args: {
    group: sampleGroup,
    items: sampleItems,
    disabled: true,
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

// Loading Group
export const Loading: Story = {
  args: {
    group: sampleGroup,
    items: sampleItems,
    loading: true,
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

// Different Sizes
export const Small: Story = {
  args: {
    group: sampleGroup,
    items: sampleItems,
    size: 'small',
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

export const Medium: Story = {
  args: {
    group: sampleGroup,
    items: sampleItems,
    size: 'medium',
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

export const Large: Story = {
  args: {
    group: sampleGroup,
    items: sampleItems,
    size: 'large',
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

// Different Variants
export const Outline: Story = {
  args: {
    group: sampleGroup,
    items: sampleItems,
    variant: 'outline',
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

export const Ghost: Story = {
  args: {
    group: sampleGroup,
    items: sampleItems,
    variant: 'ghost',
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

// Different Colors
export const BlueGroup: Story = {
  args: {
    group: { ...sampleGroup, color: '#3b82f6' },
    items: sampleItems,
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

export const GreenGroup: Story = {
  args: {
    group: { ...sampleGroup, color: '#10b981' },
    items: sampleItems,
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

export const RedGroup: Story = {
  args: {
    group: { ...sampleGroup, color: '#ef4444' },
    items: sampleItems,
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

export const PurpleGroup: Story = {
  args: {
    group: { ...sampleGroup, color: '#8b5cf6' },
    items: sampleItems,
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

export const OrangeGroup: Story = {
  args: {
    group: { ...sampleGroup, color: '#f59e0b' },
    items: sampleItems,
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

// Long Title
export const LongTitle: Story = {
  args: {
    group: {
      ...sampleGroup,
      title: 'This is a very long group title that should wrap or truncate appropriately',
    },
    items: sampleItems,
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

// With Description
export const WithDescription: Story = {
  args: {
    group: {
      ...sampleGroup,
      description: 'This group contains all development-related tasks and features.',
    },
    items: sampleItems,
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

// With Many Items
export const WithManyItems: Story = {
  args: {
    group: sampleGroup,
    items: Array.from({ length: 10 }, (_, i) => ({
      id: `item-${i}`,
      title: `Task ${i + 1}`,
      start: new Date(`2024-01-${(i % 30) + 1}T09:00:00Z`),
      end: new Date(`2024-01-${(i % 30) + 1}T17:00:00Z`),
      groupId: 'group1',
    })),
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i}>Sample Item {i + 1}</div>
        ))}
      </div>
    ),
  },
};

// Custom Renderer
export const CustomRenderer: Story = {
  args: {
    group: sampleGroup,
    items: sampleItems,
    renderGroup: (group) => (
      <div style={{
        padding: '16px',
        borderRadius: '8px',
        backgroundColor: group.color,
        color: 'white',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        border: '2px solid transparent',
        transition: 'all 0.2s ease',
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '12px',
        }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
            {group.title}
          </h3>
          <div style={{
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            fontWeight: '500',
          }}>
            {sampleItems.length} items
          </div>
        </div>
        {group.description && (
          <div style={{
            fontSize: '12px',
            opacity: 0.9,
            lineHeight: '1.4',
            marginBottom: '12px',
          }}>
            {group.description}
          </div>
        )}
        <div style={{
          fontSize: '11px',
          opacity: 0.8,
        }}>
          Click to toggle items
        </div>
      </div>
    ),
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ 
        padding: '12px', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '4px',
        marginTop: '8px',
      }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

// All States Combined
export const AllStates: Story = {
  args: {
    group: sampleGroup,
    items: sampleItems,
    selected: true,
    disabled: false,
    loading: false,
    size: 'large',
    variant: 'outline',
    onToggle: (group, collapsed) => console.log('Toggled:', group, collapsed),
    onUpdate: (group) => console.log('Updated:', group),
    onDelete: (groupId) => console.log('Deleted:', groupId),
    children: (
      <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div>Sample Item 1</div>
        <div>Sample Item 2</div>
      </div>
    ),
  },
};

