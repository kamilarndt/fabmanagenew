// TimelineX Zoom Manager
// Handles zoom operations and viewport management

import { TimelineItem, TimelineMode } from '../types';

export interface ZoomLevel {
  level: number;
  name: string;
  millisecondsPerPixel: number;
  snapInterval: number;
}

export interface Viewport {
  start: Date;
  end: Date;
  zoom: number;
  pan: { x: number; y: number };
}

export class ZoomManager {
  private static readonly ZOOM_LEVELS: ZoomLevel[] = [
    { level: 0.1, name: 'Years', millisecondsPerPixel: 365 * 24 * 60 * 60 * 1000, snapInterval: 365 * 24 * 60 * 60 * 1000 },
    { level: 0.2, name: 'Months', millisecondsPerPixel: 30 * 24 * 60 * 60 * 1000, snapInterval: 30 * 24 * 60 * 60 * 1000 },
    { level: 0.5, name: 'Weeks', millisecondsPerPixel: 7 * 24 * 60 * 60 * 1000, snapInterval: 7 * 24 * 60 * 60 * 1000 },
    { level: 1, name: 'Days', millisecondsPerPixel: 24 * 60 * 60 * 1000, snapInterval: 24 * 60 * 60 * 1000 },
    { level: 2, name: 'Hours', millisecondsPerPixel: 60 * 60 * 1000, snapInterval: 60 * 60 * 1000 },
    { level: 5, name: 'Minutes', millisecondsPerPixel: 60 * 1000, snapInterval: 15 * 60 * 1000 },
    { level: 10, name: 'Seconds', millisecondsPerPixel: 1000, snapInterval: 60 * 1000 },
    { level: 20, name: 'Milliseconds', millisecondsPerPixel: 100, snapInterval: 1000 },
  ];

  private currentZoomLevel: number = 1;
  private viewport: Viewport;
  private containerWidth: number = 800;
  private containerHeight: number = 600;

  constructor(viewport: Viewport, containerWidth: number = 800, containerHeight: number = 600) {
    this.viewport = viewport;
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
  }

  /**
   * Get the current zoom level
   */
  getZoomLevel(): number {
    return this.currentZoomLevel;
  }

  /**
   * Get the current viewport
   */
  getViewport(): Viewport {
    return { ...this.viewport };
  }

  /**
   * Set the container dimensions
   */
  setContainerDimensions(width: number, height: number): void {
    this.containerWidth = width;
    this.containerHeight = height;
  }

  /**
   * Get the current zoom level info
   */
  getCurrentZoomInfo(): ZoomLevel {
    return this.getZoomLevelInfo(this.currentZoomLevel);
  }

  /**
   * Get zoom level info by level
   */
  getZoomLevelInfo(level: number): ZoomLevel {
    const sortedLevels = [...ZoomManager.ZOOM_LEVELS].sort((a, b) => a.level - b.level);
    
    for (let i = 0; i < sortedLevels.length; i++) {
      if (level <= sortedLevels[i].level) {
        return sortedLevels[i];
      }
    }
    
    return sortedLevels[sortedLevels.length - 1];
  }

  /**
   * Get all available zoom levels
   */
  getAvailableZoomLevels(): ZoomLevel[] {
    return [...ZoomManager.ZOOM_LEVELS];
  }

  /**
   * Zoom in by a factor
   */
  zoomIn(factor: number = 1.2): Viewport {
    const newZoom = Math.min(this.currentZoomLevel * factor, 20);
    return this.setZoom(newZoom);
  }

  /**
   * Zoom out by a factor
   */
  zoomOut(factor: number = 1.2): Viewport {
    const newZoom = Math.max(this.currentZoomLevel / factor, 0.1);
    return this.setZoom(newZoom);
  }

