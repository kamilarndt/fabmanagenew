import type { DropdownProps } from "antd";
import { Dropdown as AntDropdown, ConfigProvider } from "antd";
import React from "react";

interface AppDropdownProps extends Omit<DropdownProps, "style"> {
  variant?: "default" | "primary" | "ghost";
  size?: "small" | "middle" | "large";
  placement?:
    | "bottomLeft"
    | "bottomCenter"
    | "bottomRight"
    | "topLeft"
    | "topCenter"
    | "topRight";
  trigger?: ("click" | "hover" | "contextMenu")[];
  style?: React.CSSProperties;
}

export function AppDropdown({
  variant = "default",
  size = "middle",
  placement = "bottomLeft",
  trigger = ["click"],
  className,
  style,
  children,
  ...props
}: AppDropdownProps) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Dropdown: {
            fontFamily: "var(--font-family)",
            colorText: "var(--text-primary)",
            colorTextLightSolid: "var(--text-primary)",
            colorBgElevated: "var(--bg-secondary)",
            colorBorder: "var(--border-main)",
            colorPrimary: "var(--primary-main)",
          },
        },
      }}
    >
      <AntDropdown
        placement={placement}
        trigger={trigger}
        className={className}
        data-component="AppDropdown"
        data-variant={variant}
        data-size={size}
        data-placement={placement}
        {...props}
      >
        {children}
      </AntDropdown>
    </ConfigProvider>
  );
}

// Specialized dropdown variants
export function AppDropdownSmall(props: Omit<AppDropdownProps, "size">) {
  return <AppDropdown size="small" {...props} />;
}

export function AppDropdownLarge(props: Omit<AppDropdownProps, "size">) {
  return <AppDropdown size="large" {...props} />;
}

export function AppDropdownHover(props: Omit<AppDropdownProps, "trigger">) {
  return <AppDropdown trigger={["hover"]} {...props} />;
}

export function AppDropdownContextMenu(
  props: Omit<AppDropdownProps, "trigger">
) {
  return <AppDropdown trigger={["contextMenu"]} {...props} />;
}

export default AppDropdown;
