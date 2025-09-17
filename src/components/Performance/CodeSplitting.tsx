import React, { Suspense, lazy, ComponentType } from 'react';
import { Spin, Alert } from 'antd';

// Higher-order component for code splitting
export const withCodeSplitting = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc);

  return (props: P) => (
    <Suspense fallback={fallback || <Spin size="large" />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Route-based code splitting
export const LazyRoute = withCodeSplitting(
  () => import('../pages/Materials'),
  <Spin size="large" />
);

// Component-based code splitting
export const LazyMaterials = withCodeSplitting(
  () => import('../pages/Materials')
);

export const LazyTiles = withCodeSplitting(
  () => import('../pages/Tiles')
);

export const LazyPricing = withCodeSplitting(
  () => import('../pages/Pricing')
);

export const LazyLogistics = withCodeSplitting(
  () => import('../pages/Logistics')
);

export const LazyAccommodation = withCodeSplitting(
  () => import('../pages/Accommodation')
);

export const LazyFiles = withCodeSplitting(
  () => import('../pages/Files')
);

export const LazyConcepts = withCodeSplitting(
  () => import('../pages/Concepts')
);

export const LazyDocuments = withCodeSplitting(
  () => import('../pages/Documents')
);

export const LazyMessaging = withCodeSplitting(
  () => import('../pages/Messaging')
);

// Error boundary for code splitting
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class CodeSplittingErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Code splitting error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert
          message="Failed to load component"
          description="There was an error loading this component. Please try refreshing the page."
          type="error"
          showIcon
          action={
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Refresh Page
            </button>
          }
        />
      );
    }

    return this.props.children;
  }
}

// Preload function for critical components
export const preloadComponent = (importFunc: () => Promise<any>) => {
  return () => {
    importFunc().catch((error) => {
      console.error('Failed to preload component:', error);
    });
  };
};

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload main pages
  preloadComponent(() => import('../pages/Materials'))();
  preloadComponent(() => import('../pages/Tiles'))();
  preloadComponent(() => import('../pages/Pricing'))();
  
  // Preload common components
  preloadComponent(() => import('../components/Performance/LazyImage'))();
  preloadComponent(() => import('../components/Performance/VirtualList'))();
};

// Intersection observer for lazy loading components
export const useLazyComponent = (importFunc: () => Promise<any>) => {
  const [Component, setComponent] = React.useState<ComponentType | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const observerRef = React.useRef<IntersectionObserver | null>(null);
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (elementRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !Component && !isLoading) {
            setIsLoading(true);
            importFunc()
              .then((module) => {
                setComponent(() => module.default);
                setError(null);
              })
              .catch((err) => {
                setError(err);
                console.error('Failed to load component:', err);
              })
              .finally(() => {
                setIsLoading(false);
              });
          }
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(elementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [importFunc, Component, isLoading]);

  return {
    Component,
    isLoading,
    error,
    elementRef,
  };
};
