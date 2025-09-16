import { message, notification } from "antd";

export type NotificationType = "success" | "error" | "info" | "warning";
export type ToastVariant = "success" | "danger" | "info" | "warning";

export interface NotificationOptions {
  duration?: number;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  description?: string;
  icon?: React.ReactNode;
  btn?: React.ReactNode;
  onClick?: () => void;
  onClose?: () => void;
}

export interface ToastOptions {
  duration?: number;
  maxCount?: number;
  top?: number;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
}

// Enhanced toast function with more options
export function showToast(
  messageText: string,
  variant: ToastVariant = "success",
  options?: ToastOptions
) {
  const type = variant === "danger" ? "error" : variant;
  const config = {
    duration: 3,
    ...options,
  };

  message[type](messageText, config.duration);
}

// Enhanced notification function with more options
export function showNotification(
  title: string,
  description?: string,
  type: NotificationType = "success",
  options?: NotificationOptions
) {
  const config = {
    duration: 4.5,
    placement: "topRight" as const,
    ...options,
  };

  notification[type]({
    message: title,
    description,
    duration: config.duration,
    placement: config.placement,
    icon: config.icon,
    btn: config.btn,
    onClick: config.onClick,
    onClose: config.onClose,
  });
}

// Specialized notification functions for common use cases
export function showSuccessNotification(
  title: string,
  description?: string,
  options?: NotificationOptions
) {
  showNotification(title, description, "success", options);
}

export function showErrorNotification(
  title: string,
  description?: string,
  options?: NotificationOptions
) {
  showNotification(title, description, "error", options);
}

export function showWarningNotification(
  title: string,
  description?: string,
  options?: NotificationOptions
) {
  showNotification(title, description, "warning", options);
}

export function showInfoNotification(
  title: string,
  description?: string,
  options?: NotificationOptions
) {
  showNotification(title, description, "info", options);
}

// Specialized toast functions
export function showSuccessToast(messageText: string, options?: ToastOptions) {
  showToast(messageText, "success", options);
}

export function showErrorToast(messageText: string, options?: ToastOptions) {
  showToast(messageText, "danger", options);
}

export function showWarningToast(messageText: string, options?: ToastOptions) {
  showToast(messageText, "warning", options);
}

export function showInfoToast(messageText: string, options?: ToastOptions) {
  showToast(messageText, "info", options);
}

// Confirmation dialog helper
export function showConfirmDialog(
  title: string,
  content: string,
  onConfirm: () => void,
  onCancel?: () => void
) {
  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Potwierdź";
  confirmButton.style.cssText =
    "background: #ff4d4f; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; margin-right: 8px";
  confirmButton.onclick = () => {
    onConfirm();
    notification.destroy();
  };

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Anuluj";
  cancelButton.style.cssText =
    "background: #d9d9d9; color: black; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer";
  cancelButton.onclick = () => {
    onCancel?.();
    notification.destroy();
  };

  const buttonContainer = document.createElement("div");
  buttonContainer.style.cssText = "display: flex; gap: 8px";
  buttonContainer.appendChild(confirmButton);
  buttonContainer.appendChild(cancelButton);

  notification.warning({
    message: title,
    description: content,
    duration: 0, // Don't auto-close
    btn: buttonContainer as any,
  });
}

// Loading notification helper
export function showLoadingNotification(title: string, description?: string) {
  const key = `loading-${Date.now()}`;

  const loadingIcon = document.createElement("div");
  loadingIcon.className = "ant-spin ant-spin-sm";

  notification.info({
    key,
    message: title,
    description,
    duration: 0, // Don't auto-close
    icon: loadingIcon as any,
  });

  return {
    update: (newTitle: string, newDescription?: string) => {
      const newLoadingIcon = document.createElement("div");
      newLoadingIcon.className = "ant-spin ant-spin-sm";

      notification.info({
        key,
        message: newTitle,
        description: newDescription,
        duration: 0,
        icon: newLoadingIcon as any,
      });
    },
    close: () => {
      notification.destroy(key);
    },
  };
}

// Batch operations helper
export function showBatchNotification(
  total: number,
  success: number,
  errors: number,
  type: "create" | "update" | "delete" = "update"
) {
  const actionText = {
    create: "utworzono",
    update: "zaktualizowano",
    delete: "usunięto",
  }[type];

  if (errors === 0) {
    showSuccessNotification(
      `Operacja zakończona pomyślnie`,
      `Wszystkie ${total} elementów zostało ${actionText}`
    );
  } else if (success === 0) {
    showErrorNotification(
      `Operacja nieudana`,
      `Żaden z ${total} elementów nie został ${actionText}`
    );
  } else {
    showWarningNotification(
      `Operacja częściowo udana`,
      `${success} z ${total} elementów zostało ${actionText}, ${errors} błędów`
    );
  }
}

// Clear all notifications
export function clearAllNotifications() {
  notification.destroy();
  message.destroy();
}
