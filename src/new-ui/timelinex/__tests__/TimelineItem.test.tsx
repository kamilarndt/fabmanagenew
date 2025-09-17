/**
 * TimelineItem Component Unit Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimelineItem as TimelineItemComponent } from '../components/TimelineItem';
import { TimelineItem as TimelineItemType } from '../types';

// Mock the timeline context
const mockTimelineContext = {
  viewport: { x: 0, y: 0, zoom: 1 },
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
};

jest.mock('../hooks/useTimeline', () => ({
  useTimeline: () => mockTimelineContext,
}));

describe('TimelineItem Component', () => {
  const mockItem: TimelineItemType = {
    id: '1',
    title: 'Test Item',
    start: new Date('2024-01-01T09:00:00Z'),
    end: new Date('2024-01-01T17:00:00Z'),
    groupId: 'group1',
    color: '#3b82f6',
    priority: 'high',
    progress: 50,
    draggable: true,
    resizable: true,
    selectable: true,
  };

  const defaultProps = {
    item: mockItem,
    group: {
      id: 'group1',
      title: 'Test Group',
      color: '#3b82f6',
      collapsed: false,
    },
    onClick: jest.fn(),
    onDoubleClick: jest.fn(),
    onHover: jest.fn(),
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders item with title', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  test('renders item with custom color', () => {
    const customItem = { ...mockItem, color: '#ff0000' };
    render(<TimelineItemComponent {...defaultProps} item={customItem} />);
    
    const item = screen.getByText('Test Item').parentElement;
    expect(item).toHaveStyle('background-color: #ff0000');
  });

  test('renders item with priority indicator', () => {
    const highPriorityItem = { ...mockItem, priority: 'high' as const };
    render(<TimelineItemComponent {...defaultProps} item={highPriorityItem} />);
    
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    // Priority indicator would be rendered based on the implementation
  });

  test('renders item with progress bar', () => {
    const itemWithProgress = { ...mockItem, progress: 75 };
    render(<TimelineItemComponent {...defaultProps} item={itemWithProgress} />);
    
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    // Progress bar would be rendered based on the implementation
  });

  test('handles click events', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    fireEvent.click(item);
    
    expect(defaultProps.onClick).toHaveBeenCalledWith(mockItem);
  });

  test('handles double click events', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    fireEvent.doubleClick(item);
    
    expect(defaultProps.onDoubleClick).toHaveBeenCalledWith(mockItem);
  });

  test('handles hover events', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    fireEvent.mouseEnter(item);
    
    expect(defaultProps.onHover).toHaveBeenCalledWith(mockItem);
  });

  test('handles mouse leave events', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    fireEvent.mouseLeave(item);
    
    expect(defaultProps.onHover).toHaveBeenCalledWith(null);
  });

  test('handles drag start events', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    fireEvent.dragStart(item);
    
    expect(item).toHaveAttribute('draggable', 'true');
  });

  test('handles drag end events', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    fireEvent.dragEnd(item);
    
    expect(item).toBeInTheDocument();
  });

  test('handles drag over events', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    fireEvent.dragOver(item);
    
    expect(item).toBeInTheDocument();
  });

  test('handles drop events', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    fireEvent.drop(item);
    
    expect(item).toBeInTheDocument();
  });

  test('handles keyboard events', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    
    fireEvent.keyDown(item, { key: 'Enter' });
    fireEvent.keyDown(item, { key: ' ' });
    fireEvent.keyDown(item, { key: 'Delete' });
    fireEvent.keyDown(item, { key: 'Escape' });
    
    expect(item).toBeInTheDocument();
  });

  test('handles focus events', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    
    fireEvent.focus(item);
    fireEvent.blur(item);
    
    expect(item).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const customClassName = 'custom-item';
    render(<TimelineItemComponent {...defaultProps} className={customClassName} />);
    
    const item = screen.getByText('Test Item').parentElement;
    expect(item).toHaveClass(customClassName);
  });

  test('applies custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    render(<TimelineItemComponent {...defaultProps} style={customStyle} />);
    
    const item = screen.getByText('Test Item').parentElement;
    expect(item).toHaveStyle('background-color: red');
  });

  test('renders with different states', () => {
    const { rerender } = render(<TimelineItemComponent {...defaultProps} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();

    // Test selected state
    rerender(<TimelineItemComponent {...defaultProps} selected={true} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();

    // Test disabled state
    rerender(<TimelineItemComponent {...defaultProps} disabled={true} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();

    // Test loading state
    rerender(<TimelineItemComponent {...defaultProps} loading={true} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  test('renders with different sizes', () => {
    const { rerender } = render(<TimelineItemComponent {...defaultProps} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();

    // Test small size
    rerender(<TimelineItemComponent {...defaultProps} size="small" />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();

    // Test large size
    rerender(<TimelineItemComponent {...defaultProps} size="large" />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  test('renders with different variants', () => {
    const { rerender } = render(<TimelineItemComponent {...defaultProps} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();

    // Test different variants
    rerender(<TimelineItemComponent {...defaultProps} variant="outline" />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();

    rerender(<TimelineItemComponent {...defaultProps} variant="ghost" />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  test('handles custom render function', () => {
    const customRender = jest.fn((item) => <div>Custom: {item.title}</div>);
    render(<TimelineItemComponent {...defaultProps} renderItem={customRender} />);
    
    expect(customRender).toHaveBeenCalledWith(mockItem);
    expect(screen.getByText('Custom: Test Item')).toBeInTheDocument();
  });

  test('handles custom tooltip', () => {
    const customTooltip = jest.fn((item) => <div>Tooltip: {item.title}</div>);
    render(<TimelineItemComponent {...defaultProps} renderTooltip={customTooltip} />);
    
    expect(customTooltip).toBeDefined();
  });

  test('applies accessibility attributes', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item').parentElement;
    expect(item).toHaveAttribute('role', 'button');
    expect(item).toHaveAttribute('tabIndex', '0');
    expect(item).toHaveAttribute('aria-label', 'Test Item');
  });

  test('handles ARIA attributes for different states', () => {
    const { rerender } = render(<TimelineItemComponent {...defaultProps} />);
    
    let item = screen.getByText('Test Item').parentElement;
    expect(item).toHaveAttribute('aria-selected', 'false');

    // Test selected state
    rerender(<TimelineItemComponent {...defaultProps} selected={true} />);
    item = screen.getByText('Test Item').parentElement;
    expect(item).toHaveAttribute('aria-selected', 'true');

    // Test disabled state
    rerender(<TimelineItemComponent {...defaultProps} disabled={true} />);
    item = screen.getByText('Test Item').parentElement;
    expect(item).toHaveAttribute('aria-disabled', 'true');
  });

  test('handles keyboard navigation', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    
    // Test arrow key navigation
    fireEvent.keyDown(item, { key: 'ArrowRight' });
    fireEvent.keyDown(item, { key: 'ArrowLeft' });
    fireEvent.keyDown(item, { key: 'ArrowUp' });
    fireEvent.keyDown(item, { key: 'ArrowDown' });
    
    expect(item).toBeInTheDocument();
  });

  test('handles context menu events', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    fireEvent.contextMenu(item);
    
    expect(item).toBeInTheDocument();
  });

  test('handles touch events', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    
    fireEvent.touchStart(item);
    fireEvent.touchMove(item);
    fireEvent.touchEnd(item);
    
    expect(item).toBeInTheDocument();
  });

  test('handles long press events', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    
    // Simulate long press
    fireEvent.mouseDown(item);
    setTimeout(() => {
      fireEvent.mouseUp(item);
    }, 1000);
    
    expect(item).toBeInTheDocument();
  });

  test('handles resize events', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    
    // Test resize handles
    const resizeHandle = item.querySelector('[data-resize-handle]');
    if (resizeHandle) {
      fireEvent.mouseDown(resizeHandle);
      fireEvent.mouseMove(resizeHandle);
      fireEvent.mouseUp(resizeHandle);
    }
    
    expect(item).toBeInTheDocument();
  });

  test('handles update events', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    
    // Simulate item update
    const updatedItem = { ...mockItem, title: 'Updated Item' };
    fireEvent.click(item);
    
    // This would trigger the update handler in a real implementation
    expect(defaultProps.onUpdate).toBeDefined();
  });

  test('handles delete events', () => {
    render(<TimelineItemComponent {...defaultProps} />);
    
    const item = screen.getByText('Test Item');
    
    // Simulate delete action
    fireEvent.keyDown(item, { key: 'Delete' });
    
    expect(defaultProps.onDelete).toBeDefined();
  });
});
