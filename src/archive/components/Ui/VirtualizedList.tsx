import React from "react";

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
  renderItem,
}: VirtualizedListProps<T>) {
  // Simplified implementation without react-window for now
  return (
    <div
      style={{
        height,
        width,
        overflow: "auto",
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            height: itemHeight,
            display: "flex",
            alignItems: "center",
          }}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