  /**
   * Set zoom to a specific level
   */
  setZoom(zoom: number): Viewport {
    const oldZoom = this.currentZoomLevel;
    this.currentZoomLevel = Math.max(0.1, Math.min(20, zoom));
    
    // Calculate zoom center
    const centerTime = this.viewport.start.getTime() + 
      (this.viewport.end.getTime() - this.viewport.start.getTime()) / 2;
    
    // Calculate new viewport based on zoom
    const zoomFactor = this.currentZoomLevel / oldZoom;
    const currentDuration = this.viewport.end.getTime() - this.viewport.start.getTime();
    const newDuration = currentDuration / zoomFactor;
    
    const newStart = new Date(centerTime - newDuration / 2);
    const newEnd = new Date(centerTime + newDuration / 2);
    
    this.viewport = {
      ...this.viewport,
      start: newStart,
      end: newEnd,
      zoom: this.currentZoomLevel,
    };
    
    return this.getViewport();
  }

  /**
   * Zoom to fit all items
   */
  zoomToFit(items: TimelineItem[], padding: number = 0.1): Viewport {
    if (items.length === 0) {
      return this.getViewport();
    }

    const startTimes = items.map(item => item.start.getTime());
    const endTimes = items.map(item => (item.end || item.start).getTime());
    
    const minTime = Math.min(...startTimes);
    const maxTime = Math.max(...endTimes);
    
    const totalDuration = maxTime - minTime;
    const paddingDuration = totalDuration * padding;
    
    const newStart = new Date(minTime - paddingDuration);
    const newEnd = new Date(maxTime + paddingDuration);
    
    // Calculate appropriate zoom level
    const availableWidth = this.containerWidth * 0.9; // Leave some margin
    const millisecondsPerPixel = (newEnd.getTime() - newStart.getTime()) / availableWidth;
    
    // Find the closest zoom level
    const targetZoom = this.findZoomLevelForMillisecondsPerPixel(millisecondsPerPixel);
    
    this.viewport = {
      start: newStart,
      end: newEnd,
      zoom: targetZoom,
      pan: { x: 0, y: 0 },
    };
    
    this.currentZoomLevel = targetZoom;
    
    return this.getViewport();
  }

  /**
   * Pan the viewport by a delta
   */
  pan(deltaX: number, deltaY: number): Viewport {
    const zoomInfo = this.getCurrentZoomInfo();
    const timeDelta = deltaX * zoomInfo.millisecondsPerPixel;
    
    const newStart = new Date(this.viewport.start.getTime() - timeDelta);
    const newEnd = new Date(this.viewport.end.getTime() - timeDelta);
    
    this.viewport = {
      ...this.viewport,
      start: newStart,
      end: newEnd,
      pan: {
        x: this.viewport.pan.x + deltaX,
        y: this.viewport.pan.y + deltaY,
      },
    };
    
    return this.getViewport();
  }

  /**
   * Pan to a specific time
   */
  panToTime(time: Date): Viewport {
    const currentDuration = this.viewport.end.getTime() - this.viewport.start.getTime();
    const newStart = new Date(time.getTime() - currentDuration / 2);
    const newEnd = new Date(time.getTime() + currentDuration / 2);
    
    this.viewport = {
      ...this.viewport,
      start: newStart,
      end: newEnd,
    };
    
    return this.getViewport();
  }

  /**
   * Set viewport to a specific time range
   */
  setViewport(start: Date, end: Date): Viewport {
    this.viewport = {
      ...this.viewport,
      start,
      end,
    };
    
    return this.getViewport();
  }

  /**
   * Convert pixel coordinates to time
   */
  pixelToTime(x: number, y: number): Date {
    const zoomInfo = this.getCurrentZoomInfo();
    const timeOffset = x * zoomInfo.millisecondsPerPixel;
    return new Date(this.viewport.start.getTime() + timeOffset);
  }

  /**
   * Convert time to pixel coordinates
   */
  timeToPixel(time: Date): number {
    const zoomInfo = this.getCurrentZoomInfo();
    const timeOffset = time.getTime() - this.viewport.start.getTime();
    return timeOffset / zoomInfo.millisecondsPerPixel;
  }

