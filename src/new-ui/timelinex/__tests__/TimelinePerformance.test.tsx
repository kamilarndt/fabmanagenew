/**
 * TimelineX Performance Tests
 * Tests performance with large datasets and complex interactions
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Timeline } from '../components/Timeline';
import { TimelineItem, TimelineGroup } from '../types';

// Mock the timeline context
const mockTimelineContext = {
  state: {
    items: [],
    groups: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    mode: 'horizontal',
    theme: {
      colors: {
        primary: '#3b82f6',
        background: '#ffffff',
        text: '#000000',
        border: '#e5e7eb',
      },
    },
    settings: {
      snapToGrid: false,
      showGrid: true,
      gridSize: 20,
    },
  },
  actions: {
    addItem: jest.fn(),
    updateItem: jest.fn(),
    removeItem: jest.fn(),
    addGroup: jest.fn(),
    updateGroup: jest.fn(),
    removeGroup: jest.fn(),
    setViewport: jest.fn(),
    setMode: jest.fn(),
    setTheme: jest.fn(),
    setSettings: jest.fn(),
  },
  utils: {
    getItemById: jest.fn(),
    getGroupById: jest.fn(),
    getItemsInGroup: jest.fn(),
    getVisibleItems: jest.fn(),
    getItemBounds: jest.fn(),
    isItemVisible: jest.fn(),
  },
};

jest.mock('../hooks/useTimeline', () => ({
  useTimeline: () => mockTimelineContext,
}));

jest.mock('../hooks/useTimelineUndoRedo', () => ({
  useTimelineUndoRedo: () => ({
    canUndo: false,
    canRedo: false,
    undo: jest.fn(),
    redo: jest.fn(),
    pushAction: jest.fn(),
  }),
}));

jest.mock('../hooks/useTimelineAI', () => ({
  useTimelineAI: () => ({
    suggestions: [],
    isLoading: false,
    error: null,
    isSmartSuggestionsOpen: false,
    setIsSmartSuggestionsOpen: jest.fn(),
    loadSuggestions: jest.fn(),
    autoSchedule: jest.fn(),
    optimizeTimeline: jest.fn(),
    predictCompletion: jest.fn(),
    applySuggestion: jest.fn(),
    getSuggestionStats: jest.fn(),
  }),
}));

// Mock child components
jest.mock('../components/TimelineCanvas', () => ({
  TimelineCanvas: ({ children, ...props }: any) => (
    <div data-testid="timeline-canvas" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('../components/TimelineControls', () => ({
  TimelineControls: (props: any) => (
    <div data-testid="timeline-controls" {...props}>
      Timeline Controls
    </div>
  ),
}));

jest.mock('../components/TimelineGroup', () => ({
  TimelineGroup: ({ children, ...props }: any) => (
    <div data-testid="timeline-group" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('../components/TimelineItem', () => ({
  TimelineItem: (props: any) => (
    <div data-testid="timeline-item" {...props}>
      Timeline Item
    </div>
  ),
}));

describe('TimelineX Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Large Dataset Performance', () => {
    test('renders 1000 items within acceptable time', async () => {
      const largeItems = Array.from({ length: 1000 }, (_, i) => ({
        id: `item-${i}`,
        title: `Task ${i}`,
        start: new Date(`2024-01-${(i % 30) + 1}T09:00:00Z`),
        end: new Date(`2024-01-${(i % 30) + 1}T17:00:00Z`),
        groupId: `group-${i % 10}`,
      }));

      const largeGroups = Array.from({ length: 10 }, (_, i) => ({
        id: `group-${i}`,
        title: `Group ${i}`,
        color: '#3b82f6',
        collapsed: false,
      }));

      const startTime = performance.now();
      
      render(
        <Timeline
          items={largeItems}
          groups={largeGroups}
          height={400}
          width={800}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within 1000ms
      expect(renderTime).toBeLessThan(1000);
      expect(screen.getByTestId('timeline-canvas')).toBeInTheDocument();
    });

    test('renders 10000 items within acceptable time', async () => {
      const veryLargeItems = Array.from({ length: 10000 }, (_, i) => ({
        id: `item-${i}`,
        title: `Task ${i}`,
        start: new Date(`2024-01-${(i % 30) + 1}T09:00:00Z`),
        end: new Date(`2024-01-${(i % 30) + 1}T17:00:00Z`),
        groupId: `group-${i % 100}`,
      }));

      const veryLargeGroups = Array.from({ length: 100 }, (_, i) => ({
        id: `group-${i}`,
        title: `Group ${i}`,
        color: '#3b82f6',
        collapsed: false,
      }));

      const startTime = performance.now();
      
      render(
        <Timeline
          items={veryLargeItems}
          groups={veryLargeGroups}
          height={400}
          width={800}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within 2000ms
      expect(renderTime).toBeLessThan(2000);
      expect(screen.getByTestId('timeline-canvas')).toBeInTheDocument();
    });

    test('handles rapid state updates efficiently', async () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        id: `item-${i}`,
        title: `Task ${i}`,
        start: new Date(`2024-01-${(i % 30) + 1}T09:00:00Z`),
        end: new Date(`2024-01-${(i % 30) + 1}T17:00:00Z`),
        groupId: 'group1',
      }));

      const groups = [{
        id: 'group1',
        title: 'Test Group',
        color: '#3b82f6',
        collapsed: false,
      }];

      const { rerender } = render(
        <Timeline
          items={items}
          groups={groups}
          height={400}
          width={800}
        />
      );

      const startTime = performance.now();

      // Perform rapid updates
      for (let i = 0; i < 50; i++) {
        const updatedItems = items.map(item => ({
          ...item,
          title: `Updated Task ${i}`,
        }));
        
        rerender(
          <Timeline
            items={updatedItems}
            groups={groups}
            height={400}
            width={800}
          />
        );
      }

      const endTime = performance.now();
      const updateTime = endTime - startTime;

      // Should handle rapid updates within 1000ms
      expect(updateTime).toBeLessThan(1000);
      expect(screen.getByTestId('timeline-canvas')).toBeInTheDocument();
    });
  });

  describe('Memory Usage', () => {
    test('does not leak memory with repeated renders', async () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        id: `item-${i}`,
        title: `Task ${i}`,
        start: new Date(`2024-01-${(i % 30) + 1}T09:00:00Z`),
        end: new Date(`2024-01-${(i % 30) + 1}T17:00:00Z`),
        groupId: 'group1',
      }));

      const groups = [{
        id: 'group1',
        title: 'Test Group',
        color: '#3b82f6',
        collapsed: false,
      }];

      // Initial memory usage
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Render and unmount multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(
          <Timeline
            items={items}
            groups={groups}
            height={400}
            width={800}
          />
        );
        
        unmount();
      }

      // Force garbage collection if available
      if ((global as any).gc) {
        (global as any).gc();
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe('Interaction Performance', () => {
    test('handles rapid zoom operations efficiently', async () => {
      const items = Array.from({ length: 500 }, (_, i) => ({
        id: `item-${i}`,
        title: `Task ${i}`,
        start: new Date(`2024-01-${(i % 30) + 1}T09:00:00Z`),
        end: new Date(`2024-01-${(i % 30) + 1}T17:00:00Z`),
        groupId: 'group1',
      }));

      const groups = [{
        id: 'group1',
        title: 'Test Group',
        color: '#3b82f6',
        collapsed: false,
      }];

      render(
        <Timeline
          items={items}
          groups={groups}
          height={400}
          width={800}
        />
      );

      const startTime = performance.now();

      // Simulate rapid zoom operations
      for (let i = 0; i < 100; i++) {
        fireEvent.wheel(screen.getByTestId('timeline-canvas'), {
          deltaY: i % 2 === 0 ? 100 : -100,
        });
      }

      const endTime = performance.now();
      const zoomTime = endTime - startTime;

      // Should handle rapid zoom within 500ms
      expect(zoomTime).toBeLessThan(500);
      expect(screen.getByTestId('timeline-canvas')).toBeInTheDocument();
    });

    test('handles rapid pan operations efficiently', async () => {
      const items = Array.from({ length: 500 }, (_, i) => ({
        id: `item-${i}`,
        title: `Task ${i}`,
        start: new Date(`2024-01-${(i % 30) + 1}T09:00:00Z`),
        end: new Date(`2024-01-${(i % 30) + 1}T17:00:00Z`),
        groupId: 'group1',
      }));

      const groups = [{
        id: 'group1',
        title: 'Test Group',
        color: '#3b82f6',
        collapsed: false,
      }];

      render(
        <Timeline
          items={items}
          groups={groups}
          height={400}
          width={800}
        />
      );

      const startTime = performance.now();

      // Simulate rapid pan operations
      for (let i = 0; i < 100; i++) {
        fireEvent.mouseDown(screen.getByTestId('timeline-canvas'));
        fireEvent.mouseMove(screen.getByTestId('timeline-canvas'), {
          clientX: i * 10,
          clientY: i * 5,
        });
        fireEvent.mouseUp(screen.getByTestId('timeline-canvas'));
      }

      const endTime = performance.now();
      const panTime = endTime - startTime;

      // Should handle rapid pan within 500ms
      expect(panTime).toBeLessThan(500);
      expect(screen.getByTestId('timeline-canvas')).toBeInTheDocument();
    });
  });

  describe('Rendering Performance', () => {
    test('renders complex items efficiently', async () => {
      const complexItems = Array.from({ length: 1000 }, (_, i) => ({
        id: `item-${i}`,
        title: `Complex Task ${i} with Very Long Title`,
        start: new Date(`2024-01-${(i % 30) + 1}T09:00:00Z`),
        end: new Date(`2024-01-${(i % 30) + 1}T17:00:00Z`),
        groupId: `group-${i % 10}`,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        priority: ['low', 'medium', 'high'][i % 3],
        progress: Math.floor(Math.random() * 100),
        description: `This is a very long description for task ${i} that contains a lot of text to test rendering performance.`,
        tags: Array.from({ length: 5 }, (_, j) => `tag-${j}`),
        dependencies: Array.from({ length: 3 }, (_, j) => `dep-${j}`),
      }));

      const groups = Array.from({ length: 10 }, (_, i) => ({
        id: `group-${i}`,
        title: `Complex Group ${i}`,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        collapsed: false,
        description: `This is a complex group with a long description.`,
      }));

      const startTime = performance.now();
      
      render(
        <Timeline
          items={complexItems}
          groups={groups}
          height={400}
          width={800}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render complex items within 1500ms
      expect(renderTime).toBeLessThan(1500);
      expect(screen.getByTestId('timeline-canvas')).toBeInTheDocument();
    });

    test('handles dynamic item updates efficiently', async () => {
      const items = Array.from({ length: 500 }, (_, i) => ({
        id: `item-${i}`,
        title: `Task ${i}`,
        start: new Date(`2024-01-${(i % 30) + 1}T09:00:00Z`),
        end: new Date(`2024-01-${(i % 30) + 1}T17:00:00Z`),
        groupId: 'group1',
      }));

      const groups = [{
        id: 'group1',
        title: 'Test Group',
        color: '#3b82f6',
        collapsed: false,
      }];

      const { rerender } = render(
        <Timeline
          items={items}
          groups={groups}
          height={400}
          width={800}
        />
      );

      const startTime = performance.now();

      // Update items dynamically
      for (let i = 0; i < 20; i++) {
        const updatedItems = items.map((item, index) => ({
          ...item,
          title: `Updated Task ${index} - ${i}`,
          start: new Date(item.start.getTime() + i * 1000),
          end: new Date(item.end.getTime() + i * 1000),
        }));
        
        rerender(
          <Timeline
            items={updatedItems}
            groups={groups}
            height={400}
            width={800}
          />
        );
      }

      const endTime = performance.now();
      const updateTime = endTime - startTime;

      // Should handle dynamic updates within 1000ms
      expect(updateTime).toBeLessThan(1000);
      expect(screen.getByTestId('timeline-canvas')).toBeInTheDocument();
    });
  });
});
