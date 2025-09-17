// TimelineX - Ultimate Timeline Component
// Export all public components and utilities

export { Timeline } from './components/Timeline';
export { TimelineCanvas } from './components/TimelineCanvas';
export { TimelineControls } from './components/TimelineControls';
export { TimelineGroup } from './components/TimelineGroup';
export { TimelineItem } from './components/TimelineItem';

// Core types
export type {
    TimelineEvent, TimelineGroup as TimelineGroupType, TimelineItem as TimelineItemType, TimelineMode, TimelineProps, TimelineState, TimelineTheme
} from './types';

// Hooks
export { useTimeline } from './hooks/useTimeline';
export { useTimelineDragDrop } from './hooks/useTimelineDragDrop';
export { useTimelineKeyboard } from './hooks/useTimelineKeyboard';
export { useTimelineTouch } from './hooks/useTimelineTouch';

// Stores
export { useTimelineStore } from './stores/timelineStore';

// Utils
export { PerformanceOptimizer } from './utils/PerformanceOptimizer';
export { TimelineUtils } from './utils/TimelineUtils';
export { VirtualScrolling } from './utils/VirtualScrolling';
export { ZoomManager } from './utils/ZoomManager';

// Design tokens
export { timelineStyles } from './styles/timeline-styles';
export { timelineTokens } from './tokens/timeline-tokens';

