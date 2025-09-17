// TimelineX Utility Functions
// Common utility functions for timeline operations

import { TimelineItem, TimelineGroup, TimelineMode } from '../types';

export class TimelineUtils {
  /**
   * Generate a unique ID for timeline items
   */
  static generateId(prefix: string = 'item'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calculate the duration between two dates in milliseconds
   */
  static calculateDuration(start: Date, end: Date): number {
    return end.getTime() - start.getTime();
  }

  /**
   * Calculate the overlap between two timeline items
   */
  static calculateOverlap(item1: TimelineItem, item2: TimelineItem): number {
    const start1 = item1.start.getTime();
    const end1 = (item1.end || item1.start).getTime();
    const start2 = item2.start.getTime();
    const end2 = (item2.end || item2.start).getTime();

    const overlapStart = Math.max(start1, start2);
    const overlapEnd = Math.min(end1, end2);

    if (overlapStart >= overlapEnd) {
      return 0;
    }

    return overlapEnd - overlapStart;
  }

  /**
   * Check if two timeline items overlap
   */
  static itemsOverlap(item1: TimelineItem, item2: TimelineItem): boolean {
    return this.calculateOverlap(item1, item2) > 0;
  }

  /**
   * Find items that overlap with a given item
   */
  static findOverlappingItems(item: TimelineItem, items: TimelineItem[]): TimelineItem[] {
    return items.filter(otherItem => 
      otherItem.id !== item.id && this.itemsOverlap(item, otherItem)
    );
  }

  /**
   * Sort items by start time
   */
  static sortItemsByStart(items: TimelineItem[]): TimelineItem[] {
    return [...items].sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  /**
   * Sort items by end time
   */
  static sortItemsByEnd(items: TimelineItem[]): TimelineItem[] {
    return [...items].sort((a, b) => {
      const endA = (a.end || a.start).getTime();
      const endB = (b.end || b.start).getTime();
      return endA - endB;
    });
  }

  /**
   * Sort items by duration
   */
  static sortItemsByDuration(items: TimelineItem[]): TimelineItem[] {
    return [...items].sort((a, b) => {
      const durationA = this.calculateDuration(a.start, a.end || a.start);
      const durationB = this.calculateDuration(b.start, b.end || b.start);
      return durationA - durationB;
    });
  }

  /**
   * Group items by a specific property
   */
  static groupItemsBy<T extends keyof TimelineItem>(
    items: TimelineItem[],
    property: T
  ): Record<string, TimelineItem[]> {
    return items.reduce((groups, item) => {
      const key = String(item[property] || 'undefined');
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<string, TimelineItem[]>);
  }

  /**
   * Filter items by date range
   */
  static filterItemsByDateRange(
    items: TimelineItem[],
    start: Date,
    end: Date
  ): TimelineItem[] {
    const startTime = start.getTime();
    const endTime = end.getTime();

    return items.filter(item => {
      const itemStart = item.start.getTime();
      const itemEnd = (item.end || item.start).getTime();
      return itemStart <= endTime && itemEnd >= startTime;
    });
  }

  /**
   * Find the earliest start time among items
   */
  static findEarliestStart(items: TimelineItem[]): Date | null {
    if (items.length === 0) return null;
    return new Date(Math.min(...items.map(item => item.start.getTime())));
  }

  /**
   * Find the latest end time among items
   */
  static findLatestEnd(items: TimelineItem[]): Date | null {
    if (items.length === 0) return null;
    return new Date(Math.max(...items.map(item => (item.end || item.start).getTime())));
  }

  /**
   * Calculate the total time span of items
   */
  static calculateTimeSpan(items: TimelineItem[]): { start: Date; end: Date; duration: number } | null {
    const start = this.findEarliestStart(items);
    const end = this.findLatestEnd(items);
    
    if (!start || !end) return null;
    
    return {
      start,
      end,
      duration: this.calculateDuration(start, end),
    };
  }

  /**
   * Format date for display
   */
  static formatDate(date: Date, format: 'short' | 'long' | 'time' | 'datetime' = 'short'): string {
    switch (format) {
      case 'short':
        return date.toLocaleDateString();
      case 'long':
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'time':
        return date.toLocaleTimeString();
      case 'datetime':
        return date.toLocaleString();
      default:
        return date.toString();
    }
  }

  /**
   * Format duration for display
   */
  static formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Calculate item bounds for a specific timeline mode
   */
  static calculateItemBounds(
    item: TimelineItem,
    mode: TimelineMode,
    containerWidth: number,
    containerHeight: number,
    viewportStart: Date,
    viewportEnd: Date
  ): { x: number; y: number; width: number; height: number } {
    const viewportStartTime = viewportStart.getTime();
    const viewportEndTime = viewportEnd.getTime();
    const viewportDuration = viewportEndTime - viewportStartTime;

    const itemStart = item.start.getTime();
    const itemEnd = (item.end || item.start).getTime();
    const itemDuration = itemEnd - itemStart;

    let x = 0;
    let y = 0;
    let width = 0;
    let height = 0;

    switch (mode) {
      case 'horizontal':
        x = ((itemStart - viewportStartTime) / viewportDuration) * containerWidth;
        y = 0; // Will be set by group or item index
        width = (itemDuration / viewportDuration) * containerWidth;
        height = 32;
        break;

      case 'vertical':
        x = 0;
        y = ((itemStart - viewportStartTime) / viewportDuration) * containerHeight;
        width = containerWidth;
        height = (itemDuration / viewportDuration) * containerHeight;
        break;

      case 'alternating':
        // Alternate between left and right
        const itemIndex = 0; // This would be passed as parameter
        const isEven = itemIndex % 2 === 0;
        x = isEven ? 0 : containerWidth / 2;
        y = ((itemStart - viewportStartTime) / viewportDuration) * containerHeight;
        width = containerWidth / 2;
        height = (itemDuration / viewportDuration) * containerHeight;
        break;

      case 'spiral':
      case 'circular':
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        const radius = Math.min(containerWidth, containerHeight) / 4;
        const angle = ((itemStart - viewportStartTime) / viewportDuration) * Math.PI * 2;
        x = centerX + Math.cos(angle) * radius - 16;
        y = centerY + Math.sin(angle) * radius - 16;
        width = 32;
        height = 32;
        break;

      case 'gantt':
        x = ((itemStart - viewportStartTime) / viewportDuration) * containerWidth;
        y = 0; // Will be set by group
        width = (itemDuration / viewportDuration) * containerWidth;
        height = 24;
        break;

      case 'calendar':
        x = ((itemStart - viewportStartTime) / viewportDuration) * containerWidth;
        y = 0; // Will be set by group
        width = (itemDuration / viewportDuration) * containerWidth;
        height = 20;
        break;

      case 'masonry':
        x = 0;
        y = ((itemStart - viewportStartTime) / viewportDuration) * containerHeight;
        width = containerWidth;
        height = (itemDuration / viewportDuration) * containerHeight;
        break;
    }

    return { x, y, width, height };
  }

  /**
   * Check if an item is visible in the current viewport
   */
  static isItemVisible(
    item: TimelineItem,
    viewportStart: Date,
    viewportEnd: Date
  ): boolean {
    const itemStart = item.start.getTime();
    const itemEnd = (item.end || item.start).getTime();
    const viewportStartTime = viewportStart.getTime();
    const viewportEndTime = viewportEnd.getTime();

    return itemStart <= viewportEndTime && itemEnd >= viewportStartTime;
  }

  /**
   * Get items that are visible in the current viewport
   */
  static getVisibleItems(
    items: TimelineItem[],
    viewportStart: Date,
    viewportEnd: Date
  ): TimelineItem[] {
    return items.filter(item => this.isItemVisible(item, viewportStart, viewportEnd));
  }

  /**
   * Calculate the zoom level based on time range
   */
  static calculateZoomLevel(
    viewportStart: Date,
    viewportEnd: Date,
    containerWidth: number
  ): number {
    const viewportDuration = viewportEnd.getTime() - viewportStart.getTime();
    const pixelsPerMillisecond = containerWidth / viewportDuration;
    
    // Base zoom level (1.0) is 1 pixel per minute
    const basePixelsPerMillisecond = 1 / (60 * 1000);
    
    return pixelsPerMillisecond / basePixelsPerMillisecond;
  }

  /**
   * Snap a date to a "nice" time boundary
   */
  static snapToNiceTime(date: Date, zoomLevel: number): Date {
    const time = date.getTime();
    let snapInterval: number;

    if (zoomLevel > 1000) {
      // Very zoomed in - snap to minutes
      snapInterval = 60 * 1000; // 1 minute
    } else if (zoomLevel > 100) {
      // Zoomed in - snap to 5 minutes
      snapInterval = 5 * 60 * 1000; // 5 minutes
    } else if (zoomLevel > 10) {
      // Normal zoom - snap to 15 minutes
      snapInterval = 15 * 60 * 1000; // 15 minutes
    } else if (zoomLevel > 1) {
      // Zoomed out - snap to hours
      snapInterval = 60 * 60 * 1000; // 1 hour
    } else {
      // Very zoomed out - snap to days
      snapInterval = 24 * 60 * 60 * 1000; // 1 day
    }

    return new Date(Math.round(time / snapInterval) * snapInterval);
  }

  /**
   * Validate timeline item data
   */
  static validateItem(item: Partial<TimelineItem>): string[] {
    const errors: string[] = [];

    if (!item.title || item.title.trim() === '') {
      errors.push('Title is required');
    }

    if (!item.start) {
      errors.push('Start date is required');
    }

    if (item.end && item.start && item.end.getTime() < item.start.getTime()) {
      errors.push('End date must be after start date');
    }

    if (item.progress !== undefined && (item.progress < 0 || item.progress > 100)) {
      errors.push('Progress must be between 0 and 100');
    }

    return errors;
  }

  /**
   * Create a deep copy of a timeline item
   */
  static cloneItem(item: TimelineItem): TimelineItem {
    return {
      ...item,
      start: new Date(item.start),
      end: item.end ? new Date(item.end) : undefined,
      metadata: item.metadata ? { ...item.metadata } : undefined,
      media: item.media ? { ...item.media } : undefined,
      dependencies: item.dependencies ? [...item.dependencies] : undefined,
      tags: item.tags ? [...item.tags] : undefined,
    };
  }

  /**
   * Merge timeline items (useful for collaboration)
   */
  static mergeItems(items1: TimelineItem[], items2: TimelineItem[]): TimelineItem[] {
    const merged = [...items1];
    
    for (const item2 of items2) {
      const existingIndex = merged.findIndex(item => item.id === item2.id);
      if (existingIndex >= 0) {
        // Update existing item
        merged[existingIndex] = item2;
      } else {
        // Add new item
        merged.push(item2);
      }
    }
    
    return merged;
  }
}
