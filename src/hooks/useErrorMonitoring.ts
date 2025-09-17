import { useCallback, useEffect } from 'react';

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  errorId: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'javascript' | 'react' | 'api' | 'network' | 'unknown';
}

interface ErrorMonitoringOptions {
  enableConsoleLogging?: boolean;
  enableLocalStorage?: boolean;
  enableRemoteLogging?: boolean;
  maxLocalErrors?: number;
  remoteEndpoint?: string;
}

const defaultOptions: ErrorMonitoringOptions = {
  enableConsoleLogging: true,
  enableLocalStorage: true,
  enableRemoteLogging: false,
  maxLocalErrors: 50,
  remoteEndpoint: '/api/errors',
};

export const useErrorMonitoring = (options: ErrorMonitoringOptions = {}) => {
  const config = { ...defaultOptions, ...options };

  const logError = useCallback((error: Error, additionalInfo?: Partial<ErrorInfo>) => {
    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: localStorage.getItem('user_id') || null,
      severity: 'medium',
      category: 'javascript',
      ...additionalInfo,
    };

    // Console logging
    if (config.enableConsoleLogging) {
      console.error('Error logged:', errorInfo);
    }

    // Local storage logging
    if (config.enableLocalStorage) {
      try {
        const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
        existingErrors.push(errorInfo);
        
        // Keep only the most recent errors
        const recentErrors = existingErrors.slice(-config.maxLocalErrors!);
        localStorage.setItem('app_errors', JSON.stringify(recentErrors));
      } catch (e) {
        console.error('Failed to store error in localStorage:', e);
      }
    }

    // Remote logging
    if (config.enableRemoteLogging && config.remoteEndpoint) {
      fetch(config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo),
      }).catch((fetchError) => {
        console.error('Failed to send error to remote service:', fetchError);
      });
    }

    return errorInfo.errorId;
  }, [config]);

  const logReactError = useCallback((error: Error, errorInfo: any) => {
    return logError(error, {
      componentStack: errorInfo.componentStack,
      category: 'react',
      severity: 'high',
    });
  }, [logError]);

  const logApiError = useCallback((error: Error, endpoint: string, method: string = 'GET') => {
    return logError(error, {
      category: 'api',
      severity: 'medium',
      message: `API Error: ${method} ${endpoint} - ${error.message}`,
    });
  }, [logError]);

  const logNetworkError = useCallback((error: Error, url: string) => {
    return logError(error, {
      category: 'network',
      severity: 'medium',
      message: `Network Error: ${url} - ${error.message}`,
    });
  }, [logError]);

  const getStoredErrors = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('app_errors') || '[]');
    } catch (e) {
      console.error('Failed to retrieve errors from localStorage:', e);
      return [];
    }
  }, []);

  const clearStoredErrors = useCallback(() => {
    try {
      localStorage.removeItem('app_errors');
    } catch (e) {
      console.error('Failed to clear errors from localStorage:', e);
    }
  }, []);

  const getErrorStats = useCallback(() => {
    const errors = getStoredErrors();
    const stats = {
      total: errors.length,
      byCategory: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      recent: errors.slice(-10),
    };

    errors.forEach((error: ErrorInfo) => {
      stats.byCategory[error.category] = (stats.byCategory[error.category] || 0) + 1;
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
    });

    return stats;
  }, [getStoredErrors]);

  // Set up global error handlers
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = new Error(`Unhandled Promise Rejection: ${event.reason}`);
      logError(error, {
        category: 'javascript',
        severity: 'high',
        message: `Promise rejection: ${event.reason}`,
      });
    };

    const handleGlobalError = (event: ErrorEvent) => {
      const error = new Error(event.message);
      error.stack = event.error?.stack;
      logError(error, {
        category: 'javascript',
        severity: 'high',
        message: `Global error: ${event.message}`,
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, [logError]);

  return {
    logError,
    logReactError,
    logApiError,
    logNetworkError,
    getStoredErrors,
    clearStoredErrors,
    getErrorStats,
  };
};

export default useErrorMonitoring;
