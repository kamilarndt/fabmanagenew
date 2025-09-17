// TimelineX Drag & Drop Hook
// Handles drag and drop interactions for timeline items

import { useCallback, useEffect, useRef, useState } from 'react';
import { TimelineItem } from '../types';

export interface UseTimelineDragDropProps {
  onItemDrag?: (item: TimelineItem, newPosition: { start: Date; end?: Date }) => void;
  onItemResize?: (item: TimelineItem, newDuration: { start: Date; end: Date }) => void;
  onItemDrop?: (item: TimelineItem, targetGroup?: string) => void;
  enabled?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
  snapToItems?: boolean;
}

export function useTimelineDragDrop({
  onItemDrag,
  onItemResize,
  onItemDrop,
  enabled = true,
  snapToGrid = false,
  gridSize = 20,
  snapToItems = true,
}: UseTimelineDragDropProps) {
  const dragStateRef = useRef({
    isDragging: false,
    isResizing: false,
    dragItem: null as TimelineItem | null,
    dragStart: { x: 0, y: 0 },
    resizeHandle: null as 'left' | 'right' | null,
    originalPosition: { start: new Date(), end: new Date() },
    snapPoints: [] as { x: number; y: number; type: 'grid' | 'item' }[],
  });

  const [dragPreview, setDragPreview] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    item: TimelineItem;
  } | null>(null);

  // Calculate snap position
  const calculateSnapPosition = useCallback((x: number, y: number) => {
    const dragState = dragStateRef.current;
    let snappedX = x;
    let snappedY = y;

    if (snapToGrid) {
      snappedX = Math.round(x / gridSize) * gridSize;
      snappedY = Math.round(y / gridSize) * gridSize;
    }

    if (snapToItems && dragState.snapPoints.length > 0) {
      const snapThreshold = 10;
      let closestSnap = null;
      let closestDistance = Infinity;

      for (const snapPoint of dragState.snapPoints) {
        const distance = Math.sqrt(
          Math.pow(x - snapPoint.x, 2) + Math.pow(y - snapPoint.y, 2)
        );
        
        if (distance < snapThreshold && distance < closestDistance) {
          closestDistance = distance;
          closestSnap = snapPoint;
        }
      }

      if (closestSnap) {
        snappedX = closestSnap.x;
        snappedY = closestSnap.y;
      }
    }

    return { x: snappedX, y: snappedY };
  }, [snapToGrid, gridSize, snapToItems]);

  // Handle mouse down for drag start
  const handleMouseDown = useCallback((event: React.MouseEvent, item: TimelineItem, handle?: 'left' | 'right') => {
    if (!enabled || !item.isDraggable) return;

    event.preventDefault();
    event.stopPropagation();

    const dragState = dragStateRef.current;
    dragState.isDragging = !handle;
    dragState.isResizing = !!handle;
    dragState.dragItem = item;
    dragState.dragStart = { x: event.clientX, y: event.clientY };
    dragState.resizeHandle = handle || null;
    dragState.originalPosition = {
      start: item.start,
      end: item.end || item.start,
    };

    // Set up drag preview
    setDragPreview({
      x: event.clientX,
      y: event.clientY,
      width: 100, // This would be calculated from actual item bounds
      height: 32,
      item,
    });
  }, [enabled]);

  // Handle mouse move for drag/resize
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const dragState = dragStateRef.current;
    
    if (!dragState.isDragging && !dragState.isResizing) return;
    if (!dragState.dragItem) return;

    const deltaX = event.clientX - dragState.dragStart.x;
    const deltaY = event.clientY - dragState.dragStart.y;

    if (dragState.isDragging) {
      // Handle drag
      const newPosition = calculateSnapPosition(
        dragState.originalPosition.start.getTime() + deltaX * 1000, // Convert to time
        dragState.originalPosition.start.getTime() + deltaY * 1000
      );

      const newStart = new Date(newPosition.x);
      const newEnd = dragState.originalPosition.end ? 
        new Date(dragState.originalPosition.end.getTime() + deltaX * 1000) : 
        undefined;

      onItemDrag?.(dragState.dragItem, {
        start: newStart,
        end: newEnd,
      });

      // Update drag preview
      setDragPreview(prev => prev ? {
        ...prev,
        x: event.clientX,
        y: event.clientY,
      } : null);
    } else if (dragState.isResizing) {
      // Handle resize
      const duration = dragState.originalPosition.end.getTime() - dragState.originalPosition.start.getTime();
      const newDuration = duration + deltaX * 1000; // Convert to time
      
      if (dragState.resizeHandle === 'right') {
        const newEnd = new Date(dragState.originalPosition.start.getTime() + newDuration);
        onItemResize?.(dragState.dragItem, {
          start: dragState.originalPosition.start,
          end: newEnd,
        });
      } else if (dragState.resizeHandle === 'left') {
        const newStart = new Date(dragState.originalPosition.end.getTime() - newDuration);
        onItemResize?.(dragState.dragItem, {
          start: newStart,
          end: dragState.originalPosition.end,
        });
      }
    }
  }, [calculateSnapPosition, onItemDrag, onItemResize]);

  // Handle mouse up for drag end
  const handleMouseUp = useCallback((event: MouseEvent) => {
    const dragState = dragStateRef.current;
    
    if (!dragState.isDragging && !dragState.isResizing) return;
    if (!dragState.dragItem) return;

    // Handle drop
    if (dragState.isDragging) {
      onItemDrop?.(dragState.dragItem);
    }

    // Reset drag state
    dragState.isDragging = false;
    dragState.isResizing = false;
    dragState.dragItem = null;
    dragState.resizeHandle = null;
    setDragPreview(null);
  }, [onItemDrop]);

  // Set up global mouse events
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, enabled]);

  // Update snap points
  const updateSnapPoints = useCallback((items: TimelineItem[]) => {
    const dragState = dragStateRef.current;
    dragState.snapPoints = [];

    // Add grid snap points
    if (snapToGrid) {
      for (let x = 0; x < 1000; x += gridSize) {
        for (let y = 0; y < 1000; y += gridSize) {
          dragState.snapPoints.push({
            x,
            y,
            type: 'grid',
          });
        }
      }
    }

    // Add item snap points
    if (snapToItems) {
      items.forEach(item => {
        // This would be calculated from actual item bounds
        const bounds = { x: 0, y: 0, width: 100, height: 32 };
        
        dragState.snapPoints.push(
          { x: bounds.x, y: bounds.y, type: 'item' },
          { x: bounds.x + bounds.width, y: bounds.y, type: 'item' },
          { x: bounds.x, y: bounds.y + bounds.height, type: 'item' },
          { x: bounds.x + bounds.width, y: bounds.y + bounds.height, type: 'item' }
        );
      });
    }
  }, [snapToGrid, gridSize, snapToItems]);

  return {
    handleMouseDown,
    updateSnapPoints,
    dragPreview,
    isDragging: dragStateRef.current.isDragging,
    isResizing: dragStateRef.current.isResizing,
  };
}
