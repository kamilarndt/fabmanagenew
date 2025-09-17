// TimelineX useTimeline Hook
// Main hook for timeline functionality

import { useCallback, useMemo } from 'react';
import { useTimelineStore } from '../stores/timelineStore';
import { TimelineItem, TimelineGroup, TimelineEvent, TimelineFilters, TimelineSort, TimelineSettings, UseTimelineReturn } from '../types';

export function useTimeline(): UseTimelineReturn {
  const store = useTimelineStore();
  
  // Actions
  const actions = useMemo(() => ({
    setItems: store.setItems,
    addItem: store.addItem,
    updateItem: store.updateItem,
    removeItem: store.removeItem,
    setGroups: store.setGroups,
    addGroup: store.addGroup,
    updateGroup: store.updateGroup,
    removeGroup: store.removeGroup,
    selectItem: store.selectItem,
    selectItems: store.selectItems,
    deselectItem: store.deselectItem,
    deselectAll: store.deselectAll,
    setViewport: store.setViewport,
    setMode: store.setMode,
    setTheme: store.setTheme,
    setSettings: store.setSettings,
    setFilters: store.setFilters,
    setSort: store.setSort,
    zoomIn: store.zoomIn,
    zoomOut: store.zoomOut,
    zoomToFit: store.zoomToFit,
    zoomToItem: store.zoomToItem,
    panTo: store.panTo,
    panBy: store.panBy,
    resetView: store.resetView,
    // export: store.export, // These methods don't exist in the store
    // import: store.import,
    undo: store.undo,
    redo: store.redo,
    clearHistory: store.clearHistory,
  }), [store]);
  
  // Utility functions
  const utils = useMemo(() => ({
    getItemById: store.getItemById,
    getGroupById: store.getGroupById,
    getVisibleItems: store.getVisibleItems,
    getSelectedItems: store.getSelectedItems,
    getItemsInRange: store.getItemsInRange,
    getItemsInGroup: store.getItemsInGroup,
    getItemBounds: (item: TimelineItem) => {
      // This would be implemented based on the actual rendering logic
      // For now, return a placeholder
      return { x: 0, y: 0, width: 100, height: 32 };
    },
    getViewportBounds: () => {
      // This would be implemented based on the actual viewport
      // For now, return a placeholder
      return { x: 0, y: 0, width: 800, height: 600 };
    },
    isItemVisible: store.isItemVisible,
    isItemSelected: store.isItemSelected,
    canEditItem: store.canEditItem,
    canDeleteItem: store.canDeleteItem,
    formatDate: (date: Date, format?: string) => {
      if (format === 'iso') {
        return date.toISOString();
      }
      if (format === 'short') {
        return date.toLocaleDateString();
      }
      if (format === 'long') {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      return date.toString();
    },
    parseDate: (dateString: string) => {
      return new Date(dateString);
    },
    calculateDuration: (start: Date, end: Date) => {
      return end.getTime() - start.getTime();
    },
    calculateOverlap: (item1: TimelineItem, item2: TimelineItem) => {
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
    },
    sortItems: (items: TimelineItem[], sort: TimelineSort) => {
      return [...items].sort((a, b) => {
        let aValue: any;
        let bValue: any;
        
        switch (sort.field) {
          case 'start':
            aValue = a.start.getTime();
            bValue = b.start.getTime();
            break;
          case 'end':
            aValue = (a.end || a.start).getTime();
            bValue = (b.end || b.start).getTime();
            break;
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'priority':
            const priorityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
            aValue = priorityOrder[a.priority || 'medium'];
            bValue = priorityOrder[b.priority || 'medium'];
            break;
          case 'status':
            const statusOrder = { pending: 0, 'in-progress': 1, completed: 2, cancelled: 3 };
            aValue = statusOrder[a.status || 'pending'];
            bValue = statusOrder[b.status || 'pending'];
            break;
          default:
            aValue = a[sort.field as keyof TimelineItem];
            bValue = b[sort.field as keyof TimelineItem];
        }
        
        if (aValue < bValue) {
          return sort.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sort.direction === 'asc' ? 1 : -1;
        }
        
        // Secondary sort
        if (sort.secondary) {
          let aSecondaryValue: any;
          let bSecondaryValue: any;
          
          switch (sort.secondary.field) {
            case 'start':
              aSecondaryValue = a.start.getTime();
              bSecondaryValue = b.start.getTime();
              break;
            case 'title':
              aSecondaryValue = a.title.toLowerCase();
              bSecondaryValue = b.title.toLowerCase();
              break;
            default:
              aSecondaryValue = a[sort.secondary.field as keyof TimelineItem];
              bSecondaryValue = b[sort.secondary.field as keyof TimelineItem];
          }
          
          if (aSecondaryValue < bSecondaryValue) {
            return sort.secondary.direction === 'asc' ? -1 : 1;
          }
          if (aSecondaryValue > bSecondaryValue) {
            return sort.secondary.direction === 'asc' ? 1 : -1;
          }
        }
        
        return 0;
      });
    },
    filterItems: (items: TimelineItem[], filters: TimelineFilters) => {
      return items.filter(item => {
        // Search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(searchLower);
          const matchesDescription = item.description?.toLowerCase().includes(searchLower);
          const matchesTags = item.tags?.some(tag => tag.toLowerCase().includes(searchLower));
          
          if (!matchesTitle && !matchesDescription && !matchesTags) {
            return false;
          }
        }
        
        // Date range filter
        if (filters.dateRange.start || filters.dateRange.end) {
          const itemStart = item.start.getTime();
          const itemEnd = (item.end || item.start).getTime();
          
          if (filters.dateRange.start && itemEnd < filters.dateRange.start.getTime()) {
            return false;
          }
          if (filters.dateRange.end && itemStart > filters.dateRange.end.getTime()) {
            return false;
          }
        }
        
        // Group filter
        if (filters.groups.length > 0) {
          if (!item.group || !filters.groups.includes(item.group)) {
            return false;
          }
        }
        
        // Type filter
        if (filters.types.length > 0) {
          if (!item.type || !filters.types.includes(item.type)) {
            return false;
          }
        }
        
        // Status filter
        if (filters.statuses.length > 0) {
          if (!item.status || !filters.statuses.includes(item.status)) {
            return false;
          }
        }
        
        // Priority filter
        if (filters.priorities.length > 0) {
          if (!item.priority || !filters.priorities.includes(item.priority)) {
            return false;
          }
        }
        
        // Tags filter
        if (filters.tags.length > 0) {
          if (!item.tags || !item.tags.some(tag => filters.tags.includes(tag))) {
            return false;
          }
        }
        
        // Assignee filter
        if (filters.assignees.length > 0) {
          if (!item.assignee || !filters.assignees.includes(item.assignee)) {
            return false;
          }
        }
        
        // Custom filters
        for (const [key, value] of Object.entries(filters.custom)) {
          if (item.metadata?.[key] !== value) {
            return false;
          }
        }
        
        return true;
      });
    },
  }), [store]);
  
  return {
    state: store,
    actions: {
      ...actions,
      export: () => {}, // Placeholder
      import: () => {}, // Placeholder
    },
    utils,
  };
}
