// TimelineX Storybook Stories
import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from '../components/Timeline';
import { TimelineItem, TimelineGroup } from '../types';

const meta: Meta<typeof Timeline> = {
  title: 'TimelineX/Timeline',
  component: Timeline,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical', 'alternating', 'spiral', 'masonry', 'gantt'],
    },
    readonly: {
      control: { type: 'boolean' },
    },
    selectable: {
      control: { type: 'boolean' },
    },
    editable: {
      control: { type: 'boolean' },
    },
    draggable: {
      control: { type: 'boolean' },
    },
    resizable: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

// Sample data
const sampleItems: TimelineItem[] = [
  {
    id: '1',
    title: 'Project Kickoff',
    start: new Date('2024-01-01'),
    end: new Date('2024-01-05'),
    description: 'Initial project planning and team setup',
    progress: 100,
    color: '#3B82F6',
  },
  {
    id: '2',
    title: 'Design Phase',
    start: new Date('2024-01-06'),
    end: new Date('2024-01-20'),
    description: 'UI/UX design and prototyping',
    progress: 75,
    color: '#10B981',
  },
  {
    id: '3',
    title: 'Development',
    start: new Date('2024-01-21'),
    end: new Date('2024-02-15'),
    description: 'Core development and feature implementation',
    progress: 50,
    color: '#F59E0B',
  },
  {
    id: '4',
    title: 'Testing',
    start: new Date('2024-02-16'),
    end: new Date('2024-02-28'),
    description: 'Quality assurance and testing',
    progress: 25,
    color: '#EF4444',
  },
  {
    id: '5',
    title: 'Launch',
    start: new Date('2024-03-01'),
    end: new Date('2024-03-05'),
    description: 'Production deployment and launch',
    progress: 0,
    color: '#8B5CF6',
  },
];

const sampleGroups: TimelineGroup[] = [
  {
    id: 'planning',
    title: 'Planning Phase',
    items: sampleItems.slice(0, 2),
    color: '#3B82F6',
  },
  {
    id: 'execution',
    title: 'Execution Phase',
    items: sampleItems.slice(2, 4),
    color: '#10B981',
  },
  {
    id: 'delivery',
    title: 'Delivery Phase',
    items: sampleItems.slice(4),
    color: '#8B5CF6',
  },
];

export const Default: Story = {
  args: {
    items: sampleItems,
    width: '100%',
    height: '400px',
  },
};

export const WithGroups: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    width: '100%',
    height: '500px',
  },
};

export const Horizontal: Story = {
  args: {
    items: sampleItems,
    mode: 'horizontal',
    width: '100%',
    height: '300px',
  },
};

export const Vertical: Story = {
  args: {
    items: sampleItems,
    mode: 'vertical',
    width: '100%',
    height: '600px',
  },
};

export const Alternating: Story = {
  args: {
    items: sampleItems,
    mode: 'alternating',
    width: '100%',
    height: '500px',
  },
};

export const Spiral: Story = {
  args: {
    items: sampleItems,
    mode: 'spiral',
    width: '100%',
    height: '500px',
  },
};

export const Gantt: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    mode: 'gantt',
    width: '100%',
    height: '400px',
  },
};

export const Readonly: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    readonly: true,
    width: '100%',
    height: '400px',
  },
};

export const Interactive: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    selectable: true,
    editable: true,
    draggable: true,
    resizable: true,
    width: '100%',
    height: '400px',
  },
};

export const LargeDataset: Story = {
  args: {
    items: Array.from({ length: 100 }, (_, i) => ({
      id: `item-${i}`,
      title: `Item ${i + 1}`,
      start: new Date(2024, 0, 1 + i),
      end: new Date(2024, 0, 2 + i),
      description: `Description for item ${i + 1}`,
      progress: Math.floor(Math.random() * 100),
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
    })),
    width: '100%',
    height: '600px',
  },
};

export const CustomTheme: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    theme: {
      primaryColor: '#FF6B6B',
      secondaryColor: '#4ECDC4',
      backgroundColor: '#F8F9FA',
      itemColor: '#FFE66D',
      groupColor: '#A8E6CF',
    },
    width: '100%',
    height: '400px',
  },
};

export const WithEvents: Story = {
  args: {
    items: sampleItems,
    groups: sampleGroups,
    onItemClick: (item) => console.log('Item clicked:', item),
    onItemDoubleClick: (item) => console.log('Item double clicked:', item),
    onItemHover: (item) => console.log('Item hovered:', item),
    onSelectionChange: (items, groups) => console.log('Selection changed:', items, groups),
    onViewportChange: (viewport) => console.log('Viewport changed:', viewport),
    onZoom: (zoom, center) => console.log('Zoomed:', zoom, center),
    onPan: (pan) => console.log('Panned:', pan),
    width: '100%',
    height: '400px',
  },
};
