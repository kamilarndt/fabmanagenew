import type { ButtonProps } from "antd";
import { Button, ConfigProvider } from "antd";
import React from "react";

interface AppButtonProps extends Omit<ButtonProps, "variant"> {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "ghost";
  size?: "small" | "middle" | "large";
}

export function AppButton({
  variant = "primary",
  size = "middle",
  children,
  ...props
}: AppButtonProps) {
  const getButtonType = (): ButtonProps["type"] => {
    switch (variant) {
      case "primary":
        return "primary";
      case "secondary":
        return "default";
      case "ghost":
        return "text";
      default:
        return "default";
    }
  };

  const buttonStyles: React.CSSProperties = {
    borderRadius: 6,
    fontFamily: "var(--font-family)",
    fontWeight: "var(--font-medium)",
    ...(variant === "success" && {
      backgroundColor: "#52c41a",
      borderColor: "#52c41a",
      color: "white",
    }),
    ...(variant === "warning" && {
      backgroundColor: "#faad14",
      borderColor: "#faad14",
      color: "white",
    }),
  };

  return (
    <ConfigProvider
      theme={{ components: { Button: { borderRadius: 6, fontWeight: 500 } } }}
    >
      <Button
        type={getButtonType()}
        size={size}
        danger={variant === "danger"}
        style={buttonStyles}
        data-component="AppButton"
        data-variant={variant}
        data-size={size}
        data-state={
          props.loading ? "loading" : props.disabled ? "disabled" : "default"
        }
        {...props}
      >
        {children}
      </Button>
    </ConfigProvider>
  );
}
