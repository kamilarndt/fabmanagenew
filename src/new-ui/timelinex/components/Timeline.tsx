// TimelineX Main Component
// The primary Timeline component that orchestrates all timeline functionality

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTimeline } from "../hooks/useTimeline";
import { useTimelineDragDrop } from "../hooks/useTimelineDragDrop";
import { useTimelineKeyboard } from "../hooks/useTimelineKeyboard";
import { useTimelineResponsive } from "../hooks/useTimelineResponsive";
import { useTimelineTouch } from "../hooks/useTimelineTouch";
import { useTimelineUndoRedo } from "../hooks/useTimelineUndoRedo";
import { timelineStyles } from "../styles/timeline-styles";
import { TimelineGroup, TimelineItem, TimelineProps } from "../types";
import { TimelineCanvas } from "./TimelineCanvas";
import { TimelineContextMenu } from "./TimelineContextMenu";
import { TimelineControls } from "./TimelineControls";
import { TimelineGroup as TimelineGroupComponent } from "./TimelineGroup";
import { TimelineInlineEditor } from "./TimelineInlineEditor";
import { TimelineItem as TimelineItemComponent } from "./TimelineItem";
import { TimelineSVG } from "./TimelineSVG";
import { TimelineWebGL } from "./TimelineWebGL";
import { TimelineVirtual } from "./TimelineVirtual";
import { TimelineLazy } from "./TimelineLazy";
import { TimelineTouch } from "./TimelineTouch";
import { TimelineAnimated } from "./TimelineAnimated";
import { TimelineMobile } from "./TimelineMobile";
import { TimelineAccessible } from "./TimelineAccessible";

