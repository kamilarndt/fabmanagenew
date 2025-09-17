// Simple message utility to replace Ant Design message
export type MessageType = "success" | "error" | "warning" | "info";

export interface MessageOptions {
  duration?: number;
  onClose?: () => void;
}

class MessageManager {
  private messages: Array<{
    id: string;
    type: MessageType;
    content: string;
    options: MessageOptions;
  }> = [];
  private listeners: Array<() => void> = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getMessages() {
    return this.messages;
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  private addMessage(
    type: MessageType,
    content: string,
    options: MessageOptions = {}
  ) {
    const id = Math.random().toString(36).substr(2, 9);
    const message = { id, type, content, options };

    this.messages.push(message);
    this.notify();

    // Auto remove after duration
    const duration = options.duration || 3000;
    setTimeout(() => {
      this.removeMessage(id);
    }, duration);

    return id;
  }

  private removeMessage(id: string) {
    this.messages = this.messages.filter((m) => m.id !== id);
    this.notify();
  }

  success(content: string, options?: MessageOptions) {
    return this.addMessage("success", content, options);
  }

  error(content: string, options?: MessageOptions) {
    return this.addMessage("error", content, options);
  }

  warning(content: string, options?: MessageOptions) {
    return this.addMessage("warning", content, options);
  }

  info(content: string, options?: MessageOptions) {
    return this.addMessage("info", content, options);
  }

  destroy(key?: string) {
    if (key) {
      this.removeMessage(key);
    } else {
      this.messages = [];
      this.notify();
    }
  }
}

export const message = new MessageManager();
