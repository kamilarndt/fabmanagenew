// TimelineX Zustand Store
// Centralized state management for TimelineX components

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { timelineTokens } from '../tokens/timeline-tokens';
import {
    Collaborator,
    TimelineEvent,
    TimelineFilters,
    TimelineGroup,
    TimelineItem,
    TimelineMode,
    TimelineSettings,
    TimelineSort,
    TimelineState,
    TimelineTheme
} from '../types';

// Initial state
const initialState: TimelineState = {
  items: [],
  groups: [],
  selectedItems: [],
  selectedGroups: [],
  viewport: {
    start: new Date(),
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    zoom: 1,
    pan: { x: 0, y: 0 },
  },
  mode: 'horizontal',
  theme: {
    colors: {
      primary: timelineTokens.colors.primary[500],
      secondary: timelineTokens.colors.secondary[500],
      background: timelineTokens.colors.timeline.background,
      surface: timelineTokens.colors.timeline.surface,
      text: timelineTokens.colors.timeline.text,
      textSecondary: timelineTokens.colors.timeline.textSecondary,
      border: timelineTokens.colors.timeline.border,
      accent: timelineTokens.colors.timeline.accent,
      success: timelineTokens.colors.success[500],
      warning: timelineTokens.colors.warning[500],
      error: timelineTokens.colors.error[500],
      info: timelineTokens.colors.info[500],
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      xxl: 32,
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    borderRadius: {
      sm: 2,
      md: 4,
      lg: 8,
      xl: 12,
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },
    animations: {
      duration: {
        fast: 150,
        normal: 300,
        slow: 500,
      },
      easing: {
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  isLoading: false,
  isEditing: false,
  isCollaborating: false,
  collaborators: [],
  filters: {
    search: '',
    dateRange: {},
    groups: [],
    types: [],
    statuses: [],
    priorities: [],
    tags: [],
    assignees: [],
    custom: {},
  },
  sort: {
    field: 'start',
    direction: 'asc',
  },
  settings: {
    showGrid: true,
    showLabels: true,
    showTooltips: true,
    showProgress: true,
    showDependencies: true,
    snapToGrid: false,
    snapToItems: true,
    autoFit: true,
    smoothScrolling: true,
    animations: true,
    keyboardNavigation: true,
    touchGestures: true,
    collaboration: false,
    realTimeUpdates: true,
    autoSave: true,
    exportFormats: ['json', 'csv', 'pdf'],
    maxItems: 10000,
    virtualScrolling: true,
    performanceMode: 'auto',
  },
};

// Store interface
interface TimelineStore extends TimelineState {
  // Actions
  setItems: (items: TimelineItem[]) => void;
  addItem: (item: TimelineItem) => void;
  updateItem: (id: string, updates: Partial<TimelineItem>) => void;
  removeItem: (id: string) => void;
  setGroups: (groups: TimelineGroup[]) => void;
  addGroup: (group: TimelineGroup) => void;
  updateGroup: (id: string, updates: Partial<TimelineGroup>) => void;
  removeGroup: (id: string) => void;
  selectItem: (id: string) => void;
  selectItems: (ids: string[]) => void;
  deselectItem: (id: string) => void;
  deselectAll: () => void;
  setViewport: (viewport: Partial<TimelineState['viewport']>) => void;
  setMode: (mode: TimelineMode) => void;
  setTheme: (theme: Partial<TimelineTheme>) => void;
  setSettings: (settings: Partial<TimelineSettings>) => void;
  setFilters: (filters: Partial<TimelineFilters>) => void;
  setSort: (sort: TimelineSort) => void;
  setLoading: (isLoading: boolean) => void;
  setEditing: (isEditing: boolean) => void;
  setCollaborating: (isCollaborating: boolean) => void;
  addCollaborator: (collaborator: Collaborator) => void;
  removeCollaborator: (id: string) => void;
  updateCollaborator: (id: string, updates: Partial<Collaborator>) => void;
  
  // Viewport actions
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  zoomToItem: (itemId: string) => void;
  panTo: (x: number, y: number) => void;
  panBy: (dx: number, dy: number) => void;
  resetView: () => void;
  
  // Utility actions
  getItemById: (id: string) => TimelineItem | undefined;
  getGroupById: (id: string) => TimelineGroup | undefined;
  getVisibleItems: () => TimelineItem[];
  getSelectedItems: () => TimelineItem[];
  getItemsInRange: (start: Date, end: Date) => TimelineItem[];
  getItemsInGroup: (groupId: string) => TimelineItem[];
  isItemVisible: (item: TimelineItem) => boolean;
  isItemSelected: (item: TimelineItem) => boolean;
  canEditItem: (item: TimelineItem) => boolean;
  canDeleteItem: (item: TimelineItem) => boolean;
  
  // Event handling
  emitEvent: (event: Omit<TimelineEvent, 'timestamp'>) => void;
  
  // History management
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  
  // Reset
  reset: () => void;
}

// Create the store
export const useTimelineStore = create<TimelineStore>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,
        
        // Item actions
        setItems: (items) => set((state) => {
          state.items = items;
        }),
        
        addItem: (item) => set((state) => {
          state.items.push(item);
        }),
        
        updateItem: (id, updates) => set((state) => {
          const index = state.items.findIndex((item: TimelineItem) => item.id === id);
          if (index !== -1) {
            Object.assign(state.items[index], updates);
          }
        }),
        
        removeItem: (id) => set((state) => {
          state.items = state.items.filter((item: TimelineItem) => item.id !== id);
          state.selectedItems = state.selectedItems.filter((itemId: string) => itemId !== id);
        }),
        
        // Group actions
        setGroups: (groups) => set((state) => {
          state.groups = groups;
        }),
        
        addGroup: (group) => set((state) => {
          state.groups.push(group);
        }),
        
        updateGroup: (id, updates) => set((state) => {
          const index = state.groups.findIndex((group: TimelineGroup) => group.id === id);
          if (index !== -1) {
            Object.assign(state.groups[index], updates);
          }
        }),
        
        removeGroup: (id) => set((state) => {
          state.groups = state.groups.filter((group: TimelineGroup) => group.id !== id);
          state.selectedGroups = state.selectedGroups.filter((groupId: string) => groupId !== id);
        }),
        
        // Selection actions
        selectItem: (id) => set((state) => {
          if (!state.selectedItems.includes(id)) {
            state.selectedItems.push(id);
          }
        }),
        
        selectItems: (ids) => set((state) => {
          state.selectedItems = [...new Set([...state.selectedItems, ...ids])];
        }),
        
        deselectItem: (id) => set((state) => {
          state.selectedItems = state.selectedItems.filter((itemId: string) => itemId !== id);
        }),
        
        deselectAll: () => set((state) => {
          state.selectedItems = [];
          state.selectedGroups = [];
        }),
        
        // Viewport actions
        setViewport: (viewport) => set((state) => {
          Object.assign(state.viewport, viewport);
        }),
        
        setMode: (mode) => set((state) => {
          state.mode = mode;
        }),
        
        setTheme: (theme) => set((state) => {
          Object.assign(state.theme, theme);
        }),
        
        setSettings: (settings) => set((state) => {
          Object.assign(state.settings, settings);
        }),
        
        setFilters: (filters) => set((state) => {
          Object.assign(state.filters, filters);
        }),
        
        setSort: (sort) => set((state) => {
          state.sort = sort;
        }),
        
        setLoading: (isLoading) => set((state) => {
          state.isLoading = isLoading;
        }),
        
        setEditing: (isEditing) => set((state) => {
          state.isEditing = isEditing;
        }),
        
        setCollaborating: (isCollaborating) => set((state) => {
          state.isCollaborating = isCollaborating;
        }),
        
        // Collaborator actions
        addCollaborator: (collaborator) => set((state) => {
          state.collaborators.push(collaborator);
        }),
        
        removeCollaborator: (id) => set((state) => {
          state.collaborators = state.collaborators.filter((collab: any) => collab.id !== id);
        }),
        
        updateCollaborator: (id, updates) => set((state) => {
          const index = state.collaborators.findIndex((collab: any) => collab.id === id);
          if (index !== -1) {
            Object.assign(state.collaborators[index], updates);
          }
        }),
        
        // Viewport actions
        zoomIn: () => set((state) => {
          const currentZoom = state.viewport.zoom;
          const newZoom = Math.min(currentZoom * 1.2, 10);
          state.viewport.zoom = newZoom;
        }),
        
        zoomOut: () => set((state) => {
          const currentZoom = state.viewport.zoom;
          const newZoom = Math.max(currentZoom / 1.2, 0.1);
          state.viewport.zoom = newZoom;
        }),
        
        zoomToFit: () => set((state) => {
          if (state.items.length === 0) return;
          
          const startTimes = state.items.map((item: TimelineItem) => item.start.getTime());
          const endTimes = state.items.map((item: TimelineItem) => (item.end || item.start).getTime());
          const minTime = Math.min(...startTimes);
          const maxTime = Math.max(...endTimes);
          
          const duration = maxTime - minTime;
          const padding = duration * 0.1; // 10% padding
          
          state.viewport.start = new Date(minTime - padding);
          state.viewport.end = new Date(maxTime + padding);
          state.viewport.zoom = 1;
          state.viewport.pan = { x: 0, y: 0 };
        }),
        
        zoomToItem: (itemId) => set((state) => {
          const item = state.items.find((item: TimelineItem) => item.id === itemId);
          if (!item) return;
          
          const itemStart = item.start.getTime();
          const itemEnd = (item.end || item.start).getTime();
          const duration = itemEnd - itemStart;
          const padding = duration * 0.2; // 20% padding
          
          state.viewport.start = new Date(itemStart - padding);
          state.viewport.end = new Date(itemEnd + padding);
          state.viewport.zoom = 1;
          state.viewport.pan = { x: 0, y: 0 };
        }),
        
        panTo: (x, y) => set((state) => {
          state.viewport.pan = { x, y };
        }),
        
        panBy: (dx, dy) => set((state) => {
          state.viewport.pan.x += dx;
          state.viewport.pan.y += dy;
        }),
        
        resetView: () => set((state) => {
          state.viewport = {
            start: new Date(),
            end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            zoom: 1,
            pan: { x: 0, y: 0 },
          };
        }),
        
        // Utility functions
        getItemById: (id) => {
          return get().items.find(item => item.id === id);
        },
        
        getGroupById: (id) => {
          return get().groups.find(group => group.id === id);
        },
        
        getVisibleItems: () => {
          const { items, viewport, filters } = get();
          let visibleItems = items.filter(item => {
            const itemStart = item.start.getTime();
            const itemEnd = (item.end || item.start).getTime();
            const viewportStart = viewport.start.getTime();
            const viewportEnd = viewport.end.getTime();
            
            return itemStart <= viewportEnd && itemEnd >= viewportStart;
          });
          
          // Apply filters
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            visibleItems = visibleItems.filter(item => 
              item.title.toLowerCase().includes(searchLower) ||
              item.description?.toLowerCase().includes(searchLower)
            );
          }
          
          if (filters.types.length > 0) {
            visibleItems = visibleItems.filter(item => 
              item.type && filters.types.includes(item.type)
            );
          }
          
          if (filters.statuses.length > 0) {
            visibleItems = visibleItems.filter(item => 
              item.status && filters.statuses.includes(item.status)
            );
          }
          
          if (filters.priorities.length > 0) {
            visibleItems = visibleItems.filter(item => 
              item.priority && filters.priorities.includes(item.priority)
            );
          }
          
          return visibleItems;
        },
        
        getSelectedItems: () => {
          const { items, selectedItems } = get();
          return items.filter(item => selectedItems.includes(item.id));
        },
        
        getItemsInRange: (start, end) => {
          const { items } = get();
          const startTime = start.getTime();
          const endTime = end.getTime();
          
          return items.filter(item => {
            const itemStart = item.start.getTime();
            const itemEnd = (item.end || item.start).getTime();
            return itemStart <= endTime && itemEnd >= startTime;
          });
        },
        
        getItemsInGroup: (groupId) => {
          const { items } = get();
          return items.filter(item => item.group === groupId);
        },
        
        isItemVisible: (item) => {
          const { viewport } = get();
          const itemStart = item.start.getTime();
          const itemEnd = (item.end || item.start).getTime();
          const viewportStart = viewport.start.getTime();
          const viewportEnd = viewport.end.getTime();
          
          return itemStart <= viewportEnd && itemEnd >= viewportStart;
        },
        
        isItemSelected: (item) => {
          const { selectedItems } = get();
          return selectedItems.includes(item.id);
        },
        
        canEditItem: (item) => {
          const { settings } = get();
          return settings.collaboration || item.isEditable !== false;
        },
        
        canDeleteItem: (item) => {
          const { settings } = get();
          return settings.collaboration || item.isEditable !== false;
        },
        
        // Event handling
        emitEvent: (event) => {
          const timelineEvent: TimelineEvent = {
            ...event,
            timestamp: new Date(),
          };
          
          // Emit event to subscribers
          // This would typically be handled by an event emitter
          console.log('Timeline event:', timelineEvent);
        },
        
        // History management (simplified)
        undo: () => {
          // Implementation would depend on history management strategy
          console.log('Undo action');
        },
        
        redo: () => {
          // Implementation would depend on history management strategy
          console.log('Redo action');
        },
        
        clearHistory: () => {
          // Implementation would depend on history management strategy
          console.log('Clear history');
        },
        
        // Reset
        reset: () => set(() => ({ ...initialState })),
      }))
    ),
    {
      name: 'timeline-store',
    }
  )
);

// Selectors for common use cases
export const useTimelineItems = () => useTimelineStore(state => state.items);
export const useTimelineGroups = () => useTimelineStore(state => state.groups);
export const useTimelineViewport = () => useTimelineStore(state => state.viewport);
export const useTimelineMode = () => useTimelineStore(state => state.mode);
export const useTimelineTheme = () => useTimelineStore(state => state.theme);
export const useTimelineSettings = () => useTimelineStore(state => state.settings);
export const useTimelineFilters = () => useTimelineStore(state => state.filters);
export const useTimelineSort = () => useTimelineStore(state => state.sort);
export const useTimelineSelectedItems = () => useTimelineStore(state => state.selectedItems);
export const useTimelineSelectedGroups = () => useTimelineStore(state => state.selectedGroups);
export const useTimelineLoading = () => useTimelineStore(state => state.isLoading);
export const useTimelineEditing = () => useTimelineStore(state => state.isEditing);
export const useTimelineCollaborating = () => useTimelineStore(state => state.isCollaborating);
export const useTimelineCollaborators = () => useTimelineStore(state => state.collaborators);
