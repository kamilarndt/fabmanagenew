import { features } from "@/lib/config";
import { Input as NewInput } from "@/new-ui";
import { Input as AntInput } from "antd";
import * as React from "react";

export interface BridgeInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: "small" | "middle" | "large";
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  allowClear?: boolean;
  maxLength?: number;
  showCount?: boolean;
  status?: "error" | "warning";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  type?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

export function Input(props: BridgeInputProps): React.ReactElement {
  const { size, prefix, ...restProps } = props;

  if (features.newUI) {
    // Remove size and prefix props as new UI Input doesn't support them
    return <NewInput {...restProps} />;
  }

  return <AntInput {...props} />;
}