  /**
   * Get the visible time range
   */
  getVisibleTimeRange(): { start: Date; end: Date; duration: number } {
    const duration = this.viewport.end.getTime() - this.viewport.start.getTime();
    return {
      start: this.viewport.start,
      end: this.viewport.end,
      duration,
    };
  }

  /**
   * Check if a time is visible in the current viewport
   */
  isTimeVisible(time: Date): boolean {
    return time.getTime() >= this.viewport.start.getTime() && 
           time.getTime() <= this.viewport.end.getTime();
  }

  /**
   * Check if an item is visible in the current viewport
   */
  isItemVisible(item: TimelineItem): boolean {
    const itemStart = item.start.getTime();
    const itemEnd = (item.end || item.start).getTime();
    const viewportStart = this.viewport.start.getTime();
    const viewportEnd = this.viewport.end.getTime();
    
    return itemStart <= viewportEnd && itemEnd >= viewportStart;
  }

  /**
   * Get the snap interval for the current zoom level
   */
  getSnapInterval(): number {
    return this.getCurrentZoomInfo().snapInterval;
  }

  /**
   * Snap a time to the current snap interval
   */
  snapTime(time: Date): Date {
    const snapInterval = this.getSnapInterval();
    const snappedTime = Math.round(time.getTime() / snapInterval) * snapInterval;
    return new Date(snappedTime);
  }

  /**
   * Find the appropriate zoom level for a given milliseconds per pixel ratio
   */
  private findZoomLevelForMillisecondsPerPixel(millisecondsPerPixel: number): number {
    const sortedLevels = [...ZoomManager.ZOOM_LEVELS].sort((a, b) => a.millisecondsPerPixel - b.millisecondsPerPixel);
    
    for (let i = 0; i < sortedLevels.length; i++) {
      if (millisecondsPerPixel >= sortedLevels[i].millisecondsPerPixel) {
        return sortedLevels[i].level;
      }
    }
    
    return sortedLevels[sortedLevels.length - 1].level;
  }

  /**
   * Calculate item bounds for rendering
   */
  calculateItemBounds(
    item: TimelineItem,
    mode: TimelineMode,
    itemIndex: number = 0
  ): { x: number; y: number; width: number; height: number } {
    const itemStart = item.start.getTime();
    const itemEnd = (item.end || item.start).getTime();
    const itemDuration = itemEnd - itemStart;
    
    let x = this.timeToPixel(item.start);
    let width = this.timeToPixel(new Date(itemEnd)) - x;
    
    let y = 0;
    let height = 32;
    
    switch (mode) {
      case 'horizontal':
        y = itemIndex * 40; // 40px per item row
        height = 32;
        break;
      case 'vertical':
        y = x;
        x = itemIndex * 200; // 200px per item column
        height = width;
        width = 200;
        break;
      case 'alternating':
        const isEven = itemIndex % 2 === 0;
        y = x;
        x = isEven ? 0 : this.containerWidth / 2;
        height = width;
        width = this.containerWidth / 2;
        break;
      case 'spiral':
      case 'circular':
        const centerX = this.containerWidth / 2;
        const centerY = this.containerHeight / 2;
        const radius = Math.min(this.containerWidth, this.containerHeight) / 4;
        const angle = (itemStart - this.viewport.start.getTime()) / 
          (this.viewport.end.getTime() - this.viewport.start.getTime()) * Math.PI * 2;
        y = centerY + Math.sin(angle) * radius - 16;
        x = centerX + Math.cos(angle) * radius - 16;
        width = 32;
        height = 32;
        break;
      case 'gantt':
        y = itemIndex * 28; // 28px per item row
        height = 24;
        break;
      case 'calendar':
        y = itemIndex * 24; // 24px per item row
        height = 20;
        break;
      case 'masonry':
        y = x;
        x = 0;
        height = width;
        width = this.containerWidth;
        break;
    }
    
    return { x, y, width, height };
  }

  /**
   * Reset viewport to default
   */
  reset(): Viewport {
    this.currentZoomLevel = 1;
    this.viewport = {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      zoom: 1,
      pan: { x: 0, y: 0 },
    };
    
    return this.getViewport();
  }
}
