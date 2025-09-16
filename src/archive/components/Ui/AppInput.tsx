import { Input } from "antd";
import type { InputProps } from "antd";

interface AppInputProps extends InputProps {
  variant?: "filled" | "outlined" | "borderless" | "underlined";
  size?: "small" | "middle" | "large";
}

export function AppInput({ variant = "outlined", ...props }: AppInputProps) {
  return <Input variant={variant} {...props} />;
}

export function AppTextArea(props: any) {
  return <Input.TextArea {...props} />;
}