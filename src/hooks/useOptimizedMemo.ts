import { useMemo, useRef } from 'react';

// Optimized memo hook with deep comparison
export const useOptimizedMemo = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  const prevDeps = useRef<React.DependencyList>();
  const memoizedValue = useRef<T>();

  if (!prevDeps.current || !areEqual(prevDeps.current, deps)) {
    memoizedValue.current = factory();
    prevDeps.current = deps;
  }

  return memoizedValue.current as T;
};

// Memo with custom equality function
export const useCustomMemo = <T>(
  factory: () => T,
  deps: React.DependencyList,
  equalityFn: (a: React.DependencyList, b: React.DependencyList) => boolean
): T => {
  const prevDeps = useRef<React.DependencyList>();
  const memoizedValue = useRef<T>();

  if (!prevDeps.current || !equalityFn(prevDeps.current, deps)) {
    memoizedValue.current = factory();
    prevDeps.current = deps;
  }

  return memoizedValue.current as T;
};

// Memo with shallow comparison
export const useShallowMemo = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  const prevDeps = useRef<React.DependencyList>();
  const memoizedValue = useRef<T>();

  if (!prevDeps.current || !shallowEqual(prevDeps.current, deps)) {
    memoizedValue.current = factory();
    prevDeps.current = deps;
  }

  return memoizedValue.current as T;
};

// Memo with reference equality
export const useRefMemo = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  const prevDeps = useRef<React.DependencyList>();
  const memoizedValue = useRef<T>();

  if (!prevDeps.current || !refEqual(prevDeps.current, deps)) {
    memoizedValue.current = factory();
    prevDeps.current = deps;
  }

  return memoizedValue.current as T;
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

// Helper function for shallow comparison
const shallowEqual = (a: React.DependencyList, b: React.DependencyList): boolean => {
  if (a.length !== b.length) return false;
  
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  
  return true;
};

// Helper function for reference equality
const refEqual = (a: React.DependencyList, b: React.DependencyList): boolean => {
  if (a.length !== b.length) return false;
  
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  
  return true;
};
