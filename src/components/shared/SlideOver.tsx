import { ConfigProvider, Drawer, Space } from "antd";
import React from "react";
import { AppButton } from "../ui/AppButton";
import { Body, H4 } from "../ui/Typography";

interface SlideOverProps {
  open: boolean;
  title?: string;
  width?: number | string;
  onClose: () => void;
  headerExtra?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  placement?: "left" | "right" | "top" | "bottom";
  closable?: boolean;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function SlideOver({
  open,
  title,
  width = 520,
  onClose,
  headerExtra,
  footer,
  children,
  placement = "right",
  closable = true,
  maskClosable = true,
  destroyOnClose = false,
  className,
  style,
}: SlideOverProps) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Drawer: {
            borderRadius: 0,
            fontFamily: "var(--font-family)",
          },
        },
      }}
    >
      <Drawer
        open={open}
        onClose={onClose}
        title={
          title && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <H4 style={{ margin: 0 }}>{title}</H4>
              {headerExtra && <Space size="small">{headerExtra}</Space>}
            </div>
          )
        }
        placement={placement}
        width={width}
        closable={closable}
        maskClosable={maskClosable}
        destroyOnClose={destroyOnClose}
        className={className}
        style={style}
        styles={{
          header: {
            borderBottom: "1px solid var(--border-main)",
            padding: "16px 24px",
          },
          body: {
            padding: "24px",
            fontFamily: "var(--font-family)",
          },
          footer: footer
            ? {
                borderTop: "1px solid var(--border-main)",
                padding: "16px 24px",
                background: "var(--bg-secondary)",
              }
            : undefined,
        }}
        footer={
          footer && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              {footer}
            </div>
          )
        }
      >
        {children}
      </Drawer>
    </ConfigProvider>
  );
}

// Specialized variants
interface ConfirmSlideOverProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonVariant?: "primary" | "danger";
  loading?: boolean;
}

export function ConfirmSlideOver({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Potwierdź",
  cancelText = "Anuluj",
  confirmButtonVariant = "primary",
  loading = false,
}: ConfirmSlideOverProps) {
  return (
    <SlideOver
      open={open}
      title={title}
      onClose={onCancel}
      width={400}
      footer={
        <Space>
          <AppButton variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelText}
          </AppButton>
          <AppButton
            variant={confirmButtonVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </AppButton>
        </Space>
      }
    >
      <Body>{message}</Body>
    </SlideOver>
  );
}

interface FormSlideOverProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
  saveText?: string;
  cancelText?: string;
  saveLoading?: boolean;
  saveDisabled?: boolean;
  width?: number;
}

export function FormSlideOver({
  open,
  title,
  onClose,
  onSave,
  onCancel,
  children,
  saveText = "Zapisz",
  cancelText = "Anuluj",
  saveLoading = false,
  saveDisabled = false,
  width = 600,
}: FormSlideOverProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <SlideOver
      open={open}
      title={title}
      onClose={onClose}
      width={width}
      maskClosable={false}
      footer={
        <Space>
          <AppButton variant="secondary" onClick={handleCancel}>
            {cancelText}
          </AppButton>
          <AppButton
            variant="primary"
            onClick={onSave}
            loading={saveLoading}
            disabled={saveDisabled}
          >
            {saveText}
          </AppButton>
        </Space>
      }
    >
      {children}
    </SlideOver>
  );
}

export default SlideOver;
