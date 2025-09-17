// TimelineX Core Types
// Comprehensive type definitions for the TimelineX system

import React from "react";

export * from "./Viewport";

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end?: Date;
  group?: string;
  color?: string;
  type?: "event" | "milestone" | "task" | "phase";
  priority?: "low" | "medium" | "high" | "critical";
  status?: "pending" | "in-progress" | "completed" | "cancelled";
  metadata?: Record<string, any>;
  media?: TimelineMedia;
  dependencies?: string[];
  tags?: string[];
  assignee?: string;
  progress?: number; // 0-100
  isVisible?: boolean;
  isEditable?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface TimelineGroup {
  id: string;
  title: string;
  description?: string;
  color?: string;
  collapsed?: boolean;
  items: TimelineItem[];
  metadata?: Record<string, any>;
  className?: string;
  style?: React.CSSProperties;
}

export interface TimelineMedia {
  type: "image" | "video" | "audio" | "document" | "3d" | "interactive";
  url: string;
  thumbnail?: string;
  alt?: string;
  width?: number;
  height?: number;
  duration?: number; // for video/audio
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
  metadata?: Record<string, any>;
}

export type TimelineMode =
  | "horizontal"
  | "vertical"
  | "alternating"
  | "spiral"
  | "masonry"
  | "circular"
  | "gantt"
  | "calendar";

export interface TimelineTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  animations: {
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
    easing: {
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
}

export interface TimelineEvent {
  type:
    | "itemClick"
    | "itemDoubleClick"
    | "itemHover"
    | "itemDrag"
    | "itemResize"
    | "groupToggle"
    | "zoom"
    | "pan"
    | "select"
    | "deselect"
    | "edit"
    | "delete"
    | "create"
    | "update"
    | "collaboration"
    | "export"
    | "import";
  item?: TimelineItem;
  group?: TimelineGroup;
  data?: any;
  timestamp: Date;
  source: "user" | "system" | "collaboration";
}

export interface TimelineState {
  items: TimelineItem[];
  groups: TimelineGroup[];
  selectedItems: string[];
  selectedGroups: string[];
  viewport: {
    start: Date;
    end: Date;
    zoom: number;
    pan: { x: number; y: number };
  };
  mode: TimelineMode;
  theme: TimelineTheme;
  isLoading: boolean;
  isEditing: boolean;
  isCollaborating: boolean;
  collaborators: Collaborator[];
  filters: TimelineFilters;
  sort: TimelineSort;
  settings: TimelineSettings;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
  isOnline: boolean;
  lastSeen: Date;
  cursor?: { x: number; y: number };
  selection?: string[];
}

export interface TimelineFilters {
  search: string;
  dateRange: { start?: Date; end?: Date };
  groups: string[];
  types: string[];
  statuses: string[];
  priorities: string[];
  tags: string[];
  assignees: string[];
  custom: Record<string, any>;
}

export interface TimelineSort {
  field: string;
  direction: "asc" | "desc";
  secondary?: {
    field: string;
    direction: "asc" | "desc";
  };
}

export interface TimelineSettings {
  showGrid: boolean;
  showLabels: boolean;
  showTooltips: boolean;
  showProgress: boolean;
  showDependencies: boolean;
  snapToGrid: boolean;
  snapToItems: boolean;
  autoFit: boolean;
  smoothScrolling: boolean;
  animations: boolean;
  keyboardNavigation: boolean;
  touchGestures: boolean;
  collaboration: boolean;
  realTimeUpdates: boolean;
  autoSave: boolean;
  exportFormats: string[];
  maxItems: number;
  virtualScrolling: boolean;
  performanceMode: "auto" | "high" | "low";
}

export interface TimelineProps {
  // Data
  items?: TimelineItem[];
  groups?: TimelineGroup[];
  dataSource?: any; // LazyLoadingDataSource - will be imported when needed

  // Configuration
  mode?: TimelineMode;
  theme?: Partial<TimelineTheme>;
  settings?: Partial<TimelineSettings>;

  // Dimensions
  width?: number | string;
  height?: number | string;

