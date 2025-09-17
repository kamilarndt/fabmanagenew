import { Icon as ModernIcon } from "@/new-ui/atoms/Icon/Icon";
import React from "react";

interface IconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Icon({
  name,
  size = 16,
  color = "currentColor",
  className,
  style,
  onClick,
}: IconProps) {
  const sizeClass =
    typeof size === "number"
      ? size <= 12
        ? "sm"
        : size <= 20
        ? "md"
        : "lg"
      : "md";

  const iconStyles: React.CSSProperties = {
    color,
    cursor: onClick ? "pointer" : "default",
    ...style,
  };

  return (
    <ModernIcon
      name={name}
      size={sizeClass as "sm" | "md" | "lg"}
      className={className}
      style={iconStyles}
      onClick={onClick}
    />
  );
}

export function LoadingIcon(props: Omit<IconProps, "name">) {
  return <Icon name="loader-2" {...props} />;
}
export function CheckIcon(props: Omit<IconProps, "name">) {
  return <Icon name="check" {...props} />;
}
export function CloseIcon(props: Omit<IconProps, "name">) {
  return <Icon name="x" {...props} />;
}
export function EditIcon(props: Omit<IconProps, "name">) {
  return <Icon name="edit" {...props} />;
}
export function DeleteIcon(props: Omit<IconProps, "name">) {
  return <Icon name="delete" {...props} />;
}
export function SearchIcon(props: Omit<IconProps, "name">) {
  return <Icon name="search" {...props} />;
}
export function PlusIcon(props: Omit<IconProps, "name">) {
  return <Icon name="plus" {...props} />;
}
export function DownloadIcon(props: Omit<IconProps, "name">) {
  return <Icon name="download" {...props} />;
}
export function UploadIcon(props: Omit<IconProps, "name">) {
  return <Icon name="upload" {...props} />;
}
export function SettingsIcon(props: Omit<IconProps, "name">) {
  return <Icon name="settings" {...props} />;
}
