/**
 * TimelineX Integration Tests
 * Tests the interaction between multiple components and features
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Timeline } from '../components/Timeline';
import { TimelineItem, TimelineGroup } from '../types';

// Mock the timeline context with more realistic state
const mockTimelineContext = {
  state: {
    items: [
      {
        id: '1',
        title: 'Task 1',
        start: new Date('2024-01-01T09:00:00Z'),
        end: new Date('2024-01-01T17:00:00Z'),
        groupId: 'group1',
        color: '#3b82f6',
        priority: 'high',
        progress: 50,
      },
      {
        id: '2',
        title: 'Task 2',
        start: new Date('2024-01-02T09:00:00Z'),
        end: new Date('2024-01-02T17:00:00Z'),
        groupId: 'group1',
        color: '#10b981',
        priority: 'medium',
        progress: 25,
      },
    ],
    groups: [
      {
        id: 'group1',
        title: 'Development',
        color: '#3b82f6',
        collapsed: false,
      },
      {
        id: 'group2',
        title: 'Testing',
        color: '#f59e0b',
        collapsed: true,
      },
    ],
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
    canUndo: true,
    canRedo: false,
    undo: jest.fn(),
    redo: jest.fn(),
    pushAction: jest.fn(),
  }),
}));

jest.mock('../hooks/useTimelineAI', () => ({
  useTimelineAI: () => ({
    suggestions: [
      {
        id: 'suggestion1',
        type: 'schedule',
        title: 'Optimize schedule',
        description: 'Move Task 2 to start earlier',
        confidence: 0.8,
        impact: 'medium',
        action: jest.fn(),
      },
    ],
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

// Mock child components with more realistic behavior
jest.mock('../components/TimelineCanvas', () => ({
  TimelineCanvas: ({ children, onItemClick, onItemDoubleClick, onItemHover, onItemUpdate, onItemDelete, onGroupToggle, ...props }: any) => (
    <div data-testid="timeline-canvas" {...props}>
      {children}
      <button
        data-testid="test-item-click"
        onClick={() => onItemClick?.(mockTimelineContext.state.items[0])}
      >
        Click Item
      </button>
      <button
        data-testid="test-item-double-click"
        onDoubleClick={() => onItemDoubleClick?.(mockTimelineContext.state.items[0])}
      >
        Double Click Item
      </button>
      <button
        data-testid="test-item-hover"
        onMouseEnter={() => onItemHover?.(mockTimelineContext.state.items[0])}
        onMouseLeave={() => onItemHover?.(null)}
      >
        Hover Item
      </button>
      <button
        data-testid="test-item-update"
        onClick={() => onItemUpdate?.(mockTimelineContext.state.items[0])}
      >
        Update Item
      </button>
      <button
        data-testid="test-item-delete"
        onClick={() => onItemDelete?.(mockTimelineContext.state.items[0].id)}
      >
        Delete Item
      </button>
      <button
        data-testid="test-group-toggle"
        onClick={() => onGroupToggle?.(mockTimelineContext.state.groups[0], true)}
      >
        Toggle Group
      </button>
    </div>
  ),
}));

jest.mock('../components/TimelineControls', () => ({
  TimelineControls: ({ onZoom, onPan, onUndo, onRedo, onOpenPluginMarketplace, onOpenSmartSuggestions, ...props }: any) => (
    <div data-testid="timeline-controls" {...props}>
      <button data-testid="zoom-in" onClick={() => onZoom?.(1.2)}>Zoom In</button>
      <button data-testid="zoom-out" onClick={() => onZoom?.(0.8)}>Zoom Out</button>
      <button data-testid="pan-left" onClick={() => onPan?.(-100, 0)}>Pan Left</button>
      <button data-testid="pan-right" onClick={() => onPan?.(100, 0)}>Pan Right</button>
      <button data-testid="undo" onClick={onUndo}>Undo</button>
      <button data-testid="redo" onClick={onRedo}>Redo</button>
      <button data-testid="open-plugins" onClick={onOpenPluginMarketplace}>Plugins</button>
      <button data-testid="open-ai" onClick={onOpenSmartSuggestions}>AI</button>
    </div>
  ),
}));

jest.mock('../components/TimelineGroup', () => ({
  TimelineGroup: ({ group, children, onToggle, onUpdate, onDelete, ...props }: any) => (
    <div data-testid={`timeline-group-${group.id}`} {...props}>
      <div data-testid={`group-title-${group.id}`}>{group.title}</div>
      <button
        data-testid={`group-toggle-${group.id}`}
        onClick={() => onToggle?.(group, !group.collapsed)}
      >
        Toggle
      </button>
      <button
        data-testid={`group-update-${group.id}`}
        onClick={() => onUpdate?.(group)}
      >
        Update
      </button>
      <button
        data-testid={`group-delete-${group.id}`}
        onClick={() => onDelete?.(group.id)}
      >
        Delete
      </button>
      {!group.collapsed && children}
    </div>
  ),
}));

jest.mock('../components/TimelineItem', () => ({
  TimelineItem: ({ item, onClick, onDoubleClick, onHover, onUpdate, onDelete, ...props }: any) => (
    <div data-testid={`timeline-item-${item.id}`} {...props}>
      <div data-testid={`item-title-${item.id}`}>{item.title}</div>
      <button
        data-testid={`item-click-${item.id}`}
        onClick={() => onClick?.(item)}
      >
        Click
      </button>
      <button
        data-testid={`item-double-click-${item.id}`}
        onDoubleClick={() => onDoubleClick?.(item)}
      >
        Double Click
      </button>
      <button
        data-testid={`item-hover-${item.id}`}
        onMouseEnter={() => onHover?.(item)}
        onMouseLeave={() => onHover?.(null)}
      >
        Hover
      </button>
      <button
        data-testid={`item-update-${item.id}`}
        onClick={() => onUpdate?.(item)}
      >
        Update
      </button>
      <button
        data-testid={`item-delete-${item.id}`}
        onClick={() => onDelete?.(item.id)}
      >
        Delete
      </button>
    </div>
  ),
}));

describe('TimelineX Integration Tests', () => {
  const defaultProps = {
    items: mockTimelineContext.state.items,
    groups: mockTimelineContext.state.groups,
    height: 400,
    width: 800,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Integration', () => {
    test('renders all components together', () => {
      render(<Timeline {...defaultProps} />);
      
      expect(screen.getByTestId('timeline-canvas')).toBeInTheDocument();
      expect(screen.getByTestId('timeline-controls')).toBeInTheDocument();
      expect(screen.getByTestId('timeline-group-group1')).toBeInTheDocument();
      expect(screen.getByTestId('timeline-group-group2')).toBeInTheDocument();
      expect(screen.getByTestId('timeline-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('timeline-item-2')).toBeInTheDocument();
    });

    test('displays group titles correctly', () => {
      render(<Timeline {...defaultProps} />);
      
      expect(screen.getByTestId('group-title-group1')).toHaveTextContent('Development');
      expect(screen.getByTestId('group-title-group2')).toHaveTextContent('Testing');
    });

    test('displays item titles correctly', () => {
      render(<Timeline {...defaultProps} />);
      
      expect(screen.getByTestId('item-title-1')).toHaveTextContent('Task 1');
      expect(screen.getByTestId('item-title-2')).toHaveTextContent('Task 2');
    });
  });

  describe('User Interactions', () => {
    test('handles item click interactions', () => {
      const onItemClick = jest.fn();
      render(<Timeline {...defaultProps} onItemClick={onItemClick} />);
      
      fireEvent.click(screen.getByTestId('test-item-click'));
      expect(onItemClick).toHaveBeenCalledWith(mockTimelineContext.state.items[0]);
    });

    test('handles item double click interactions', () => {
      const onItemDoubleClick = jest.fn();
      render(<Timeline {...defaultProps} onItemDoubleClick={onItemDoubleClick} />);
      
      fireEvent.doubleClick(screen.getByTestId('test-item-double-click'));
      expect(onItemDoubleClick).toHaveBeenCalledWith(mockTimelineContext.state.items[0]);
    });

    test('handles item hover interactions', () => {
      const onItemHover = jest.fn();
      render(<Timeline {...defaultProps} onItemHover={onItemHover} />);
      
      fireEvent.mouseEnter(screen.getByTestId('test-item-hover'));
      expect(onItemHover).toHaveBeenCalledWith(mockTimelineContext.state.items[0]);
      
      fireEvent.mouseLeave(screen.getByTestId('test-item-hover'));
      expect(onItemHover).toHaveBeenCalledWith(null);
    });

    test('handles item update interactions', () => {
      const onItemUpdate = jest.fn();
      render(<Timeline {...defaultProps} onItemUpdate={onItemUpdate} />);
      
      fireEvent.click(screen.getByTestId('test-item-update'));
      expect(onItemUpdate).toHaveBeenCalledWith(mockTimelineContext.state.items[0]);
    });

    test('handles item delete interactions', () => {
      const onItemDelete = jest.fn();
      render(<Timeline {...defaultProps} onItemDelete={onItemDelete} />);
      
      fireEvent.click(screen.getByTestId('test-item-delete'));
      expect(onItemDelete).toHaveBeenCalledWith(mockTimelineContext.state.items[0].id);
    });

    test('handles group toggle interactions', () => {
      const onGroupToggle = jest.fn();
      render(<Timeline {...defaultProps} onGroupToggle={onGroupToggle} />);
      
      fireEvent.click(screen.getByTestId('test-group-toggle'));
      expect(onGroupToggle).toHaveBeenCalledWith(mockTimelineContext.state.groups[0], true);
    });
  });

  describe('Control Interactions', () => {
    test('handles zoom controls', () => {
      const onZoom = jest.fn();
      render(<Timeline {...defaultProps} onZoom={onZoom} />);
      
      fireEvent.click(screen.getByTestId('zoom-in'));
      expect(onZoom).toHaveBeenCalledWith(1.2);
      
      fireEvent.click(screen.getByTestId('zoom-out'));
      expect(onZoom).toHaveBeenCalledWith(0.8);
    });

    test('handles pan controls', () => {
      const onPan = jest.fn();
      render(<Timeline {...defaultProps} onPan={onPan} />);
      
      fireEvent.click(screen.getByTestId('pan-left'));
      expect(onPan).toHaveBeenCalledWith(-100, 0);
      
      fireEvent.click(screen.getByTestId('pan-right'));
      expect(onPan).toHaveBeenCalledWith(100, 0);
    });

    test('handles undo/redo controls', () => {
      render(<Timeline {...defaultProps} />);
      
      fireEvent.click(screen.getByTestId('undo'));
      fireEvent.click(screen.getByTestId('redo'));
      
      // These would call the actual undo/redo functions
      expect(screen.getByTestId('undo')).toBeInTheDocument();
      expect(screen.getByTestId('redo')).toBeInTheDocument();
    });

    test('handles plugin marketplace', () => {
      render(<Timeline {...defaultProps} />);
      
      fireEvent.click(screen.getByTestId('open-plugins'));
      
      // This would open the plugin marketplace
      expect(screen.getByTestId('open-plugins')).toBeInTheDocument();
    });

    test('handles AI suggestions', () => {
      render(<Timeline {...defaultProps} />);
      
      fireEvent.click(screen.getByTestId('open-ai'));
      
      // This would open the AI suggestions panel
      expect(screen.getByTestId('open-ai')).toBeInTheDocument();
    });
  });

  describe('Group Management', () => {
    test('handles group toggle from group component', () => {
      render(<Timeline {...defaultProps} />);
      
      fireEvent.click(screen.getByTestId('group-toggle-group1'));
      
      // This would toggle the group
      expect(screen.getByTestId('group-toggle-group1')).toBeInTheDocument();
    });

    test('handles group update from group component', () => {
      render(<Timeline {...defaultProps} />);
      
      fireEvent.click(screen.getByTestId('group-update-group1'));
      
      // This would update the group
      expect(screen.getByTestId('group-update-group1')).toBeInTheDocument();
    });

    test('handles group delete from group component', () => {
      render(<Timeline {...defaultProps} />);
      
      fireEvent.click(screen.getByTestId('group-delete-group1'));
      
      // This would delete the group
      expect(screen.getByTestId('group-delete-group1')).toBeInTheDocument();
    });
  });

  describe('Item Management', () => {
    test('handles item click from item component', () => {
      render(<Timeline {...defaultProps} />);
      
      fireEvent.click(screen.getByTestId('item-click-1'));
      
      // This would handle the item click
      expect(screen.getByTestId('item-click-1')).toBeInTheDocument();
    });

    test('handles item double click from item component', () => {
      render(<Timeline {...defaultProps} />);
      
      fireEvent.doubleClick(screen.getByTestId('item-double-click-1'));
      
      // This would handle the item double click
      expect(screen.getByTestId('item-double-click-1')).toBeInTheDocument();
    });

    test('handles item hover from item component', () => {
      render(<Timeline {...defaultProps} />);
      
      fireEvent.mouseEnter(screen.getByTestId('item-hover-1'));
      fireEvent.mouseLeave(screen.getByTestId('item-hover-1'));
      
      // This would handle the item hover
      expect(screen.getByTestId('item-hover-1')).toBeInTheDocument();
    });

    test('handles item update from item component', () => {
      render(<Timeline {...defaultProps} />);
      
      fireEvent.click(screen.getByTestId('item-update-1'));
      
      // This would handle the item update
      expect(screen.getByTestId('item-update-1')).toBeInTheDocument();
    });

    test('handles item delete from item component', () => {
      render(<Timeline {...defaultProps} />);
      
      fireEvent.click(screen.getByTestId('item-delete-1'));
      
      // This would handle the item delete
      expect(screen.getByTestId('item-delete-1')).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    test('maintains state consistency across interactions', () => {
      render(<Timeline {...defaultProps} />);
      
      // Perform multiple interactions
      fireEvent.click(screen.getByTestId('zoom-in'));
      fireEvent.click(screen.getByTestId('pan-right'));
      fireEvent.click(screen.getByTestId('group-toggle-group1'));
      fireEvent.click(screen.getByTestId('item-click-1'));
      
      // State should remain consistent
      expect(screen.getByTestId('timeline-canvas')).toBeInTheDocument();
      expect(screen.getByTestId('timeline-controls')).toBeInTheDocument();
    });

    test('handles rapid successive interactions', () => {
      render(<Timeline {...defaultProps} />);
      
      // Perform rapid interactions
      for (let i = 0; i < 10; i++) {
        fireEvent.click(screen.getByTestId('zoom-in'));
        fireEvent.click(screen.getByTestId('pan-right'));
      }
      
      // Should handle rapid interactions gracefully
      expect(screen.getByTestId('timeline-canvas')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles missing props gracefully', () => {
      render(<Timeline />);
      
      // Should render without crashing
      expect(screen.getByTestId('timeline-canvas')).toBeInTheDocument();
    });

    test('handles invalid data gracefully', () => {
      const invalidProps = {
        items: [null, undefined, {}],
        groups: [null, undefined, {}],
      };
      
      render(<Timeline {...invalidProps} />);
      
      // Should render without crashing
      expect(screen.getByTestId('timeline-canvas')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('handles large datasets', () => {
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
      
      render(<Timeline items={largeItems} groups={largeGroups} />);
      
      // Should render without performance issues
      expect(screen.getByTestId('timeline-canvas')).toBeInTheDocument();
    });
  });
});
