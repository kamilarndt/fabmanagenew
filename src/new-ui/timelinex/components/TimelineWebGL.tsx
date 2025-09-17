/**
 * WebGL-enabled Timeline Component
 * Provides hardware-accelerated rendering with smooth animations
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { WebGLRenderer, type WebGLRendererOptions } from '../renderers/WebGLRenderer';
import type { TimelineItem, TimelineGroup, TimelineViewport, TimelineTheme } from '../types';

export interface TimelineWebGLProps {
  items: TimelineItem[];
  groups: TimelineGroup[];
  viewport: TimelineViewport;
  theme: TimelineTheme;
  width: number;
  height: number;
  onItemClick?: (item: TimelineItem, event: MouseEvent) => void;
  onItemDoubleClick?: (item: TimelineItem, event: MouseEvent) => void;
  onItemDrag?: (item: TimelineItem, deltaX: number, deltaY: number) => void;
  onViewportChange?: (viewport: TimelineViewport) => void;
  enableAnimations?: boolean;
  animationSpeed?: number;
  webglOptions?: WebGLRendererOptions;
  className?: string;
  style?: React.CSSProperties;
}

export const TimelineWebGL: React.FC<TimelineWebGLProps> = ({
  items,
  groups,
  viewport,
  theme,
  width,
  height,
  onItemClick,
  onItemDoubleClick,
  onItemDrag,
  onViewportChange,
  enableAnimations = true,
  animationSpeed = 1.0,
  webglOptions = {},
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize WebGL renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const renderer = new WebGLRenderer(canvas, {
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        ...webglOptions,
      });

      rendererRef.current = renderer;
      setIsWebGLSupported(true);
      setIsInitialized(true);
      setError(null);

      // Start animations if enabled
      if (enableAnimations) {
        renderer.startAnimation();
      }

      return () => {
        renderer.dispose();
        rendererRef.current = null;
      };
    } catch (err) {
      console.warn('WebGL not supported, falling back to Canvas:', err);
      setError(err instanceof Error ? err.message : 'WebGL initialization failed');
      setIsWebGLSupported(false);
    }
  }, [enableAnimations, webglOptions]);

  // Update renderer state when props change
  useEffect(() => {
    if (!rendererRef.current || !isInitialized) return;

    rendererRef.current.updateState({
      items,
      groups,
      viewport,
      theme,
    });
  }, [items, groups, viewport, theme, isInitialized]);

  // Handle canvas resize
  useEffect(() => {
    if (!rendererRef.current || !isInitialized) return;

    rendererRef.current.resize(width, height);
  }, [width, height, isInitialized]);

  // Handle mouse events for item interaction
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!rendererRef.current || !onItemClick) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert screen coordinates to timeline coordinates
    const timelineX = (x / width) * (viewport.end - viewport.start) + viewport.start;
    const timelineY = (y / height) * groups.length * 30; // Assuming 30px per lane

    // Find clicked item
    const clickedItem = items.find(item => {
      const itemStart = item.start;
      const itemEnd = item.end;
      const itemLane = item.lane || 0;
      const laneY = itemLane * 30;

      return (
        timelineX >= itemStart &&
        timelineX <= itemEnd &&
        timelineY >= laneY &&
        timelineY <= laneY + 20
      );
    });

    if (clickedItem) {
      onItemClick(clickedItem, event.nativeEvent);
    }
  }, [items, groups, viewport, width, height, onItemClick]);

  const handleDoubleClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!rendererRef.current || !onItemDoubleClick) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert screen coordinates to timeline coordinates
    const timelineX = (x / width) * (viewport.end - viewport.start) + viewport.start;
    const timelineY = (y / height) * groups.length * 30;

    // Find double-clicked item
    const clickedItem = items.find(item => {
      const itemStart = item.start;
      const itemEnd = item.end;
      const itemLane = item.lane || 0;
      const laneY = itemLane * 30;

      return (
        timelineX >= itemStart &&
        timelineX <= itemEnd &&
        timelineY >= laneY &&
        timelineY <= laneY + 20
      );
    });

    if (clickedItem) {
      onItemDoubleClick(clickedItem, event.nativeEvent);
    }
  }, [items, groups, viewport, width, height, onItemDoubleClick]);

  // Handle wheel events for zooming
  const handleWheel = useCallback((event: React.WheelEvent<HTMLCanvasElement>) => {
    if (!onViewportChange) return;

    event.preventDefault();

    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(10, viewport.zoom * delta));

    onViewportChange({
      ...viewport,
      zoom: newZoom,
    });
  }, [viewport, onViewportChange]);

  // Handle keyboard events
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (!onViewportChange) return;

    const panAmount = 50 / viewport.zoom;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        onViewportChange({
          ...viewport,
          start: viewport.start - panAmount,
          end: viewport.end - panAmount,
        });
        break;
      case 'ArrowRight':
        event.preventDefault();
        onViewportChange({
          ...viewport,
          start: viewport.start + panAmount,
          end: viewport.end + panAmount,
        });
        break;
      case '+':
      case '=':
        event.preventDefault();
        onViewportChange({
          ...viewport,
          zoom: Math.min(10, viewport.zoom * 1.1),
        });
        break;
      case '-':
        event.preventDefault();
        onViewportChange({
          ...viewport,
          zoom: Math.max(0.1, viewport.zoom * 0.9),
        });
        break;
    }
  }, [viewport, onViewportChange]);

  // Fallback component for when WebGL is not supported
  if (!isWebGLSupported && error) {
    return (
      <div 
        className={`timeline-webgl-fallback ${className || ''}`}
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          ...style,
        }}
      >
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            WebGL Not Supported
          </div>
          <div style={{ fontSize: '12px' }}>
            {error}
          </div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>
            Please use a modern browser with WebGL support
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`timeline-webgl-container ${className || ''}`} style={style}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{
          width: '100%',
          height: '100%',
          outline: 'none',
          cursor: 'grab',
        }}
      />
      
      {/* Performance indicator */}
      {enableAnimations && isWebGLSupported && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
        >
          WebGL {animationSpeed}x
        </div>
      )}
    </div>
  );
};

export default TimelineWebGL;

