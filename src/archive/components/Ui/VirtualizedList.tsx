import React, { useMemo } from "react";
import { FixedSizeList, type ListChildComponentProps } from "react-window";

interface VirtualizedListProps<T> {
  items: readonly T[];
  itemHeight: number;
  height: number;
  width?: number | string;
  overscanCount?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  height,
  width = "100%",
  overscanCount = 4,
  renderItem,
}: VirtualizedListProps<T>) {
  const itemData = useMemo(() => ({ items, renderItem }), [items, renderItem]);

  const Row = ({ index, style, data }: ListChildComponentProps) => {
    const d = data as {
      items: readonly T[];
      renderItem: (item: T, index: number) => React.ReactNode;
    };
    return <div style={style}>{d.renderItem(d.items[index], index)}</div>;
  };

  return (
    <FixedSizeList
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      width={width}
      itemData={itemData}
      overscanCount={overscanCount}
    >
      {Row}
    </FixedSizeList>
  );
}
