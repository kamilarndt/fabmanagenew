// TimelineX Styles
// Utility functions for generating CSS classes and styles from design tokens

import { timelineTokens } from '../tokens/timeline-tokens';

export class TimelineStyles {
  /**
   * Generate CSS classes for timeline components
   */
  static getTimelineClasses() {
    return {
      // Container
      container: 'timeline-container',
      timeline: 'timeline',
      canvas: 'timeline-canvas',
      overlay: 'timeline-overlay',
      
      // Items
      item: 'timeline-item',
      itemContent: 'timeline-item-content',
      itemTitle: 'timeline-item-title',
      itemDescription: 'timeline-item-description',
      itemMedia: 'timeline-item-media',
      itemProgress: 'timeline-item-progress',
      itemBadge: 'timeline-item-badge',
      
      // Groups
      group: 'timeline-group',
      groupHeader: 'timeline-group-header',
      groupTitle: 'timeline-group-title',
      groupToggle: 'timeline-group-toggle',
      groupContent: 'timeline-group-content',
      
      // Controls
      controls: 'timeline-controls',
      zoomControls: 'timeline-zoom-controls',
      panControls: 'timeline-pan-controls',
      modeControls: 'timeline-mode-controls',
      filterControls: 'timeline-filter-controls',
      
      // States
      selected: 'timeline-selected',
      hovered: 'timeline-hovered',
      focused: 'timeline-focused',
      disabled: 'timeline-disabled',
      loading: 'timeline-loading',
      error: 'timeline-error',
      
      // Interactions
      draggable: 'timeline-draggable',
      resizable: 'timeline-resizable',
      editable: 'timeline-editable',
      clickable: 'timeline-clickable',
      
      // Modes
      horizontal: 'timeline-horizontal',
      vertical: 'timeline-vertical',
      alternating: 'timeline-alternating',
      spiral: 'timeline-spiral',
      masonry: 'timeline-masonry',
      circular: 'timeline-circular',
      gantt: 'timeline-gantt',
      calendar: 'timeline-calendar',
    };
  }

