import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { LazyImage } from '../../components/Performance/LazyImage';
import { VirtualList } from '../../components/Performance/VirtualList';
import { PerformanceMonitor } from '../../components/Performance/PerformanceMonitor';

describe('LazyImage Component', () => {
  it('renders placeholder initially', () => {
    render(<LazyImage src="test.jpg" alt="Test image" />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('loads image when in viewport', async () => {
    render(<LazyImage src="test.jpg" alt="Test image" />);
    
    // Simulate intersection observer
    const img = screen.getByAltText('Test image');
    fireEvent.load(img);
    
    await waitFor(() => {
      expect(img).toHaveAttribute('src', 'test.jpg');
    });
  });
});

describe('VirtualList Component', () => {
  const mockItems = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }));

  it('renders virtual list', () => {
    render(
      <VirtualList
        items={mockItems}
        itemHeight={50}
        containerHeight={300}
        renderItem={(item) => <div>{item.name}</div>}
      />
    );
    
    expect(screen.getByText('Item 0')).toBeInTheDocument();
  });

  it('only renders visible items', () => {
    render(
      <VirtualList
        items={mockItems}
        itemHeight={50}
        containerHeight={300}
        renderItem={(item) => <div>{item.name}</div>}
      />
    );
    
    // Should only render visible items (300px / 50px = 6 items)
    const visibleItems = screen.getAllByText(/Item \d+/);
    expect(visibleItems.length).toBeLessThanOrEqual(10); // Some buffer for smooth scrolling
  });
});

describe('PerformanceMonitor Component', () => {
  it('renders performance monitor', () => {
    render(<PerformanceMonitor />);
    
    expect(screen.getByText('Performance Monitor')).toBeInTheDocument();
  });

  it('shows memory usage when available', () => {
    // Mock performance.memory
    Object.defineProperty(performance, 'memory', {
      value: {
        usedJSHeapSize: 1000000,
        totalJSHeapSize: 2000000,
        jsHeapSizeLimit: 4000000,
      },
      writable: true,
    });

    render(<PerformanceMonitor />);
    
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
  });
});
