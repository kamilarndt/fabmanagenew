// Simple notification utility to replace Ant Design notification
export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}

class NotificationManager {
  private notifications: Array<{
    id: string;
    type: NotificationType;
    title?: string;
    description?: string;
    options: NotificationOptions;
  }> = [];
  private listeners: Array<() => void> = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getNotifications() {
    return this.notifications;
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  private addNotification(
    type: NotificationType,
    title: string,
    description?: string,
    options: NotificationOptions = {}
  ) {
    const id = Math.random().toString(36).substr(2, 9);
    const notification = { id, type, title, description, options };

    this.notifications.push(notification);
    this.notify();

    // Auto remove after duration
    const duration = options.duration || 4500;
    setTimeout(() => {
      this.removeNotification(id);
    }, duration);

    return id;
  }

  private removeNotification(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }

  success(title: string, description?: string, options?: NotificationOptions) {
    return this.addNotification("success", title, description, options);
  }

  error(title: string, description?: string, options?: NotificationOptions) {
    return this.addNotification("error", title, description, options);
  }

  warning(title: string, description?: string, options?: NotificationOptions) {
    return this.addNotification("warning", title, description, options);
  }

  info(title: string, description?: string, options?: NotificationOptions) {
    return this.addNotification("info", title, description, options);
  }
}

export const notification = new NotificationManager();