  // Behavior
  readonly?: boolean;
  selectable?: boolean;
  editable?: boolean;
  draggable?: boolean;
  resizable?: boolean;

  // Events
  onItemClick?: (item: TimelineItem, event: React.MouseEvent) => void;
  onItemDoubleClick?: (item: TimelineItem, event: React.MouseEvent) => void;
  onItemHover?: (item: TimelineItem | null, event: React.MouseEvent) => void;
  onItemDrag?: (
    item: TimelineItem,
    newPosition: { start: Date; end?: Date }
  ) => void;
  onItemResize?: (
    item: TimelineItem,
    newDuration: { start: Date; end: Date }
  ) => void;
  onItemCreate?: (item: Omit<TimelineItem, "id">) => void;
  onItemUpdate?: (item: TimelineItem) => void;
  onItemDelete?: (itemId: string) => void;
  onGroupToggle?: (group: TimelineGroup, collapsed: boolean) => void;
  onSelectionChange?: (
    selectedItems: string[],
    selectedGroups: string[]
  ) => void;
  onViewportChange?: (viewport: TimelineState["viewport"]) => void;
  onZoom?: (zoom: number, center?: { x: number; y: number }) => void;
  onPan?: (pan: { x: number; y: number }) => void;
  onEvent?: (event: TimelineEvent) => void;

  // Collaboration
  onCollaboration?: (event: TimelineEvent) => void;

  // Export/Import
  onExport?: (format: string, data: any) => void;
  onImport?: (data: any) => void;

  // Loading
  onLoadingChange?: (isLoading: boolean) => void;

  // Error handling
  onError?: (error: Error) => void;

  // Customization
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;

  // Advanced
  renderItem?: (item: TimelineItem) => React.ReactNode;
  renderGroup?: (group: TimelineGroup) => React.ReactNode;
  renderTooltip?: (item: TimelineItem) => React.ReactNode;
  renderControls?: () => React.ReactNode;
  renderOverlay?: () => React.ReactNode;
}

// Utility types
export type TimelineItemId = string;
export type TimelineGroupId = string;
export type TimelineEventType = TimelineEvent["type"];

// Hook return types
export interface UseTimelineReturn {
  state: TimelineState;
  actions: {
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
    setViewport: (viewport: Partial<TimelineState["viewport"]>) => void;
    setMode: (mode: TimelineMode) => void;
    setTheme: (theme: Partial<TimelineTheme>) => void;
    setSettings: (settings: Partial<TimelineSettings>) => void;
    setFilters: (filters: Partial<TimelineFilters>) => void;
    setSort: (sort: TimelineSort) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    zoomToFit: () => void;
    zoomToItem: (itemId: string) => void;
    panTo: (x: number, y: number) => void;
    panBy: (dx: number, dy: number) => void;
    resetView: () => void;
    export: (format: string) => void;
    import: (data: any) => void;
    undo: () => void;
    redo: () => void;
    clearHistory: () => void;
  };
  utils: {
    getItemById: (id: string) => TimelineItem | undefined;
    getGroupById: (id: string) => TimelineGroup | undefined;
    getVisibleItems: () => TimelineItem[];
    getSelectedItems: () => TimelineItem[];
    getItemsInRange: (start: Date, end: Date) => TimelineItem[];
    getItemsInGroup: (groupId: string) => TimelineItem[];
    getItemBounds: (item: TimelineItem) => {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    getViewportBounds: () => {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    isItemVisible: (item: TimelineItem) => boolean;
    isItemSelected: (item: TimelineItem) => boolean;
    canEditItem: (item: TimelineItem) => boolean;
    canDeleteItem: (item: TimelineItem) => boolean;
    formatDate: (date: Date, format?: string) => string;
    parseDate: (dateString: string) => Date;
    calculateDuration: (start: Date, end: Date) => number;
    calculateOverlap: (item1: TimelineItem, item2: TimelineItem) => number;
    sortItems: (items: TimelineItem[], sort: TimelineSort) => TimelineItem[];
    filterItems: (
      items: TimelineItem[],
      filters: TimelineFilters
    ) => TimelineItem[];
  };
}
