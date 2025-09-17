/**
 * Connection Monitor - automatycznie sprawdza połączenie z bazą danych
 * i przełącza na lokalną bazę w przypadku problemów
 */

import React from "react";
import { config } from "./config";

export interface ConnectionStatus {
  isConnected: boolean;
  source: "database" | "local" | "mock";
  lastCheck: Date;
  error?: string;
}

class ConnectionMonitor {
  private status: ConnectionStatus = {
    isConnected: false,
    source: "mock",
    lastCheck: new Date(),
  };

  private checkInterval: NodeJS.Timeout | null = null;
  private listeners: Array<(status: ConnectionStatus) => void> = [];

  constructor() {
    this.startMonitoring();
  }

  /**
   * Sprawdza połączenie z API backendu
   */
  async checkApiConnection(): Promise<boolean> {
    // If Supabase is not configured, don't try to connect
    if (!config.supabaseUrl || !config.supabaseKey) {
      console.warn("🔌 Supabase not configured, skipping API connection check");
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

      // Check both health and database status
      const [healthResponse, dbResponse] = await Promise.all([
        fetch(`${config.apiBaseUrl}/health`, {
          method: "GET",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
        }),
        fetch(`${config.apiBaseUrl}/database/status`, {
          method: "GET",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      clearTimeout(timeoutId);
      return healthResponse.ok && dbResponse.ok;
    } catch (error) {
      console.warn("🔌 API connection check failed:", error);
      return false;
    }
  }

  /**
   * Sprawdza i aktualizuje status połączenia
   */
  async updateConnectionStatus(): Promise<ConnectionStatus> {
    const isApiConnected = await this.checkApiConnection();

    let newStatus: ConnectionStatus;

    if (isApiConnected) {
      newStatus = {
        isConnected: true,
        source: "database",
        lastCheck: new Date(),
      };
      console.warn("✅ Database connection active");
    } else {
      // Fallback na lokalne dane
      newStatus = {
        isConnected: false,
        source: config.useMockData ? "mock" : "local",
        lastCheck: new Date(),
        error: "Backend API not available",
      };
      console.warn(
        "⚠️ Database disconnected, using fallback:",
        newStatus.source
      );
    }

    // Aktualizuj status tylko jeśli się zmienił
    if (
      this.status.source !== newStatus.source ||
      this.status.isConnected !== newStatus.isConnected
    ) {
      this.status = newStatus;
      this.notifyListeners();
    } else {
      this.status.lastCheck = newStatus.lastCheck;
    }

    return this.status;
  }

  /**
   * Rozpoczyna monitorowanie połączenia
   */
  startMonitoring(intervalMs = 30000) {
    // Check every 30 seconds
    this.stopMonitoring();

    // Immediate check
    this.updateConnectionStatus();

    // Periodic checks
    this.checkInterval = setInterval(() => {
      this.updateConnectionStatus();
    }, intervalMs);

    console.warn("🔍 Connection monitoring started");
  }

  /**
   * Zatrzymuje monitorowanie
   */
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Pobiera aktualny status połączenia
   */
  getStatus(): ConnectionStatus {
    return { ...this.status };
  }

  /**
   * Dodaje listener na zmiany statusu
   */
  onStatusChange(callback: (status: ConnectionStatus) => void) {
    this.listeners.push(callback);

    // Immediately call with current status
    callback(this.getStatus());

    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Powiadamia wszystkich listenerów o zmianie statusu
   */
  private notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback(this.getStatus());
      } catch (error) {
        console.error("Error in connection status listener:", error);
      }
    });
  }

  /**
   * Ręczne wymuszenie sprawdzenia połączenia
   */
  async forceCheck(): Promise<ConnectionStatus> {
    return await this.updateConnectionStatus();
  }

  /**
   * Sprawdza czy można używać bazy danych
   */
  canUseDatabase(): boolean {
    return this.status.isConnected && this.status.source === "database";
  }

  /**
   * Zwraca odpowiednią strategię dla API calls
   */
  getApiStrategy(): "database" | "local" | "mock" {
    return this.status.source;
  }
}

// Singleton instance
export const connectionMonitor = new ConnectionMonitor();

// Hook dla React komponentów
export function useConnectionStatus() {
  const [status, setStatus] = React.useState<ConnectionStatus>(
    connectionMonitor.getStatus()
  );

  React.useEffect(() => {
    const unsubscribe = connectionMonitor.onStatusChange(setStatus);
    return unsubscribe;
  }, []);

  return {
    status,
    forceCheck: () => connectionMonitor.forceCheck(),
    canUseDatabase: connectionMonitor.canUseDatabase(),
    strategy: connectionMonitor.getApiStrategy(),
  };
}
