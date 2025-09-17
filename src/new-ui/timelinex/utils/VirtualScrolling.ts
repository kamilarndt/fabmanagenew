// TimelineX Virtual Scrolling
// Handles virtual scrolling for large datasets

import { TimelineItem, TimelineGroup } from '../types';

export interface VirtualScrollConfig {
  itemHeight: number;
  groupHeight: number;
  containerHeight: number;
  overscan: number; // Number of items to render outside visible area
  bufferSize: number; // Number of items to keep in buffer
}

export interface VirtualScrollState {
  scrollTop: number;
  scrollLeft: number;
  visibleStartIndex: number;
  visibleEndIndex: number;
  totalHeight: number;
  totalWidth: number;
}

export interface VirtualScrollItem {
  index: number;
  item: TimelineItem;
  group?: TimelineGroup;
  top: number;
  height: number;
  visible: boolean;
}

export class VirtualScrolling {
  private config: VirtualScrollConfig;
  private state: VirtualScrollState;
  private items: TimelineItem[] = [];
  private groups: TimelineGroup[] = [];
  private flatItems: VirtualScrollItem[] = [];
  private groupMap: Map<string, TimelineGroup> = new Map();

  constructor(config: VirtualScrollConfig) {
    this.config = config;
    this.state = {
      scrollTop: 0,
      scrollLeft: 0,
      visibleStartIndex: 0,
      visibleEndIndex: 0,
      totalHeight: 0,
      totalWidth: 0,
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<VirtualScrollConfig>): void {
    this.config = { ...this.config, ...config };
    this.recalculate();
  }

  /**
   * Set items and groups
   */
  setData(items: TimelineItem[], groups: TimelineGroup[] = []): void {
    this.items = items;
    this.groups = groups;
    this.groupMap = new Map(groups.map(group => [group.id, group]));
    this.buildFlatItems();
    this.recalculate();
  }

  /**
   * Update scroll position
   */
  setScrollPosition(scrollTop: number, scrollLeft: number = 0): void {
    this.state.scrollTop = scrollTop;
    this.state.scrollLeft = scrollLeft;
    this.updateVisibleRange();
  }

  /**
   * Get current scroll state
   */
  getScrollState(): VirtualScrollState {
    return { ...this.state };
  }

  /**
   * Get visible items
   */
  getVisibleItems(): VirtualScrollItem[] {
    return this.flatItems.filter(item => item.visible);
  }

  /**
   * Get all items (including non-visible)
   */
  getAllItems(): VirtualScrollItem[] {
    return this.flatItems;
  }

  /**
   * Get total height
   */
  getTotalHeight(): number {
    return this.state.totalHeight;
  }

  /**
   * Get total width
   */
  getTotalWidth(): number {
    return this.state.totalWidth;
  }

  /**
   * Scroll to a specific item
   */
  scrollToItem(itemId: string): void {
    const itemIndex = this.flatItems.findIndex(item => item.item.id === itemId);
    if (itemIndex === -1) return;

    const item = this.flatItems[itemIndex];
    const scrollTop = item.top - this.config.overscan * this.config.itemHeight;
    
    this.setScrollPosition(Math.max(0, scrollTop));
  }

  /**
   * Scroll to a specific group
   */
  scrollToGroup(groupId: string): void {
    const groupIndex = this.flatItems.findIndex(item => item.group?.id === groupId);
    if (groupIndex === -1) return;

    const item = this.flatItems[groupIndex];
    const scrollTop = item.top - this.config.overscan * this.config.groupHeight;
    
    this.setScrollPosition(Math.max(0, scrollTop));
  }

  /**
   * Get item at a specific position
   */
  getItemAtPosition(x: number, y: number): VirtualScrollItem | null {
    const scrollY = y + this.state.scrollTop;
    
    for (const item of this.flatItems) {
      if (scrollY >= item.top && scrollY <= item.top + item.height) {
        return item;
      }
    }
    
    return null;
  }

  /**
   * Get items in a specific range
   */
  getItemsInRange(startY: number, endY: number): VirtualScrollItem[] {
    const scrollStartY = startY + this.state.scrollTop;
    const scrollEndY = endY + this.state.scrollTop;
    
    return this.flatItems.filter(item => 
      item.top < scrollEndY && item.top + item.height > scrollStartY
    );
  }

  /**
   * Build flat items array from items and groups
   */
  private buildFlatItems(): void {
    this.flatItems = [];
    let currentTop = 0;

    // Group items by their group
    const itemsByGroup = new Map<string, TimelineItem[]>();
    const ungroupedItems: TimelineItem[] = [];

    for (const item of this.items) {
      if (item.group) {
        if (!itemsByGroup.has(item.group)) {
          itemsByGroup.set(item.group, []);
        }
        itemsByGroup.get(item.group)!.push(item);
      } else {
        ungroupedItems.push(item);
      }
    }

    // Add groups and their items
    for (const group of this.groups) {
      const groupItems = itemsByGroup.get(group.id) || [];
      
      // Add group header
      this.flatItems.push({
        index: this.flatItems.length,
        item: {
          id: `group-${group.id}`,
          title: group.title as string,
          start: new Date(),
          end: new Date(),
          isGroup: true,
        } as TimelineItem,
        group,
        top: currentTop,
        height: this.config.groupHeight,
        visible: false,
      });
      
      currentTop += this.config.groupHeight;

      // Add group items
      for (let i = 0; i < groupItems.length; i++) {
        const item = groupItems[i];
        this.flatItems.push({
          index: this.flatItems.length,
          item,
          group,
          top: currentTop,
          height: this.config.itemHeight,
          visible: false,
        });
        currentTop += this.config.itemHeight;
      }
    }

    // Add ungrouped items
    for (let i = 0; i < ungroupedItems.length; i++) {
      const item = ungroupedItems[i];
      this.flatItems.push({
        index: this.flatItems.length,
        item,
        top: currentTop,
        height: this.config.itemHeight,
        visible: false,
      });
      currentTop += this.config.itemHeight;
    }

    this.state.totalHeight = currentTop;
  }

  /**
   * Recalculate virtual scroll state
   */
  private recalculate(): void {
    this.buildFlatItems();
    this.updateVisibleRange();
  }

  /**
   * Update visible range based on scroll position
   */
  private updateVisibleRange(): void {
    const { scrollTop, scrollLeft } = this.state;
    const { containerHeight, overscan } = this.config;

    // Calculate visible range
    const visibleStart = Math.max(0, scrollTop - overscan * this.config.itemHeight);
    const visibleEnd = scrollTop + containerHeight + overscan * this.config.itemHeight;

    // Find start and end indices
    let startIndex = 0;
    let endIndex = this.flatItems.length - 1;

    for (let i = 0; i < this.flatItems.length; i++) {
      const item = this.flatItems[i];
      if (item.top + item.height >= visibleStart) {
        startIndex = Math.max(0, i - overscan);
        break;
      }
    }

    for (let i = startIndex; i < this.flatItems.length; i++) {
      const item = this.flatItems[i];
      if (item.top > visibleEnd) {
        endIndex = Math.min(this.flatItems.length - 1, i + overscan);
        break;
      }
    }

    this.state.visibleStartIndex = startIndex;
    this.state.visibleEndIndex = endIndex;

    // Update visibility
    for (let i = 0; i < this.flatItems.length; i++) {
      this.flatItems[i].visible = i >= startIndex && i <= endIndex;
    }
  }

  /**
   * Get scroll position for a specific item
   */
  getScrollPositionForItem(itemIndex: number): number {
    if (itemIndex < 0 || itemIndex >= this.flatItems.length) {
      return 0;
    }

    return this.flatItems[itemIndex].top;
  }

  /**
   * Get scroll position for a specific group
   */
  getScrollPositionForGroup(groupId: string): number {
    const groupIndex = this.flatItems.findIndex(item => item.group?.id === groupId);
    if (groupIndex === -1) return 0;

    return this.getScrollPositionForItem(groupIndex);
  }

  /**
   * Check if an item is visible
   */
  isItemVisible(itemIndex: number): boolean {
    if (itemIndex < 0 || itemIndex >= this.flatItems.length) {
      return false;
    }

    return this.flatItems[itemIndex].visible;
  }

  /**
   * Get the number of visible items
   */
  getVisibleItemCount(): number {
    return this.state.visibleEndIndex - this.state.visibleStartIndex + 1;
  }

  /**
   * Get the total number of items
   */
  getTotalItemCount(): number {
    return this.flatItems.length;
  }

  /**
   * Get scroll metrics
   */
  getScrollMetrics(): {
    scrollTop: number;
    scrollLeft: number;
    scrollHeight: number;
    scrollWidth: number;
    clientHeight: number;
    clientWidth: number;
  } {
    return {
      scrollTop: this.state.scrollTop,
      scrollLeft: this.state.scrollLeft,
      scrollHeight: this.state.totalHeight,
      scrollWidth: this.state.totalWidth,
      clientHeight: this.config.containerHeight,
      clientWidth: 0, // This would be set based on container width
    };
  }

  /**
   * Reset scroll position
   */
  reset(): void {
    this.state.scrollTop = 0;
    this.state.scrollLeft = 0;
    this.updateVisibleRange();
  }

  /**
   * Destroy the virtual scrolling instance
   */
  destroy(): void {
    this.items = [];
    this.groups = [];
    this.flatItems = [];
    this.groupMap.clear();
  }
}
