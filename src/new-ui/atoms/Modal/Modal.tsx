import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface ModalProps {
  open?: boolean;
  onCancel?: () => void;
  onOk?: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string;
  centered?: boolean;
  maskClosable?: boolean;
  closable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  okText?: string;
  cancelText?: string;
  okButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  cancelButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  confirmLoading?: boolean;
  destroyOnClose?: boolean;
}

export function Modal({
  open = false,
  onCancel,
  onOk,
  title,
  children,
  footer,
  width = 520,
  centered = false,
  maskClosable = true,
  closable = true,
  className,
  style,
  okText = "OK",
  cancelText = "Cancel",
  okButtonProps,
  cancelButtonProps,
  confirmLoading = false,
  destroyOnClose = false,
}: ModalProps): React.ReactElement {
  const [isVisible, setIsVisible] = React.useState(open);

  React.useEffect(() => {
    setIsVisible(open);
  }, [open]);

  const handleCancel = () => {
    setIsVisible(false);
    onCancel?.();
  };

  const handleOk = () => {
    onOk?.();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && maskClosable) {
      handleCancel();
    }
  };

  if (!isVisible && destroyOnClose) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
        "transition-opacity duration-200"
      )}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        className={cn(
          "relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-hidden",
          "transform transition-transform duration-200",
          isVisible ? "scale-100" : "scale-95",
          centered ? "my-0" : "my-8",
          className
        )}
        style={{ width, ...style }}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {closable && (
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>

        {/* Footer */}
        {footer !== undefined ? (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        ) : (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              {...cancelButtonProps}
            >
              {cancelText}
            </button>
            <button
              onClick={handleOk}
              disabled={confirmLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              {...okButtonProps}
            >
              {confirmLoading ? "Loading..." : okText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Static methods for convenience
Modal.confirm = (config: {
  title?: React.ReactNode;
  content?: React.ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
}) => {
  // This would need to be implemented with a modal manager
  console.warn("Modal.confirm not implemented yet");
};

Modal.info = (config: {
  title?: React.ReactNode;
  content?: React.ReactNode;
  onOk?: () => void;
}) => {
  console.warn("Modal.info not implemented yet");
};

Modal.success = (config: {
  title?: React.ReactNode;
  content?: React.ReactNode;
  onOk?: () => void;
}) => {
  console.warn("Modal.success not implemented yet");
};

Modal.error = (config: {
  title?: React.ReactNode;
  content?: React.ReactNode;
  onOk?: () => void;
}) => {
  console.warn("Modal.error not implemented yet");
};

Modal.warning = (config: {
  title?: React.ReactNode;
  content?: React.ReactNode;
  onOk?: () => void;
}) => {
  console.warn("Modal.warning not implemented yet");
};