  /**
   * Generate CSS variables from design tokens
   */
  static getCSSVariables() {
    const vars: Record<string, string> = {};
    
    // Colors
    Object.entries(timelineTokens.colors).forEach(([category, colors]) => {
      if (typeof colors === 'object' && colors !== null) {
        Object.entries(colors).forEach(([shade, value]) => {
          if (typeof value === 'string') {
            vars[`--timeline-color-${category}-${shade}`] = value;
          } else if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([subShade, subValue]) => {
              if (typeof subValue === 'string') {
                vars[`--timeline-color-${category}-${shade}-${subShade}`] = subValue;
              }
            });
          }
        });
      }
    });
    
    // Spacing
    Object.entries(timelineTokens.spacing).forEach(([size, value]) => {
      vars[`--timeline-spacing-${size}`] = value;
    });
    
    // Typography
    Object.entries(timelineTokens.typography.fontSize).forEach(([size, value]) => {
      vars[`--timeline-font-size-${size}`] = value;
    });
    
    Object.entries(timelineTokens.typography.fontWeight).forEach(([weight, value]) => {
      vars[`--timeline-font-weight-${weight}`] = value;
    });
    
    // Border radius
    Object.entries(timelineTokens.borderRadius).forEach(([size, value]) => {
      vars[`--timeline-border-radius-${size}`] = value;
    });
    
    // Shadows
    Object.entries(timelineTokens.shadows).forEach(([size, value]) => {
      vars[`--timeline-shadow-${size}`] = value;
    });
    
    // Z-index
    Object.entries(timelineTokens.zIndex).forEach(([level, value]) => {
      vars[`--timeline-z-index-${level}`] = value;
    });
    
    // Timeline specific
    Object.entries(timelineTokens.timeline).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        vars[`--timeline-${key}`] = String(value);
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (typeof subValue === 'string' || typeof subValue === 'number') {
            vars[`--timeline-${key}-${subKey}`] = String(subValue);
          }
        });
      }
    });
    
    return vars;
  }

  /**
   * Generate base CSS styles for timeline components
   */
  static getBaseStyles() {
    return `
      .timeline-container {
        position: relative;
        width: 100%;
        height: var(--timeline-height, ${timelineTokens.timeline.timelineHeight});
        overflow: hidden;
        background-color: var(--timeline-background, ${timelineTokens.colors.timeline.background});
        border: 1px solid var(--timeline-border, ${timelineTokens.colors.timeline.border});
        border-radius: var(--timeline-border-radius-md, ${timelineTokens.borderRadius.md});
        font-family: var(--timeline-font-family-sans, ${timelineTokens.typography.fontFamily.sans.join(', ')});
        font-size: var(--timeline-font-size-sm, ${timelineTokens.typography.fontSize.sm});
        line-height: var(--timeline-line-height-normal, ${timelineTokens.typography.lineHeight.normal});
        color: var(--timeline-text, ${timelineTokens.colors.timeline.text});
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }

      .timeline {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .timeline-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .timeline-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: auto;
        z-index: var(--timeline-z-index-base, ${timelineTokens.zIndex.base});
      }

      .timeline-item {
        position: absolute;
        display: flex;
        align-items: center;
        min-height: var(--timeline-item-height, ${timelineTokens.timeline.itemHeight});
        min-width: var(--timeline-item-min-width, ${timelineTokens.timeline.itemMinWidth});
        max-width: var(--timeline-item-max-width, ${timelineTokens.timeline.itemMaxWidth});
        padding: var(--timeline-item-padding, ${timelineTokens.timeline.itemPadding});
        margin: var(--timeline-item-margin, ${timelineTokens.timeline.itemMargin});
        background-color: var(--timeline-surface, ${timelineTokens.colors.timeline.surface});
        border: 1px solid var(--timeline-border, ${timelineTokens.colors.timeline.border});
        border-radius: var(--timeline-border-radius-sm, ${timelineTokens.borderRadius.sm});
        box-shadow: var(--timeline-shadow-sm, ${timelineTokens.shadows.sm});
        cursor: pointer;
        transition: all var(--timeline-animation-duration-fast, ${timelineTokens.animations.duration.fast}) var(--timeline-animation-easing-ease-out, ${timelineTokens.animations.easing.easeOut});
        z-index: var(--timeline-z-index-base, ${timelineTokens.zIndex.base});
      }

      .timeline-item:hover {
        background-color: var(--timeline-hover, ${timelineTokens.colors.timeline.hover});
        box-shadow: var(--timeline-shadow-md, ${timelineTokens.shadows.md});
        transform: translateY(-1px);
      }

      .timeline-item.timeline-selected {
        background-color: var(--timeline-selection, ${timelineTokens.colors.timeline.selection});
        border-color: var(--timeline-accent, ${timelineTokens.colors.timeline.accent});
        box-shadow: var(--timeline-shadow-md, ${timelineTokens.shadows.md});
      }

      .timeline-item.timeline-focused {
        outline: 2px solid var(--timeline-accent, ${timelineTokens.colors.timeline.accent});
        outline-offset: 2px;
      }

      .timeline-item.timeline-disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      .timeline-item-content {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .timeline-item-title {
        font-size: var(--timeline-font-size-sm, ${timelineTokens.typography.fontSize.sm});
        font-weight: var(--timeline-font-weight-medium, ${timelineTokens.typography.fontWeight.medium});
        color: var(--timeline-text, ${timelineTokens.colors.timeline.text});
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .timeline-item-description {
        font-size: var(--timeline-font-size-xs, ${timelineTokens.typography.fontSize.xs});
        color: var(--timeline-text-secondary, ${timelineTokens.colors.timeline.textSecondary});
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .timeline-item-media {
        width: 100%;
        height: auto;
        border-radius: var(--timeline-border-radius-sm, ${timelineTokens.borderRadius.sm});
        object-fit: cover;
      }

      .timeline-item-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        background-color: var(--timeline-accent, ${timelineTokens.colors.timeline.accent});
        border-radius: 0 0 var(--timeline-border-radius-sm, ${timelineTokens.borderRadius.sm}) 0;
        transition: width var(--timeline-animation-duration-normal, ${timelineTokens.animations.duration.normal}) var(--timeline-animation-easing-ease-out, ${timelineTokens.animations.easing.easeOut});
      }

      .timeline-item-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        min-width: 16px;
        height: 16px;
        padding: 0 4px;
        background-color: var(--timeline-accent, ${timelineTokens.colors.timeline.accent});
        color: white;
        font-size: 10px;
        font-weight: var(--timeline-font-weight-semibold, ${timelineTokens.typography.fontWeight.semibold});
        border-radius: var(--timeline-border-radius-full, ${timelineTokens.borderRadius.full});
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: var(--timeline-z-index-base, ${timelineTokens.zIndex.base});
      }

      .timeline-group {
        position: relative;
        margin-bottom: var(--timeline-spacing-md, ${timelineTokens.spacing.md});
      }

      .timeline-group-header {
        display: flex;
        align-items: center;
        min-height: var(--timeline-group-height, ${timelineTokens.timeline.groupHeight});
        padding: var(--timeline-group-padding, ${timelineTokens.timeline.groupPadding});
        background-color: var(--timeline-surface, ${timelineTokens.colors.timeline.surface});
        border: 1px solid var(--timeline-border, ${timelineTokens.colors.timeline.border});
        border-radius: var(--timeline-border-radius-md, ${timelineTokens.borderRadius.md});
        cursor: pointer;
        transition: all var(--timeline-animation-duration-fast, ${timelineTokens.animations.duration.fast}) var(--timeline-animation-easing-ease-out, ${timelineTokens.animations.easing.easeOut});
      }

      .timeline-group-header:hover {
        background-color: var(--timeline-hover, ${timelineTokens.colors.timeline.hover});
      }

      .timeline-group-title {
        font-size: var(--timeline-font-size-base, ${timelineTokens.typography.fontSize.base});
        font-weight: var(--timeline-font-weight-semibold, ${timelineTokens.typography.fontWeight.semibold});
        color: var(--timeline-text, ${timelineTokens.colors.timeline.text});
        margin: 0;
        flex: 1;
      }

      .timeline-group-toggle {
        width: 20px;
        height: 20px;
        border: none;
        background: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--timeline-text-secondary, ${timelineTokens.colors.timeline.textSecondary});
        transition: transform var(--timeline-animation-duration-fast, ${timelineTokens.animations.duration.fast}) var(--timeline-animation-easing-ease-out, ${timelineTokens.animations.easing.easeOut});
      }

      .timeline-group-toggle:hover {
        color: var(--timeline-text, ${timelineTokens.colors.timeline.text});
      }

      .timeline-group-toggle.collapsed {
        transform: rotate(-90deg);
      }

      .timeline-group-content {
        margin-top: var(--timeline-spacing-sm, ${timelineTokens.spacing.sm});
        transition: all var(--timeline-animation-duration-normal, ${timelineTokens.animations.duration.normal}) var(--timeline-animation-easing-ease-out, ${timelineTokens.animations.easing.easeOut});
      }

      .timeline-group-content.collapsed {
        display: none;
      }

      .timeline-controls {
        position: absolute;
        top: var(--timeline-spacing-sm, ${timelineTokens.spacing.sm});
        right: var(--timeline-spacing-sm, ${timelineTokens.spacing.sm});
        display: flex;
        gap: var(--timeline-spacing-sm, ${timelineTokens.spacing.sm});
        z-index: var(--timeline-z-index-docked, ${timelineTokens.zIndex.docked});
      }

      .timeline-zoom-controls,
      .timeline-pan-controls,
      .timeline-mode-controls,
      .timeline-filter-controls {
        display: flex;
        gap: var(--timeline-spacing-xs, ${timelineTokens.spacing.xs});
      }

      /* Mode-specific styles */
      .timeline-horizontal .timeline-item {
        flex-direction: row;
      }

      .timeline-vertical .timeline-item {
        flex-direction: column;
      }

      .timeline-alternating .timeline-item:nth-child(even) {
        margin-left: var(--timeline-spacing-xl, ${timelineTokens.spacing.xl});
      }

      .timeline-spiral .timeline-item {
        border-radius: var(--timeline-border-radius-full, ${timelineTokens.borderRadius.full});
      }

      .timeline-masonry .timeline-item {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      .timeline-circular .timeline-item {
        position: absolute;
        transform-origin: center;
      }

      .timeline-gantt .timeline-item {
        border-left: 4px solid var(--timeline-accent, ${timelineTokens.colors.timeline.accent});
      }

      .timeline-calendar .timeline-item {
        border-radius: var(--timeline-border-radius-sm, ${timelineTokens.borderRadius.sm});
        box-shadow: var(--timeline-shadow-sm, ${timelineTokens.shadows.sm});
      }

      /* Responsive design */
      @media (max-width: ${timelineTokens.breakpoints.sm}) {
        .timeline-item {
          min-width: var(--timeline-item-min-width, ${timelineTokens.timeline.itemMinWidth});
          max-width: 100%;
        }
        
        .timeline-controls {
          position: static;
          margin-top: var(--timeline-spacing-sm, ${timelineTokens.spacing.sm});
        }
      }

      /* High contrast mode */
      @media (prefers-contrast: high) {
        .timeline-item {
          border-width: 2px;
        }
        
        .timeline-item.timeline-selected {
          outline: 2px solid var(--timeline-accent, ${timelineTokens.colors.timeline.accent});
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .timeline-item,
        .timeline-group-header,
        .timeline-group-toggle {
          transition: none;
        }
      }

      /* Print styles */
      @media print {
        .timeline-controls {
          display: none;
        }
        
        .timeline-item {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      }
    `;
  }

  /**
   * Generate CSS classes for specific item types
   */
  static getItemTypeClasses(itemType: string) {
    return {
      event: 'timeline-item-event',
      milestone: 'timeline-item-milestone',
      task: 'timeline-item-task',
      phase: 'timeline-item-phase',
    }[itemType] || 'timeline-item-default';
  }

  /**
   * Generate CSS classes for specific priorities
   */
  static getPriorityClasses(priority: string) {
    return {
      low: 'timeline-priority-low',
      medium: 'timeline-priority-medium',
      high: 'timeline-priority-high',
      critical: 'timeline-priority-critical',
    }[priority] || 'timeline-priority-default';
  }

  /**
   * Generate CSS classes for specific statuses
   */
  static getStatusClasses(status: string) {
    return {
      pending: 'timeline-status-pending',
      'in-progress': 'timeline-status-in-progress',
      completed: 'timeline-status-completed',
      cancelled: 'timeline-status-cancelled',
    }[status] || 'timeline-status-default';
  }

  /**
   * Generate CSS classes for specific modes
   */
  static getModeClasses(mode: string) {
    return {
      horizontal: 'timeline-horizontal',
      vertical: 'timeline-vertical',
      alternating: 'timeline-alternating',
      spiral: 'timeline-spiral',
      masonry: 'timeline-masonry',
      circular: 'timeline-circular',
      gantt: 'timeline-gantt',
      calendar: 'timeline-calendar',
    }[mode] || 'timeline-horizontal';
  }

  /**
   * Generate inline styles for timeline items
   */
  static getItemStyles(item: any) {
    const styles: React.CSSProperties = {};
    
    if (item.color) {
      styles.backgroundColor = item.color;
    }
    
    if (item.style) {
      Object.assign(styles, item.style);
    }
    
    return styles;
  }

  /**
   * Generate CSS classes for timeline state
   */
  static getStateClasses(state: {
    selected?: boolean;
    hovered?: boolean;
    focused?: boolean;
    disabled?: boolean;
    loading?: boolean;
    error?: boolean;
    draggable?: boolean;
    resizable?: boolean;
    editable?: boolean;
    clickable?: boolean;
  }) {
    const classes = [];
    
    if (state.selected) classes.push('timeline-selected');
    if (state.hovered) classes.push('timeline-hovered');
    if (state.focused) classes.push('timeline-focused');
    if (state.disabled) classes.push('timeline-disabled');
    if (state.loading) classes.push('timeline-loading');
    if (state.error) classes.push('timeline-error');
    if (state.draggable) classes.push('timeline-draggable');
    if (state.resizable) classes.push('timeline-resizable');
    if (state.editable) classes.push('timeline-editable');
    if (state.clickable) classes.push('timeline-clickable');
    
    return classes.join(' ');
  }
}

// Export utility functions
export const timelineStyles = TimelineStyles;
