import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useVirtualScroll } from '../../utils/performance';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const VirtualList = <T,>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
  style,
}: VirtualListProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);

  useEffect(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + visibleCount + 1, items.length);
    
    setStartIndex(start);
    setEndIndex(end);
  }, [scrollTop, itemHeight, containerHeight, items.length]);

  const visibleItems = useMemo(() => 
    items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
    })), [items, startIndex, endIndex]
  );

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      className={className}
      style={{
        height: containerHeight,
        overflow: 'auto',
        ...style,
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div
              key={index}
              style={{
                height: itemHeight,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Alternative implementation using react-window for better performance
export const VirtualListWithReactWindow = <T,>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
  style,
}: VirtualListProps<T>) => {
  const Row = ({ index, style: rowStyle }: { index: number; style: React.CSSProperties }) => (
    <div style={rowStyle}>
      {renderItem(items[index], index)}
    </div>
  );

  return (
    <List
      className={className}
      style={style}
      height={containerHeight}
      itemCount={items.length}
      itemSize={itemHeight}
    >
      {Row}
    </List>
  );
};
