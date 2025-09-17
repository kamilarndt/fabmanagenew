import { useCallback, useRef, useMemo } from 'react';

// Optimized callback hook that prevents unnecessary re-renders
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    ((...args: Parameters<T>) => {
      return callbackRef.current(...args);
    }) as T,
    deps
  );
};

// Memoized callback with deep comparison
export const useDeepCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  const prevDeps = useRef<React.DependencyList>();
  const memoizedCallback = useRef<T>();

  if (!prevDeps.current || !areEqual(prevDeps.current, deps)) {
    memoizedCallback.current = callback;
    prevDeps.current = deps;
  }

  return memoizedCallback.current as T;
};

// Helper function for deep comparison
const areEqual = (a: React.DependencyList, b: React.DependencyList): boolean => {
  if (a.length !== b.length) return false;
  
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      if (typeof a[i] === 'object' && typeof b[i] === 'object') {
        if (!deepEqual(a[i], b[i])) return false;
      } else {
        return false;
      }
    }
  }
  
  return true;
};

const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
};

// Stable callback that never changes
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    ((...args: Parameters<T>) => {
      return callbackRef.current(...args);
    }) as T,
    []
  );
};

// Callback with automatic cleanup
export const useCallbackWithCleanup = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  const cleanupRef = useRef<(() => void) | null>(null);

  const optimizedCallback = useCallback(
    ((...args: Parameters<T>) => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      return callback(...args);
    }) as T,
    deps
  );

  return optimizedCallback;
};

// Memoized callback with custom equality function
export const useCustomCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  equalityFn: (a: React.DependencyList, b: React.DependencyList) => boolean
): T => {
  const prevDeps = useRef<React.DependencyList>();
  const memoizedCallback = useRef<T>();

  if (!prevDeps.current || !equalityFn(prevDeps.current, deps)) {
    memoizedCallback.current = callback;
    prevDeps.current = deps;
  }

  return memoizedCallback.current as T;
};
