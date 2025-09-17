// TimelineX Tests
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Timeline } from '../components/Timeline';
import { TimelineItem, TimelineGroup } from '../types';

// Mock data
const mockItems: TimelineItem[] = [
  {
    id: '1',
    title: 'Test Item 1',
    start: new Date('2024-01-01'),
    end: new Date('2024-01-02'),
    description: 'Test description',
  },
  {
    id: '2',
    title: 'Test Item 2',
    start: new Date('2024-01-03'),
    end: new Date('2024-01-04'),
    description: 'Another test description',
  },
];

const mockGroups: TimelineGroup[] = [
  {
    id: 'group1',
    title: 'Test Group',
    items: mockItems,
  },
];

describe('Timeline', () => {
  test('renders timeline with items', () => {
    render(<Timeline items={mockItems} />);
    
    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    expect(screen.getByText('Test Item 2')).toBeInTheDocument();
  });

  test('renders timeline with groups', () => {
    render(<Timeline items={mockItems} groups={mockGroups} />);
    
    expect(screen.getByText('Test Group')).toBeInTheDocument();
  });

  test('handles item click', () => {
    const onItemClick = jest.fn();
    render(<Timeline items={mockItems} onItemClick={onItemClick} />);
    
    fireEvent.click(screen.getByText('Test Item 1'));
    expect(onItemClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1' }),
      expect.any(Object)
    );
  });

  test('handles item double click', () => {
    const onItemDoubleClick = jest.fn();
    render(<Timeline items={mockItems} onItemDoubleClick={onItemDoubleClick} />);
    
    fireEvent.doubleClick(screen.getByText('Test Item 1'));
    expect(onItemDoubleClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1' }),
      expect.any(Object)
    );
  });

  test('applies custom className', () => {
    const { container } = render(
      <Timeline items={mockItems} className="custom-timeline" />
    );
    
    expect(container.firstChild).toHaveClass('custom-timeline');
  });

  test('applies custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    const { container } = render(
      <Timeline items={mockItems} style={customStyle} />
    );
    
    expect(container.firstChild).toHaveStyle('background-color: red');
  });

  test('handles readonly mode', () => {
    render(<Timeline items={mockItems} readonly={true} />);
    
    // In readonly mode, items should not be draggable or editable
    // This would be tested by checking the rendered attributes
  });

  test('handles different modes', () => {
    const { rerender } = render(<Timeline items={mockItems} mode="horizontal" />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    rerender(<Timeline items={mockItems} mode="vertical" />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
