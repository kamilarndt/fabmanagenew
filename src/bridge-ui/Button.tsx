import { features } from "@/lib/config";
import { Button as NewButton } from "@/new-ui";
import { Button as AntButton } from "antd";
import * as React from "react";

export interface BridgeButtonProps {
  children: React.ReactNode;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  size?: "small" | "middle" | "large";
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  htmlType?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  block?: boolean;
  danger?: boolean;
  ghost?: boolean;
  shape?: "default" | "circle" | "round";
  href?: string;
  target?: string;
}

export function Button(props: BridgeButtonProps): React.ReactElement {
  const { children, type, size, ...restProps } = props;

  // Map Ant Design props to new UI props
  const newUIProps = {
    ...restProps,
    variant: (type === "primary"
      ? "default"
      : type === "dashed"
      ? "outline"
      : "ghost") as "default" | "outline" | "ghost",
    size: (size === "small" ? "sm" : size === "large" ? "lg" : "default") as
      | "sm"
      | "default"
      | "lg",
  };

  if (features.newUI) {
    return <NewButton {...newUIProps}>{children}</NewButton>;
  }

  return <AntButton {...props}>{children}</AntButton>;
}