export const Timeline = memo(function Timeline({
  // Data
  items = [],
  groups = [],

  // Configuration
  mode = "horizontal",
  theme,
  settings,

  // Dimensions
  width = "100%",
  height = "400px",

  // Behavior
  readonly = false,
  selectable = true,
  editable = true,
  draggable = true,
  resizable = true,

  // Events
  onItemClick,
  onItemDoubleClick,
  onItemHover,
  onItemDrag,
  onItemResize,
  onItemCreate,
  onItemUpdate,
  onItemDelete,
  onGroupToggle,
  onSelectionChange,
  onViewportChange,
  onZoom,
  onPan,
  onEvent,
  onCollaboration,
  onExport,
  onImport,
  onLoadingChange,
  onError,

  // Customization
  className,
  style,
  children,
  renderItem,
  renderGroup,
  renderTooltip,
  renderControls,
  renderOverlay,

  ...props
}: TimelineProps) {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // State
  const [isInitialized, setIsInitialized] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<TimelineItem | null>(null);
  const [focusedItem, setFocusedItem] = useState<TimelineItem | null>(null);
  const [renderMode, setRenderMode] = useState<"canvas" | "svg" | "webgl" | "virtual" | "lazy" | "touch" | "animated" | "mobile" | "accessible">("canvas");
  const [contextMenu, setContextMenu] = useState<{
    item: TimelineItem | null;
    position: { x: number; y: number } | null;
  }>({ item: null, position: null });
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [editingBounds, setEditingBounds] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Store
  const { state, actions, utils } = useTimeline();

  // Undo/Redo system
  const { canUndo, canRedo, undo, redo, pushAction } = useTimelineUndoRedo(
    {
      items: state.items,
      groups: state.groups,
      viewport: state.viewport,
    },
    (newState) => {
      if (newState.items) actions.setItems(newState.items);
      if (newState.groups) actions.setGroups(newState.groups);
      if (newState.viewport) actions.setViewport(newState.viewport);
    }
  );

  // Responsive design
  const {
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    recommendedLayout,
    shouldShowControls,
    shouldShowLabels,
    itemSize,
  } = useTimelineResponsive({
    enableResponsive: true,
    mobileLayout: "vertical",
    tabletLayout: "horizontal",
    desktopLayout: "horizontal",
    adaptiveControls: true,
    touchOptimized: true,
  });

  // Initialize store with props
  useEffect(() => {
    if (items.length > 0) {
      actions.setItems(items);
    }
    if (groups.length > 0) {
      actions.setGroups(groups);
    }
    if (mode !== state.mode) {
      actions.setMode(mode);
    }
    if (theme) {
      actions.setTheme(theme);
    }
    if (settings) {
      actions.setSettings(settings);
    }
    // Ensure initial viewport shows provided items when available
    // Auto-fit to items if any exist and autoFit setting is enabled (default true)
    if (items.length > 0 && (settings?.autoFit ?? state.settings.autoFit)) {
      actions.zoomToFit();
    }
    setIsInitialized(true);
  }, [items, groups, mode, theme, settings]);

  // Keyboard navigation
  useTimelineKeyboard({
    onItemSelect: actions.selectItem,
    onItemDeselect: actions.deselectItem,
    onZoomIn: actions.zoomIn,
    onZoomOut: actions.zoomOut,
    onPan: actions.panBy,
    onEscape: actions.deselectAll,
  });

  // Touch gestures
  useTimelineTouch({
    onZoom: (zoom, center) => {
      actions.setViewport({ zoom });
      onZoom?.(zoom, center);
    },
    onPan: (pan) => {
      actions.setViewport({ pan });
      onPan?.(pan);
    },
  });

  // Drag and drop
  useTimelineDragDrop({
    onItemDrag: (item, newPosition) => {
      actions.updateItem(item.id, newPosition);
      onItemDrag?.(item, newPosition);
    },
    onItemResize: (item, newDuration) => {
      actions.updateItem(item.id, newDuration);
      onItemResize?.(item, newDuration);
    },
  });

  // Event handlers
  const handleItemClick = useCallback(
    (item: TimelineItem, event: React.MouseEvent) => {
      if (event.button === 2) {
        // Right click
        event.preventDefault();
        setContextMenu({
          item,
          position: { x: event.clientX, y: event.clientY },
        });
        return;
      }

      if (selectable) {
        if (event.ctrlKey || event.metaKey) {
          if (state.selectedItems.includes(item.id)) {
            actions.deselectItem(item.id);
          } else {
            actions.selectItem(item.id);
          }
        } else {
          actions.selectItems([item.id]);
        }
      }
      onItemClick?.(item, event);
    },
    [selectable, state.selectedItems, actions, onItemClick]
  );

  const handleItemDoubleClick = useCallback(
    (item: TimelineItem, event: React.MouseEvent) => {
      if (editable) {
        setFocusedItem(item);
        setEditingItem(item);
        // Calculate bounds for editor positioning
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          setEditingBounds({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            width: 300,
            height: 200,
          });
        }
      }
      onItemDoubleClick?.(item, event);
    },
    [editable, onItemDoubleClick]
  );

  const handleItemHover = useCallback(
    (item: TimelineItem | null, event: React.MouseEvent) => {
      setHoveredItem(item);
      onItemHover?.(item, event);
    },
    [onItemHover]
  );

  const handleItemCreate = useCallback(
    (item: Omit<TimelineItem, "id">) => {
      const newItem: TimelineItem = {
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      // Push undo action
      pushAction({
        type: "add",
        itemId: newItem.id,
        before: null,
        after: newItem,
      });

      actions.addItem(newItem);
      onItemCreate?.(newItem);
    },
    [actions, onItemCreate, pushAction]
  );

  const handleItemUpdate = useCallback(
    (item: TimelineItem) => {
      const oldItem = state.items.find((i) => i.id === item.id);
      if (oldItem) {
        // Push undo action
        pushAction({
          type: "update",
          itemId: item.id,
          before: oldItem,
          after: item,
        });
      }

      actions.updateItem(item.id, item);
      onItemUpdate?.(item);
    },
    [actions, onItemUpdate, pushAction, state.items]
  );

  const handleItemDelete = useCallback(
    (itemId: string) => {
      const oldItem = state.items.find((i) => i.id === itemId);
      if (oldItem) {
        // Push undo action
        pushAction({
          type: "delete",
          itemId: itemId,
          before: oldItem,
          after: null,
        });
      }

      actions.removeItem(itemId);
      onItemDelete?.(itemId);
    },
    [actions, onItemDelete, pushAction, state.items]
  );

  const handleGroupToggle = useCallback(
    (group: TimelineGroup, collapsed: boolean) => {
      actions.updateGroup(group.id, { collapsed });
      onGroupToggle?.(group, collapsed);
    },
    [actions, onGroupToggle]
  );

  const handleSelectionChange = useCallback(
    (selectedItems: string[], selectedGroups: string[]) => {
      actions.selectItems(selectedItems);
      actions.selectItems(selectedGroups);
      onSelectionChange?.(selectedItems, selectedGroups);
    },
    [actions, onSelectionChange]
  );

  const handleViewportChange = useCallback(
    (viewport: typeof state.viewport) => {
      actions.setViewport(viewport);
      onViewportChange?.(viewport);
    },
    [actions, onViewportChange]
  );

  const handleZoom = useCallback(
    (zoom: number, center?: { x: number; y: number }) => {
      actions.setViewport({ zoom });
      onZoom?.(zoom, center);
    },
    [actions, onZoom]
  );

  const handlePan = useCallback(
    (pan: { x: number; y: number }) => {
      actions.setViewport({ pan });
      onPan?.(pan);
    },
    [actions, onPan]
  );

  const handleEvent = useCallback(
    (event: any) => {
      // actions.emitEvent(event); // This method doesn't exist in the store
      onEvent?.(event);
    },
    [onEvent]
  );

  const handleExport = useCallback(
    (format: string) => {
      const data = {
        items: state.items,
        groups: state.groups,
        viewport: state.viewport,
        mode: state.mode,
        theme: state.theme,
        settings: state.settings,
      };
      onExport?.(format, data);
    },
    [state, onExport]
  );

  const handleImport = useCallback(
    (data: any) => {
      if (data.items) actions.setItems(data.items);
      if (data.groups) actions.setGroups(data.groups);
      if (data.viewport) actions.setViewport(data.viewport);
      if (data.mode) actions.setMode(data.mode);
      if (data.theme) actions.setTheme(data.theme);
      if (data.settings) actions.setSettings(data.settings);
      onImport?.(data);
    },
    [actions, onImport]
  );

  // Get visible items
  const visibleItems = utils.getVisibleItems();
  const selectedItems = utils.getSelectedItems();

  // Generate CSS classes
  const classes = timelineStyles.getTimelineClasses();
  const modeClass = timelineStyles.getModeClasses(mode);
  const stateClasses = timelineStyles.getStateClasses({
    selected: selectedItems.length > 0,
    hovered: hoveredItem !== null,
    focused: focusedItem !== null,
    disabled: readonly,
    loading: state.isLoading,
    draggable: draggable && !readonly,
    resizable: resizable && !readonly,
    editable: editable && !readonly,
    clickable: selectable,
  });

  // Generate container styles
  const containerStyle: React.CSSProperties = {
    width,
    height,
    ...style,
  };

  // Generate CSS variables
  const cssVariables = timelineStyles.getCSSVariables();
  // Inject base CSS once
  useEffect(() => {
    const id = "timelinex-base-styles";
    if (!document.getElementById(id)) {
      const styleEl = document.createElement("style");
      styleEl.id = id;
      styleEl.textContent = timelineStyles.getBaseStyles();
      document.head.appendChild(styleEl);
    }
  }, []);

  if (!isInitialized) {
    return (
      <div
        className={`${classes.container} ${className || ""}`}
        style={containerStyle}
      >
        <div className="timeline-loading">Loading timeline...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${classes.container} ${modeClass} ${stateClasses} ${className || ""}`}
      style={{
        ...containerStyle,
        ...cssVariables,
      }}
      {...props}
    >
       {/* High-performance rendering with multiple backends */}
       {renderMode === "accessible" ? (
         <TimelineAccessible
           items={visibleItems}
           groups={state.groups}
           viewport={state.viewport}
           theme={state.theme}
           settings={state.settings}
           width={typeof width === "number" ? width : 800}
           height={typeof height === "number" ? height : 400}
           mode={state.mode}
           onItemClick={handleItemClick}
           onItemDoubleClick={handleItemDoubleClick}
           onItemHover={handleItemHover}
           onViewportChange={handleViewportChange}
           onZoom={handleZoom}
           onPan={handlePan}
           accessibilityOptions={{
             enableKeyboardNavigation: true,
             enableScreenReaderSupport: true,
             enableHighContrast: true,
             enableReducedMotion: true,
             enableFocusManagement: true,
             enableARIALabels: true,
             enableLiveRegions: true,
             enableSkipLinks: true,
             enableColorBlindSupport: true,
             enableVoiceControl: true,
           }}
         />
       ) : renderMode === "mobile" ? (
         <TimelineMobile
           items={visibleItems}
           groups={state.groups}
           viewport={state.viewport}
           theme={state.theme}
           settings={state.settings}
           width={typeof width === "number" ? width : 800}
           height={typeof height === "number" ? height : 400}
           mode={state.mode}
           onItemClick={handleItemClick}
           onItemDoubleClick={handleItemDoubleClick}
           onItemHover={handleItemHover}
           onViewportChange={handleViewportChange}
           onZoom={handleZoom}
           onPan={handlePan}
           mobileOptions={{
             enableHapticFeedback: true,
             enableSwipeNavigation: true,
             enablePullToRefresh: true,
             enableInfiniteScroll: true,
             enableOfflineMode: false,
             enableBatteryOptimization: true,
             enableMemoryOptimization: true,
             enableNetworkOptimization: true,
           }}
         />
       ) : renderMode === "animated" ? (
         <TimelineAnimated
           items={visibleItems}
           groups={state.groups}
           viewport={state.viewport}
           theme={state.theme}
           settings={state.settings}
           width={typeof width === "number" ? width : 800}
           height={typeof height === "number" ? height : 400}
           mode={state.mode}
           onItemClick={handleItemClick}
           onItemDoubleClick={handleItemDoubleClick}
           onItemHover={handleItemHover}
           onViewportChange={handleViewportChange}
           onZoom={handleZoom}
           onPan={handlePan}
           animationConfig={{
             enableItemAnimations: true,
             enableViewportAnimations: true,
             enableStaggerAnimations: true,
             animationDuration: 0.3,
             staggerDelay: 0.1,
           }}
         />
       ) : renderMode === "touch" ? (
         <TimelineTouch
           items={visibleItems}
           groups={state.groups}
           viewport={state.viewport}
           theme={state.theme}
           settings={state.settings}
           width={typeof width === "number" ? width : 800}
           height={typeof height === "number" ? height : 400}
           mode={state.mode}
           onItemClick={handleItemClick}
           onItemDoubleClick={handleItemDoubleClick}
           onItemHover={handleItemHover}
           onViewportChange={handleViewportChange}
           onZoom={handleZoom}
           onPan={handlePan}
           onSwipe={(direction, velocity) => {
             // Handle swipe gestures
             console.log('Swipe detected:', direction, velocity);
           }}
           onLongPress={(position, item) => {
             // Handle long press
             if (item) {
               setContextMenu({
                 item,
                 position: { x: position.x, y: position.y },
               });
             }
           }}
           touchOptions={{
             enablePinch: true,
             enableSwipe: true,
             enableLongPress: true,
             enableDoubleTap: true,
             enablePan: true,
             longPressDelay: 500,
             doubleTapDelay: 300,
             swipeThreshold: 50,
             pinchThreshold: 0.1,
             velocityThreshold: 0.5,
           }}
         />
       ) : renderMode === "lazy" ? (
         <TimelineLazy
           viewport={state.viewport}
           theme={state.theme}
           settings={state.settings}
           width={typeof width === "number" ? width : 800}
           height={typeof height === "number" ? height : 400}
           mode={state.mode}
           onItemClick={handleItemClick}
           onItemDoubleClick={handleItemDoubleClick}
           onItemHover={handleItemHover}
           onViewportChange={handleViewportChange}
           onZoom={handleZoom}
           onPan={handlePan}
           lazyLoadingOptions={{
             batchSize: 100,
             loadDelay: 100,
             preloadDistance: 200,
             enableTimeBasedLoading: true,
             enableGroupBasedLoading: true,
             maxConcurrentRequests: 3,
             cacheSize: 1000,
           }}
         />
       ) : renderMode === "virtual" ? (
        <TimelineVirtual
          items={visibleItems}
          groups={state.groups}
          viewport={state.viewport}
          theme={state.theme}
          settings={state.settings}
          width={typeof width === "number" ? width : 800}
          height={typeof height === "number" ? height : 400}
          mode={state.mode}
          onItemClick={handleItemClick}
          onItemDoubleClick={handleItemDoubleClick}
          onItemHover={handleItemHover}
          onViewportChange={handleViewportChange}
          onZoom={handleZoom}
          onPan={handlePan}
          virtualScrollingOptions={{
            itemHeight: 30,
            groupHeight: 40,
            overscan: 10,
            enableHorizontalVirtualization: state.mode === 'horizontal',
            enableVerticalVirtualization: true,
          }}
        />
      ) : renderMode === "webgl" ? (
        <TimelineWebGL
          items={visibleItems}
          groups={state.groups}
          viewport={state.viewport}
          theme={state.theme}
          width={typeof width === "number" ? width : 800}
          height={typeof height === "number" ? height : 400}
          onItemClick={handleItemClick}
          onItemDoubleClick={handleItemDoubleClick}
          onItemDrag={handleItemDrag}
          onViewportChange={handleViewportChange}
          enableAnimations={true}
          animationSpeed={1.0}
        />
      ) : renderMode === "canvas" ? (
        <TimelineCanvas
          ref={canvasRef as any}
          items={visibleItems}
          groups={state.groups}
          viewport={state.viewport}
          mode={state.mode}
          theme={state.theme}
          settings={state.settings}
          onItemClick={handleItemClick}
          onItemHover={handleItemHover}
          onViewportChange={handleViewportChange}
          onZoom={handleZoom}
          onPan={handlePan}
        />
      ) : (
        <TimelineSVG
          items={visibleItems}
          groups={state.groups}
          viewport={state.viewport}
          mode={state.mode}
          theme={state.theme}
          settings={state.settings}
          onItemClick={handleItemClick}
          onItemHover={handleItemHover}
          onZoom={handleZoom}
        />
      )}

      {/* Overlay for interactions */}
      <div
        ref={overlayRef}
        className={classes.overlay}
        onMouseMove={(e) => {
          // Handle mouse move for hover effects
          const rect = overlayRef.current?.getBoundingClientRect();
          if (rect) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // Find item at position
            const item = visibleItems.find((item) => {
              const bounds = utils.getItemBounds(item);
              return (
                x >= bounds.x &&
                x <= bounds.x + bounds.width &&
                y >= bounds.y &&
                y <= bounds.y + bounds.height
              );
            });
            handleItemHover(item || null, e);
          }
        }}
      >
        {/* Render groups */}
        {state.groups.map((group) => (
          <TimelineGroupComponent
            key={group.id}
            group={group}
            mode={state.mode}
            theme={state.theme}
            settings={state.settings}
            onToggle={handleGroupToggle}
            renderGroup={renderGroup}
          >
            {group.items.map((item) => (
              <TimelineItemComponent
                key={item.id}
                item={item}
                mode={state.mode}
                theme={state.theme}
                settings={state.settings}
                isSelected={state.selectedItems.includes(item.id)}
                isHovered={hoveredItem?.id === item.id}
                isFocused={focusedItem?.id === item.id}
                readonly={readonly}
                selectable={selectable}
                editable={editable}
                draggable={draggable}
                resizable={resizable}
                onClick={handleItemClick}
                onDoubleClick={handleItemDoubleClick}
                onHover={handleItemHover}
                onUpdate={handleItemUpdate}
                onDelete={handleItemDelete}
                renderItem={renderItem}
                renderTooltip={renderTooltip}
              />
            ))}
          </TimelineGroupComponent>
        ))}

        {/* Render items not in groups */}
        {visibleItems
          .filter((item) => !item.group)
          .map((item) => (
            <TimelineItemComponent
              key={item.id}
              item={item}
              mode={state.mode}
              theme={state.theme}
              settings={state.settings}
              isSelected={state.selectedItems.includes(item.id)}
              isHovered={hoveredItem?.id === item.id}
              isFocused={focusedItem?.id === item.id}
              readonly={readonly}
              selectable={selectable}
              editable={editable}
              draggable={draggable}
              resizable={resizable}
              onClick={handleItemClick}
              onDoubleClick={handleItemDoubleClick}
              onHover={handleItemHover}
              onUpdate={handleItemUpdate}
              onDelete={handleItemDelete}
              renderItem={renderItem}
              renderTooltip={renderTooltip}
            />
          ))}
      </div>

      {/* Controls */}
      {shouldShowControls &&
        (renderControls ? (
          renderControls()
        ) : (
          <TimelineControls
            items={visibleItems}
            groups={state.groups}
            mode={state.mode}
            viewport={state.viewport}
            theme={state.theme}
            settings={state.settings}
            onViewportChange={handleViewportChange}
            onZoom={handleZoom}
            onPan={handlePan}
            onExport={handleExport}
            onImport={handleImport}
            renderMode={renderMode}
            onRenderModeChange={setRenderMode}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
          />
        ))}

      {/* Custom overlay content */}
      {renderOverlay && renderOverlay()}

      {/* Context Menu */}
      <TimelineContextMenu
        item={contextMenu.item}
        position={contextMenu.position}
        theme={state.theme}
        onClose={() => setContextMenu({ item: null, position: null })}
        onEdit={(item) => {
          setFocusedItem(item);
          setEditingItem(item);
          setContextMenu({ item: null, position: null });
          // Calculate bounds for editor positioning
          const container = containerRef.current;
          if (container) {
            const rect = container.getBoundingClientRect();
            setEditingBounds({
              x: rect.width / 2 - 150,
              y: rect.height / 2 - 100,
              width: 300,
              height: 200,
            });
          }
        }}
        onDelete={(item) => {
          actions.removeItem(item.id);
          onItemDelete?.(item.id);
          setContextMenu({ item: null, position: null });
        }}
        onDuplicate={(item) => {
          const newItem = {
            ...item,
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: `${item.title} (Copy)`,
          };
          actions.addItem(newItem);
          onItemCreate?.(newItem);
          setContextMenu({ item: null, position: null });
        }}
        onMoveToGroup={(item, groupId) => {
          actions.updateItem(item.id, { group: groupId });
          onItemUpdate?.({ ...item, group: groupId });
          setContextMenu({ item: null, position: null });
        }}
        onSetPriority={(item, priority) => {
          actions.updateItem(item.id, { priority });
          onItemUpdate?.({ ...item, priority });
          setContextMenu({ item: null, position: null });
        }}
        onSetProgress={(item, progress) => {
          actions.updateItem(item.id, { progress });
          onItemUpdate?.({ ...item, progress });
          setContextMenu({ item: null, position: null });
        }}
        onExport={(item) => {
          onExport?.("json", { items: [item] });
          setContextMenu({ item: null, position: null });
        }}
        groups={state.groups}
      />

      {/* Inline Editor */}
      {editingItem && editingBounds && (
        <TimelineInlineEditor
          item={editingItem}
          theme={state.theme}
          bounds={editingBounds}
          onSave={(updatedItem) => {
            actions.updateItem(updatedItem.id, updatedItem);
            onItemUpdate?.(updatedItem);
            setEditingItem(null);
            setEditingBounds(null);
          }}
          onCancel={() => {
            setEditingItem(null);
            setEditingBounds(null);
          }}
          onDelete={(item) => {
            actions.removeItem(item.id);
            onItemDelete?.(item.id);
            setEditingItem(null);
            setEditingBounds(null);
          }}
        />
      )}

      {/* Children */}
      {children}
    </div>
  );
});

// Export default
export default Timeline;
