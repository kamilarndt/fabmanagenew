// TimelineX Canvas Component
// High-performance canvas rendering for timeline items

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { timelineStyles } from "../styles/timeline-styles";
import {
  TimelineGroup,
  TimelineItem,
  TimelineMode,
  TimelineSettings,
  TimelineTheme,
  Viewport,
} from "../types";

export interface TimelineCanvasProps {
  items: TimelineItem[];
  groups: TimelineGroup[];
  viewport: {
    start: Date;
    end: Date;
    zoom: number;
    pan: { x: number; y: number };
  };
  mode: TimelineMode;
  theme: TimelineTheme;
  settings: TimelineSettings;
  onItemClick?: (item: TimelineItem, event: React.MouseEvent) => void;
  onItemHover?: (item: TimelineItem | null, event: React.MouseEvent) => void;
  onViewportChange?: (viewport: Viewport) => void;
  onZoom?: (zoom: number, center?: { x: number; y: number }) => void;
  onPan?: (pan: { x: number; y: number }) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface TimelineCanvasRef {
  getCanvas: () => HTMLCanvasElement | null;
  redraw: () => void;
  getItemAtPosition: (x: number, y: number) => TimelineItem | null;
  getViewportBounds: () => {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  exportToImage: (format?: "png" | "jpeg" | "webp") => string;
}

export const TimelineCanvas = forwardRef<
  TimelineCanvasRef,
  TimelineCanvasProps
>(function TimelineCanvas(
  {
    items,
    groups,
    viewport,
    mode,
    theme,
    settings,
    onItemClick,
    onItemHover,
    onViewportChange,
    onZoom,
    onPan,
    className,
    style,
  },
  ref
) {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastRenderTimeRef = useRef<number>(0);

  // State
  const [isRendering, setIsRendering] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<TimelineItem | null>(null);

  // Canvas context
  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });

    if (!ctx) return null;

    // Set up high DPI rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    return ctx;
  }, []);

  // Calculate item bounds with collision detection and stacking
  const getItemBounds = useCallback(
    (item: TimelineItem) => {
      const container = containerRef.current;
      if (!container) return { x: 0, y: 0, width: 0, height: 0 };

      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      // Calculate time-based positioning
      const viewportStart = viewport.start.getTime();
      const viewportEnd = viewport.end.getTime();
      const viewportDuration = viewportEnd - viewportStart;

      const itemStart = item.start.getTime();
      const itemEnd = (item.end || item.start).getTime();

      // Calculate position based on mode
      let x = 0;
      let y = 0;
      let width = 0;
      let height = 0;

      // Advanced lane-based positioning with collision detection
      const laneHeight = 44; // px per group lane
      const laneGap = 8;
      const itemHeight = 32;
      const subLaneHeight = 8; // Height for sub-lanes within a group

      const groupIndex = item.group
        ? Math.max(
            0,
            groups.findIndex((g) => g.id === item.group)
          )
        : 0;
      const baseLaneY = (laneHeight + laneGap) * groupIndex;

      // Find items in the same group that overlap in time
      const overlappingItems = items.filter((otherItem) => {
        if (otherItem.id === item.id || otherItem.group !== item.group)
          return false;
        const otherStart = otherItem.start.getTime();
        const otherEnd = (otherItem.end || otherItem.start).getTime();
        return !(itemEnd <= otherStart || itemStart >= otherEnd);
      });

      // Calculate sub-lane index based on overlapping items
      const subLaneIndex = overlappingItems.length;
      const laneY = baseLaneY + subLaneIndex * subLaneHeight;

      switch (mode) {
        case "horizontal":
          x = ((itemStart - viewportStart) / viewportDuration) * containerWidth;
          y = laneY;
          width = ((itemEnd - itemStart) / viewportDuration) * containerWidth;
          height = Math.min(
            itemHeight,
            laneHeight - subLaneIndex * subLaneHeight - 4
          );
          break;

        case "vertical":
          // Vertical timeline layout with proper lane positioning
          x = laneY;
          y =
            ((itemStart - viewportStart) / viewportDuration) * containerHeight;
          width = Math.min(
            itemHeight,
            laneHeight - subLaneIndex * subLaneHeight - 4
          );
          height = ((itemEnd - itemStart) / viewportDuration) * containerHeight;
          break;

        case "alternating":
          // Alternate between left and right
          const itemIndex = items.indexOf(item);
          const isEven = itemIndex % 2 === 0;
          x = isEven ? 0 : containerWidth / 2;
          y =
            ((itemStart - viewportStart) / viewportDuration) * containerHeight;
          width = containerWidth / 2;
          height = ((itemEnd - itemStart) / viewportDuration) * containerHeight;
          break;

        case "spiral":
          // Spiral positioning
          const centerX = containerWidth / 2;
          const centerY = containerHeight / 2;
          const radius = Math.min(containerWidth, containerHeight) / 4;
          const angle =
            ((itemStart - viewportStart) / viewportDuration) * Math.PI * 2;
          x = centerX + Math.cos(angle) * radius - 16;
          y = centerY + Math.sin(angle) * radius - 16;
          width = 32;
          height = 32;
          break;

        case "masonry":
          // Masonry layout
          x = 0;
          y =
            ((itemStart - viewportStart) / viewportDuration) * containerHeight;
          width = containerWidth;
          height = ((itemEnd - itemStart) / viewportDuration) * containerHeight;
          break;

        case "circular":
          // Circular layout
          const centerX2 = containerWidth / 2;
          const centerY2 = containerHeight / 2;
          const radius2 = Math.min(containerWidth, containerHeight) / 3;
          const angle2 =
            ((itemStart - viewportStart) / viewportDuration) * Math.PI * 2;
          x = centerX2 + Math.cos(angle2) * radius2 - 16;
          y = centerY2 + Math.sin(angle2) * radius2 - 16;
          width = 32;
          height = 32;
          break;

        case "gantt":
          // Gantt chart layout with proper resource lanes
          x = ((itemStart - viewportStart) / viewportDuration) * containerWidth;
          y = laneY;
          width = ((itemEnd - itemStart) / viewportDuration) * containerWidth;
          height = Math.min(
            itemHeight,
            laneHeight - subLaneIndex * subLaneHeight - 4
          );
          break;

        case "calendar":
          // Calendar layout with resource lanes
          x = ((itemStart - viewportStart) / viewportDuration) * containerWidth;
          y = laneY;
          width = ((itemEnd - itemStart) / viewportDuration) * containerWidth;
          height = Math.min(20, laneHeight - subLaneIndex * subLaneHeight - 4);
          break;
      }

      // Apply pan offset
      x += viewport.pan.x;
      y += viewport.pan.y;

      // Apply zoom
      x *= viewport.zoom;
      y *= viewport.zoom;
      width *= viewport.zoom;
      height *= viewport.zoom;

      return { x, y, width, height };
    },
    [items, viewport, mode, groups]
  );

  // Render item
  const renderItem = useCallback(
    (ctx: CanvasRenderingContext2D, item: TimelineItem) => {
      const bounds = getItemBounds(item);
      const { x, y, width, height } = bounds;

      // Skip if item is not visible
      if (
        x + width < 0 ||
        x > ctx.canvas.width ||
        y + height < 0 ||
        y > ctx.canvas.height
      ) {
        return;
      }

      // Set item color
      const itemColor = item.color || theme.colors.primary;
      const isSelected = false; // Will be determined by parent
      const isHovered = hoveredItem?.id === item.id;

      // Draw item background with rounded corners
      ctx.fillStyle = isSelected ? theme.colors.accent : itemColor;
      ctx.beginPath();
      const radius = Math.min(4, height / 4);
      ctx.roundRect(x, y, width, height, radius);
      ctx.fill();

      // Draw item border
      ctx.strokeStyle = isHovered ? theme.colors.accent : theme.colors.border;
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.stroke();

      // Draw item text
      if (width > 20 && height > 20) {
        ctx.fillStyle = theme.colors.text;
        ctx.font = `${theme.typography.fontWeight.medium} ${theme.typography.fontSize.sm}px ${theme.typography.fontFamily}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        const textX = x + 8;
        const textY = y + height / 2;
        const maxWidth = width - 16;

        // Truncate text if too long
        let text = item.title;
        const metrics = ctx.measureText(text);
        if (metrics.width > maxWidth) {
          while (
            ctx.measureText(text + "...").width > maxWidth &&
            text.length > 0
          ) {
            text = text.slice(0, -1);
          }
          text += "...";
        }

        ctx.fillText(text, textX, textY);
      }

      // Draw progress bar if item has progress
      if (item.progress !== undefined && item.progress > 0) {
        const progressWidth = (width * item.progress) / 100;
        ctx.fillStyle = theme.colors.success;
        ctx.fillRect(x, y + height - 3, progressWidth, 3);
      }

      // Draw priority indicator
      if (item.priority === "high" || item.priority === "critical") {
        ctx.fillStyle =
          item.priority === "critical"
            ? theme.colors.error
            : theme.colors.warning;
        ctx.fillRect(x, y, 4, height);
      }

      // Draw drag handles for resizable items
      if (width > 20) {
        ctx.fillStyle = theme.colors.border;
        ctx.fillRect(x + width - 8, y, 4, height);
        ctx.fillRect(x, y + height - 8, width, 4);
      }
    },
    [getItemBounds, theme, hoveredItem]
  );

  // Render grid
  const renderGrid = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!settings.showGrid) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      ctx.strokeStyle = theme.colors.border;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;

      // Draw vertical grid lines
      const gridSize = 50;
      for (let x = 0; x < containerWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, containerHeight);
        ctx.stroke();
      }

      // Draw horizontal grid lines
      for (let y = 0; y < containerHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(containerWidth, y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    },
    [settings, theme]
  );

  // Main render function
  const render = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Set background
    ctx.fillStyle = theme.colors.background;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Render grid
    renderGrid(ctx);

    // Render items
    items.forEach((item) => {
      renderItem(ctx, item);
    });

    setIsRendering(false);
  }, [getContext, theme, renderGrid, renderItem, items]);

  // Throttled render
  const throttledRender = useCallback(() => {
    if (isRendering) return;

    const now = performance.now();
    if (now - lastRenderTimeRef.current < 16) {
      // 60fps
      return;
    }

    lastRenderTimeRef.current = now;
    setIsRendering(true);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(render);
  }, [isRendering, render]);

  // Handle mouse events with drag detection
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [draggedItem, setDraggedItem] = useState<TimelineItem | null>(null);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Find item at position
      const item = items.find((item) => {
        const bounds = getItemBounds(item);
        return (
          x >= bounds.x &&
          x <= bounds.x + bounds.width &&
          y >= bounds.y &&
          y <= bounds.y + bounds.height
        );
      });

      if (item !== hoveredItem) {
        setHoveredItem(item || null);
        onItemHover?.(item || null, event);
      }

      // Handle dragging
      if (isDragging && draggedItem && dragStart) {
        const deltaX = x - dragStart.x;
        const deltaY = y - dragStart.y;

        // Update item position (this would need to be connected to the store)
        // For now, just update the visual position
        canvas.style.cursor = "grabbing";
      }
    },
    [
      items,
      getItemBounds,
      hoveredItem,
      onItemHover,
      isDragging,
      draggedItem,
      dragStart,
    ]
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Find item at position
      const item = items.find((item) => {
        const bounds = getItemBounds(item);
        return (
          x >= bounds.x &&
          x <= bounds.x + bounds.width &&
          y >= bounds.y &&
          y <= bounds.y + bounds.height
        );
      });

      if (item) {
        setIsDragging(true);
        setDragStart({ x, y });
        setDraggedItem(item);
        canvas.style.cursor = "grabbing";
      }
    },
    [items, getItemBounds]
  );

  const handleMouseUp = useCallback(
    (event: React.MouseEvent) => {
      if (isDragging && draggedItem) {
        // End drag operation
        setIsDragging(false);
        setDragStart(null);
        setDraggedItem(null);

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.style.cursor = "grab";
        }
      }
    },
    [isDragging, draggedItem]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (!isDragging) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Find item at position
        const item = items.find((item) => {
          const bounds = getItemBounds(item);
          return (
            x >= bounds.x &&
            x <= bounds.x + bounds.width &&
            y >= bounds.y &&
            y <= bounds.y + bounds.height
          );
        });

        if (item) {
          onItemClick?.(item, event);
        }
      }
    },
    [items, getItemBounds, onItemClick, isDragging]
  );

  // Handle wheel events for zooming
  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault();

      const delta = event.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(10, viewport.zoom * delta));

      if (newZoom !== viewport.zoom) {
        onZoom?.(newZoom, { x: event.clientX, y: event.clientY });
      }
    },
    [viewport.zoom, onZoom]
  );

  // Render when dependencies change
  useEffect(() => {
    throttledRender();
  }, [items, viewport, mode, theme, settings, throttledRender]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Expose methods via ref
  useImperativeHandle(
    ref,
    () => ({
      getCanvas: () => canvasRef.current,
      redraw: throttledRender,
      getItemAtPosition: (x: number, y: number) => {
        return (
          items.find((item) => {
            const bounds = getItemBounds(item);
            return (
              x >= bounds.x &&
              x <= bounds.x + bounds.width &&
              y >= bounds.y &&
              y <= bounds.y + bounds.height
            );
          }) || null
        );
      },
      getViewportBounds: () => {
        const container = containerRef.current;
        if (!container) return { x: 0, y: 0, width: 0, height: 0 };

        const rect = container.getBoundingClientRect();
        return { x: 0, y: 0, width: rect.width, height: rect.height };
      },
      exportToImage: (format: "png" | "jpeg" | "webp" = "png") => {
        const canvas = canvasRef.current;
        if (!canvas) return "";

        const mimeType = `image/${format}`;
        return canvas.toDataURL(mimeType, 0.9);
      },
    }),
    [throttledRender, items, getItemBounds]
  );

  // Get CSS classes
  const classes = timelineStyles.getTimelineClasses();

  return (
    <div
      ref={containerRef}
      className={`${classes.canvas} ${className || ""}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
        style={{
          width: "100%",
          height: "100%",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      />
    </div>
  );
});

// Export default
export default TimelineCanvas;
