import { Button as AntButton, ConfigProvider, type ButtonProps } from "antd";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "ghost" | "danger" | "success" | "warning";
export type ButtonSize = "xs" | "sm" | "md" | "lg";
export type ButtonIcon = "none" | "left" | "right" | "only";

export interface DSButtonProps extends Omit<ButtonProps, "type" | "size" | "variant"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconPlacement?: ButtonIcon;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  iconPlacement = "none",
  fullWidth,
  children,
  ...rest
}: DSButtonProps) {
  const type: ButtonProps["type"] =
    variant === "primary" ? "primary" :
    variant === "ghost" ? "text" : "default";

  const danger = variant === "danger";
  
  const antSize = size === "xs" ? "small" : size === "sm" ? "small" : size === "md" ? "middle" : "large";

  return (
    <ConfigProvider theme={{ components: { Button: { borderRadius: 6 } } }}>
      <AntButton
        type={type}
        size={antSize}
        danger={danger}
        style={{ 
          width: fullWidth ? "100%" : undefined,
          ...(variant === "success" && { backgroundColor: "#52c41a", borderColor: "#52c41a", color: "white" }),
          ...(variant === "warning" && { backgroundColor: "#faad14", borderColor: "#faad14", color: "white" })
        }}
        data-cmp="Button"
        data-variant={variant}
        data-size={size}
        data-icon={iconPlacement}
        {...rest}
      >
        {children}
      </AntButton>
    </ConfigProvider>
  );
}
