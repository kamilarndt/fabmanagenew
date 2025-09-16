import { features } from "@/lib/config";
import { Sheet } from "@/new-ui";
import { Modal as AntModal, type ModalProps as AntModalProps } from "antd";
import * as React from "react";

export interface BridgeModalProps extends AntModalProps {
  useNewUI?: boolean;
}

export function Modal(props: BridgeModalProps): React.ReactElement {
  const { useNewUI = features.newUI, ...restProps } = props;

  if (useNewUI) {
    // Map Ant Design Modal props to new UI Sheet
    return (
      <Sheet
        open={props.open || false}
        onOpenChange={(open) => {
          if (!open && props.onCancel) {
            props.onCancel({} as any);
          }
        }}
        title={props.title as string}
        description={props.children as string}
      >
        {props.children}
      </Sheet>
    );
  }

  return <AntModal {...restProps}>{props.children}</AntModal>;
}

// Export static methods for compatibility
export const ModalStatic = {
  info: AntModal.info,
  success: AntModal.success,
  error: AntModal.error,
  warning: AntModal.warning,
  confirm: AntModal.confirm,
  destroyAll: AntModal.destroyAll,
};
