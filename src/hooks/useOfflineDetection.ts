import { message } from "@/new-ui/utils/message";
import React, { useEffect, useState } from "react";

interface OfflineState {
  isOnline: boolean;
  wasOffline: boolean;
  offlineSince?: Date;
}

export function useOfflineDetection() {
  const [state, setState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    wasOffline: false,
  });

  useEffect(() => {
    const handleOnline = () => {
      setState((prev) => {
        const wasOffline = !prev.isOnline;

        if (wasOffline) {
          message.success("Połączenie internetowe zostało przywrócone");
        }

        return {
          isOnline: true,
          wasOffline,
          offlineSince: undefined,
        };
      });
    };

    const handleOffline = () => {
      setState((prev) => ({
        isOnline: false,
        wasOffline: prev.isOnline,
        offlineSince: new Date(),
      }));

      message.warning({
        content:
          "Brak połączenia internetowego. Aplikacja działa w trybie offline.",
        duration: 0, // Don't auto-hide
        key: "offline-warning",
      });
    };

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      // Hide offline message when component unmounts
      message.destroy("offline-warning");
    };
  }, []);

  return state;
}

// Higher-order component for offline handling
export function withOfflineDetection<P extends object>(
  Component: React.ComponentType<P>
) {
  return function OfflineWrapper(props: P) {
    const offlineState = useOfflineDetection();

    return React.createElement(Component, { ...props, offlineState });
  };
}

export default useOfflineDetection;
