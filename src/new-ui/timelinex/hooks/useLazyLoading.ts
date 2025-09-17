/**
 * Lazy Loading Hook for TimelineX
 * Implements progressive loading of timeline data for better performance with large datasets
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TimelineItem, TimelineGroup, TimelineViewport } from '../types';

export interface LazyLoadingOptions {
  batchSize: number;
  loadDelay: number; // ms
  preloadDistance: number; // pixels
  enableTimeBasedLoading: boolean;
  enableGroupBasedLoading: boolean;
  maxConcurrentRequests: number;
  cacheSize: number;
}

export interface LazyLoadingState {
  isLoading: boolean;
  loadedItems: TimelineItem[];
  loadedGroups: TimelineGroup[];
  totalItems: number;
  totalGroups: number;
  loadedPercentage: number;
  currentBatch: number;
  totalBatches: number;
  error: string | null;
  cache: Map<string, TimelineItem[]>;
}

export interface LazyLoadingActions {
  loadMore: () => Promise<void>;
  loadTimeRange: (start: number, end: number) => Promise<void>;
  loadGroup: (groupId: string) => Promise<void>;
  preload: (viewport: TimelineViewport) => Promise<void>;
  clearCache: () => void;
  refresh: () => Promise<void>;
}

export interface UseLazyLoadingReturn {
  state: LazyLoadingState;
  actions: LazyLoadingActions;
}

export interface LazyLoadingDataSource {
  getItems: (offset: number, limit: number, filters?: any) => Promise<{
    items: TimelineItem[];
    total: number;
    hasMore: boolean;
  }>;
  getGroups: (offset: number, limit: number) => Promise<{
    groups: TimelineGroup[];
    total: number;
    hasMore: boolean;
  }>;
  getItemsByTimeRange: (start: number, end: number) => Promise<TimelineItem[]>;
  getItemsByGroup: (groupId: string) => Promise<TimelineItem[]>;
}

export function useLazyLoading(
  dataSource: LazyLoadingDataSource,
  viewport: TimelineViewport,
  options: Partial<LazyLoadingOptions> = {}
): UseLazyLoadingReturn {
  const {
    batchSize = 100,
    loadDelay = 100,
    preloadDistance = 200,
    enableTimeBasedLoading = true,
    enableGroupBasedLoading = true,
    maxConcurrentRequests = 3,
    cacheSize = 1000,
  } = options;

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [loadedItems, setLoadedItems] = useState<TimelineItem[]>([]);
  const [loadedGroups, setLoadedGroups] = useState<TimelineGroup[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<Map<string, TimelineItem[]>>(new Map());

  // Refs
  const loadingQueue = useRef<Promise<any>[]>([]);
  const abortController = useRef<AbortController | null>(null);
  const lastLoadTime = useRef<number>(0);

  // Calculate derived state
  const totalBatches = Math.ceil(totalItems / batchSize);
  const loadedPercentage = totalItems > 0 ? (loadedItems.length / totalItems) * 100 : 0;

  // Initialize loading
  useEffect(() => {
    loadInitialData();
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  // Preload data based on viewport changes
  useEffect(() => {
    if (enableTimeBasedLoading) {
      preloadTimeRange(viewport);
    }
  }, [viewport, enableTimeBasedLoading]);

  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load initial batch of items
      const itemsResult = await dataSource.getItems(0, batchSize);
      setLoadedItems(itemsResult.items);
      setTotalItems(itemsResult.total);

      // Load initial batch of groups
      const groupsResult = await dataSource.getGroups(0, batchSize);
      setLoadedGroups(groupsResult.groups);
      setTotalGroups(groupsResult.total);

      setCurrentBatch(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load initial data');
    } finally {
      setIsLoading(false);
    }
  }, [dataSource, batchSize]);

  const loadMore = useCallback(async () => {
    if (isLoading || currentBatch >= totalBatches) return;

    try {
      setIsLoading(true);
      setError(null);

      const offset = currentBatch * batchSize;
      const result = await dataSource.getItems(offset, batchSize);
      
      setLoadedItems(prev => [...prev, ...result.items]);
      setCurrentBatch(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more items');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, currentBatch, totalBatches, batchSize, dataSource]);

  const loadTimeRange = useCallback(async (start: number, end: number) => {
    const cacheKey = `time-${start}-${end}`;
    
    // Check cache first
    if (cache.has(cacheKey)) {
      const cachedItems = cache.get(cacheKey)!;
      setLoadedItems(prev => {
        const newItems = [...prev];
        cachedItems.forEach(item => {
          if (!newItems.find(existing => existing.id === item.id)) {
            newItems.push(item);
          }
        });
        return newItems;
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const items = await dataSource.getItemsByTimeRange(start, end);
      
      // Update cache
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.set(cacheKey, items);
        
        // Limit cache size
        if (newCache.size > cacheSize) {
          const firstKey = newCache.keys().next().value;
          newCache.delete(firstKey);
        }
        
        return newCache;
      });

      setLoadedItems(prev => {
        const newItems = [...prev];
        items.forEach(item => {
          if (!newItems.find(existing => existing.id === item.id)) {
            newItems.push(item);
          }
        });
        return newItems;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load time range');
    } finally {
      setIsLoading(false);
    }
  }, [dataSource, cache, cacheSize]);

  const loadGroup = useCallback(async (groupId: string) => {
    if (!enableGroupBasedLoading) return;

    const cacheKey = `group-${groupId}`;
    
    // Check cache first
    if (cache.has(cacheKey)) {
      const cachedItems = cache.get(cacheKey)!;
      setLoadedItems(prev => {
        const newItems = [...prev];
        cachedItems.forEach(item => {
          if (!newItems.find(existing => existing.id === item.id)) {
            newItems.push(item);
          }
        });
        return newItems;
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const items = await dataSource.getItemsByGroup(groupId);
      
      // Update cache
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.set(cacheKey, items);
        
        // Limit cache size
        if (newCache.size > cacheSize) {
          const firstKey = newCache.keys().next().value;
          newCache.delete(firstKey);
        }
        
        return newCache;
      });

      setLoadedItems(prev => {
        const newItems = [...prev];
        items.forEach(item => {
          if (!newItems.find(existing => existing.id === item.id)) {
            newItems.push(item);
          }
        });
        return newItems;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load group');
    } finally {
      setIsLoading(false);
    }
  }, [dataSource, enableGroupBasedLoading, cache, cacheSize]);

  const preloadTimeRange = useCallback(async (currentViewport: TimelineViewport) => {
    const now = Date.now();
    if (now - lastLoadTime.current < loadDelay) return;

    lastLoadTime.current = now;

    // Calculate preload range
    const viewportDuration = currentViewport.end - currentViewport.start;
    const preloadDuration = viewportDuration * 0.5; // 50% of viewport

    const preloadStart = currentViewport.start - preloadDuration;
    const preloadEnd = currentViewport.end + preloadDuration;

    // Check if we need to load more data
    const hasDataInRange = loadedItems.some(item => 
      item.start >= preloadStart && item.start <= preloadEnd
    );

    if (!hasDataInRange) {
      loadTimeRange(preloadStart, preloadEnd);
    }
  }, [loadDelay, loadTimeRange, loadedItems]);

  const preload = useCallback(async (currentViewport: TimelineViewport) => {
    await preloadTimeRange(currentViewport);
  }, [preloadTimeRange]);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  const refresh = useCallback(async () => {
    setLoadedItems([]);
    setLoadedGroups([]);
    setCurrentBatch(0);
    setError(null);
    clearCache();
    await loadInitialData();
  }, [loadInitialData, clearCache]);

  // State object
  const state: LazyLoadingState = {
    isLoading,
    loadedItems,
    loadedGroups,
    totalItems,
    totalGroups,
    loadedPercentage,
    currentBatch,
    totalBatches,
    error,
    cache,
  };

  // Actions object
  const actions: LazyLoadingActions = {
    loadMore,
    loadTimeRange,
    loadGroup,
    preload,
    clearCache,
    refresh,
  };

  return {
    state,
    actions,
  };
}

// Utility function to create a mock data source for testing
export function createMockDataSource(
  totalItems: number = 10000,
  totalGroups: number = 100
): LazyLoadingDataSource {
  const generateMockItem = (id: number): TimelineItem => ({
    id: `item-${id}`,
    title: `Item ${id}`,
    start: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
    end: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
    groupId: `group-${Math.floor(Math.random() * totalGroups)}`,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    progress: Math.random(),
    priority: Math.random(),
  });

  const generateMockGroup = (id: number): TimelineGroup => ({
    id: `group-${id}`,
    title: `Group ${id}`,
    items: [],
  });

  return {
    getItems: async (offset: number, limit: number) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      const items = Array.from({ length: Math.min(limit, totalItems - offset) }, (_, i) =>
        generateMockItem(offset + i)
      );
      
      return {
        items,
        total: totalItems,
        hasMore: offset + limit < totalItems,
      };
    },

    getGroups: async (offset: number, limit: number) => {
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      
      const groups = Array.from({ length: Math.min(limit, totalGroups - offset) }, (_, i) =>
        generateMockGroup(offset + i)
      );
      
      return {
        groups,
        total: totalGroups,
        hasMore: offset + limit < totalGroups,
      };
    },

    getItemsByTimeRange: async (start: number, end: number) => {
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      const items = Array.from({ length: Math.floor(Math.random() * 50) }, (_, i) =>
        generateMockItem(i)
      ).filter(item => item.start.getTime() >= start && item.start.getTime() <= end);
      
      return items;
    },

    getItemsByGroup: async (groupId: string) => {
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      const items = Array.from({ length: Math.floor(Math.random() * 20) }, (_, i) =>
        generateMockItem(i)
      ).map(item => ({ ...item, groupId }));
      
      return items;
    },
  };
}

