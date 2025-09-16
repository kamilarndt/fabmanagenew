import type { ModalProps } from "antd";
import { Modal as AntModal, ConfigProvider } from "antd";
import React from "react";

interface AppModalProps extends ModalProps {
  variant?: "default" | "confirm" | "info" | "success" | "warning" | "error";
  size?: "small" | "medium" | "large";
  centered?: boolean;
  maskClosable?: boolean;
  closable?: boolean;
  destroyOnClose?: boolean;
}

export function AppModal({
  variant = "default",
  size = "medium",
  centered = true,
  maskClosable = true,
  closable = true,
  destroyOnClose = false,
  className,
  style,
  children,
  ...props
}: AppModalProps) {
  const getModalWidth = (): number => {
    switch (size) {
      case "small":
        return 400;
      case "large":
        return 800;
      default:
        return 520;
    }
  };

  const modalStyles: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    ...style,
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "confirm":
        return {
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--accent-warning)",
        };
      case "info":
        return {
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--accent-info)",
        };
      case "success":
        return {
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--accent-success)",
        };
      case "warning":
        return {
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--accent-warning)",
        };
      case "error":
        return {
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--accent-error)",
        };
      default:
        return {
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-main)",
        };
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            borderRadius: 6,
            fontFamily: "var(--font-family)",
            colorText: "var(--text-primary)",
            colorTextHeading: "var(--text-primary)",
            colorBgElevated: "var(--bg-card)",
            colorBgMask: "var(--bg-overlay)",
            colorBorder: "var(--border-main)",
            colorPrimary: "var(--primary-main)",
          },
        },
      }}
    >
      <AntModal
        width={getModalWidth()}
        centered={centered}
        maskClosable={maskClosable}
        closable={closable}
        destroyOnClose={destroyOnClose}
        className={className}
        style={{
          ...modalStyles,
          ...getVariantStyles(),
        }}
        styles={{
          header: {
            backgroundColor: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-main)",
            color: "var(--text-primary)",
          },
          body: {
            backgroundColor: "var(--bg-card)",
            color: "var(--text-primary)",
          },
          footer: {
            backgroundColor: "var(--bg-secondary)",
            borderTop: "1px solid var(--border-main)",
          },
        }}
        data-component="AppModal"
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {children}
      </AntModal>
    </ConfigProvider>
  );
}

// Specialized modal variants
export function AppConfirmModal({
  title = "Potwierdź akcję",
  content = "Czy na pewno chcesz wykonać tę akcję?",
  onConfirm,
  onCancel,
  ...props
}: {
  title?: string;
  content?: string;
  onConfirm: () => void;
  onCancel: () => void;
} & Omit<AppModalProps, "children">) {
  return (
    <AppModal
      variant="confirm"
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      {...props}
    >
      {content}
    </AppModal>
  );
}

export function AppInfoModal({
  title = "Informacja",
  content,
  onClose,
  ...props
}: {
  title?: string;
  content: React.ReactNode;
  onClose: () => void;
} & Omit<AppModalProps, "children">) {
  return (
    <AppModal
      variant="info"
      title={title}
      onCancel={onClose}
      footer={null}
      {...props}
    >
      {content}
    </AppModal>
  );
}

export function AppSuccessModal({
  title = "Sukces",
  content,
  onClose,
  ...props
}: {
  title?: string;
  content: React.ReactNode;
  onClose: () => void;
} & Omit<AppModalProps, "children">) {
  return (
    <AppModal
      variant="success"
      title={title}
      onCancel={onClose}
      footer={null}
      {...props}
    >
      {content}
    </AppModal>
  );
}

export function AppErrorModal({
  title = "Błąd",
  content,
  onClose,
  ...props
}: {
  title?: string;
  content: React.ReactNode;
  onClose: () => void;
} & Omit<AppModalProps, "children">) {
  return (
    <AppModal
      variant="error"
      title={title}
      onCancel={onClose}
      footer={null}
      {...props}
    >
      {content}
    </AppModal>
  );
}

export default AppModal;
