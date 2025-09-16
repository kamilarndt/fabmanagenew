import { Select } from "antd";
import type { SelectProps } from "antd";

interface AppSelectProps extends SelectProps {
  variant?: "filled" | "outlined" | "borderless" | "underlined";
  size?: "small" | "middle" | "large";
}

export function AppSelect({ variant = "outlined", ...props }: AppSelectProps) {
  return <Select variant={variant} {...props} />;
}