// SVG fallback renderer for TimelineX
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  TimelineGroup,
  TimelineItem,
  TimelineMode,
  TimelineSettings,
  TimelineTheme,
  Viewport,
} from "../types";

export interface TimelineSVGProps {
  items: TimelineItem[];
  groups: TimelineGroup[];
  viewport: Viewport;
  mode: TimelineMode;
  theme: TimelineTheme;
  settings: TimelineSettings;
  onItemClick?: (item: TimelineItem, event: React.MouseEvent) => void;
  onItemHover?: (item: TimelineItem | null, event: React.MouseEvent) => void;
  onZoom?: (zoom: number, center?: { x: number; y: number }) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface TimelineSVGRef {
  getSVG: () => SVGElement | null;
  redraw: () => void;
  getItemAtPosition: (x: number, y: number) => TimelineItem | null;
  getViewportBounds: () => {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  exportToSVG: () => string;
}

export const TimelineSVG = forwardRef<TimelineSVGRef, TimelineSVGProps>(
  function TimelineSVG(
    {
      items,
      groups,
      viewport,
      mode,
      theme,
      settings,
      onItemClick,
      onItemHover,
      onZoom,
      className,
      style,
    },
    ref
  ) {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredItem, setHoveredItem] = useState<TimelineItem | null>(null);

    // Calculate item bounds (same logic as Canvas)
    const getItemBounds = useCallback(
      (item: TimelineItem) => {
        const container = containerRef.current;
        if (!container) return { x: 0, y: 0, width: 0, height: 0 };

        const rect = container.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;

        const viewportStart = viewport.start.getTime();
        const viewportEnd = viewport.end.getTime();
        const viewportDuration = viewportEnd - viewportStart;

        const itemStart = item.start.getTime();
        const itemEnd = (item.end || item.start).getTime();

        let x = 0;
        let y = 0;
        let width = 0;
        let height = 0;

        const laneHeight = 44;
        const laneGap = 8;
        const itemHeight = 32;
        const subLaneHeight = 8;

        const groupIndex = item.group
          ? Math.max(
              0,
              groups.findIndex((g) => g.id === item.group)
            )
          : 0;
        const baseLaneY = (laneHeight + laneGap) * groupIndex;

        const overlappingItems = items.filter((otherItem) => {
          if (otherItem.id === item.id || otherItem.group !== item.group)
            return false;
          const otherStart = otherItem.start.getTime();
          const otherEnd = (otherItem.end || otherItem.start).getTime();
          return !(itemEnd <= otherStart || itemStart >= otherEnd);
        });

        const subLaneIndex = overlappingItems.length;
        const laneY = baseLaneY + subLaneIndex * subLaneHeight;

        switch (mode) {
          case "horizontal":
            x =
              ((itemStart - viewportStart) / viewportDuration) * containerWidth;
            y = laneY;
            width = ((itemEnd - itemStart) / viewportDuration) * containerWidth;
            height = Math.min(
              itemHeight,
              laneHeight - subLaneIndex * subLaneHeight - 4
            );
            break;
          case "gantt":
            x =
              ((itemStart - viewportStart) / viewportDuration) * containerWidth;
            y = laneY;
            width = ((itemEnd - itemStart) / viewportDuration) * containerWidth;
            height = Math.min(
              itemHeight,
              laneHeight - subLaneIndex * subLaneHeight - 4
            );
            break;
          case "calendar":
            x =
              ((itemStart - viewportStart) / viewportDuration) * containerWidth;
            y = laneY;
            width = ((itemEnd - itemStart) / viewportDuration) * containerWidth;
            height = Math.min(
              20,
              laneHeight - subLaneIndex * subLaneHeight - 4
            );
            break;
          case "vertical":
            // Vertical timeline layout with proper lane positioning
            x = laneY;
            y =
              ((itemStart - viewportStart) / viewportDuration) *
              containerHeight;
            width = Math.min(
              itemHeight,
              laneHeight - subLaneIndex * subLaneHeight - 4
            );
            height =
              ((itemEnd - itemStart) / viewportDuration) * containerHeight;
            break;
          default:
            x =
              ((itemStart - viewportStart) / viewportDuration) * containerWidth;
            y = laneY;
            width = ((itemEnd - itemStart) / viewportDuration) * containerWidth;
            height = Math.min(
              itemHeight,
              laneHeight - subLaneIndex * subLaneHeight - 4
            );
        }

        x += viewport.pan.x;
        y += viewport.pan.y;
        x *= viewport.zoom;
        y *= viewport.zoom;
        width *= viewport.zoom;
        height *= viewport.zoom;

        return { x, y, width, height };
      },
      [items, viewport, mode, groups]
    );

    // Handle mouse events
    const handleMouseMove = useCallback(
      (event: React.MouseEvent) => {
        const svg = svgRef.current;
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

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
      },
      [items, getItemBounds, hoveredItem, onItemHover]
    );

    const handleClick = useCallback(
      (event: React.MouseEvent) => {
        const svg = svgRef.current;
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

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
      },
      [items, getItemBounds, onItemClick]
    );

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

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        getSVG: () => svgRef.current,
        redraw: () => {
          // SVG redraws automatically, but we can force re-render
          setHoveredItem(null);
        },
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
        exportToSVG: () => {
          const svg = svgRef.current;
          if (!svg) return "";
          return new XMLSerializer().serializeToString(svg);
        },
      }),
      [items, getItemBounds]
    );

    return (
      <div
        ref={containerRef}
        className={`timeline-svg-container ${className || ""}`}
        style={style}
      >
        <svg
          ref={svgRef}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onWheel={handleWheel}
          style={{
            width: "100%",
            height: "100%",
            cursor: "grab",
          }}
        >
          {/* Grid */}
          {settings.showGrid && (
            <defs>
              <pattern
                id="grid"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke={theme.colors.border}
                  strokeWidth="1"
                  opacity="0.3"
                />
              </pattern>
            </defs>
          )}
          {settings.showGrid && (
            <rect width="100%" height="100%" fill="url(#grid)" />
          )}

          {/* Items */}
          {items.map((item) => {
            const bounds = getItemBounds(item);
            const { x, y, width, height } = bounds;
            const isHovered = hoveredItem?.id === item.id;
            const itemColor = item.color || theme.colors.primary;

            return (
              <g key={item.id}>
                {/* Item background */}
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx={Math.min(4, height / 4)}
                  ry={Math.min(4, height / 4)}
                  fill={itemColor}
                  stroke={isHovered ? theme.colors.accent : theme.colors.border}
                  strokeWidth={isHovered ? 2 : 1}
                />

                {/* Item text */}
                {width > 20 && height > 20 && (
                  <text
                    x={x + 8}
                    y={y + height / 2}
                    fontSize={theme.typography.fontSize.sm}
                    fontFamily={theme.typography.fontFamily}
                    fontWeight={theme.typography.fontWeight.medium}
                    fill={theme.colors.text}
                    textAnchor="start"
                    dominantBaseline="middle"
                  >
                    {item.title.length > 20
                      ? item.title.substring(0, 20) + "..."
                      : item.title}
                  </text>
                )}

                {/* Progress bar */}
                {item.progress !== undefined && item.progress > 0 && (
                  <rect
                    x={x}
                    y={y + height - 3}
                    width={(width * item.progress) / 100}
                    height={3}
                    fill={theme.colors.success}
                  />
                )}

                {/* Priority indicator */}
                {(item.priority === "high" || item.priority === "critical") && (
                  <rect
                    x={x}
                    y={y}
                    width={4}
                    height={height}
                    fill={
                      item.priority === "critical"
                        ? theme.colors.error
                        : theme.colors.warning
                    }
                  />
                )}

                {/* Drag handles */}
                {width > 20 && (
                  <>
                    <rect
                      x={x + width - 8}
                      y={y}
                      width={4}
                      height={height}
                      fill={theme.colors.border}
                    />
                    <rect
                      x={x}
                      y={y + height - 8}
                      width={width}
                      height={4}
                      fill={theme.colors.border}
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
);
