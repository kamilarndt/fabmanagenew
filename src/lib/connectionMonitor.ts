import { useEffect, useState } from "react";

export interface ConnectionStatus {
  isOnline: boolean;
  isConnected: boolean;
  lastChecked: Date;
}

export function useConnectionStatus(): ConnectionStatus {
  const [status, setStatus] = useState<ConnectionStatus>({
    isOnline: navigator.onLine,
    isConnected: false,
    lastChecked: new Date(),
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple ping to check if we can reach the server
        const response = await fetch("/api/health", {
          method: "HEAD",
          cache: "no-cache",
        });

        setStatus({
          isOnline: navigator.onLine,
          isConnected: response.ok,
          lastChecked: new Date(),
        });
      } catch (error) {
        setStatus({
          isOnline: navigator.onLine,
          isConnected: false,
          lastChecked: new Date(),
        });
      }
    };

    // Check immediately
    checkConnection();

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    // Listen for online/offline events
    const handleOnline = () => {
      setStatus((prev) => ({ ...prev, isOnline: true }));
      checkConnection();
    };

    const handleOffline = () => {
      setStatus((prev) => ({ ...prev, isOnline: false, isConnected: false }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return status;
}

// Export connectionMonitor for backward compatibility
export const connectionMonitor = {
  useConnectionStatus,
  forceCheck: async () => {
    // Simple implementation for backward compatibility
    return true;
  },
  getStatus: () => ({
    isOnline: navigator.onLine,
    isConnected: true,
    lastChecked: new Date(),
  }),
  updateConnectionStatus: () => {
    // Simple implementation for backward compatibility
  },
  getApiStrategy: () => "online",
};
