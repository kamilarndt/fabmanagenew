import * as AntIcons from "@ant-design/icons";
import React from "react";

interface IconProps {
  name: keyof typeof AntIcons;
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
  const IconComponent = AntIcons[name] as React.ComponentType<any>;
  if (!IconComponent) {
    console.warn(`Icon "${String(name)}" not found in Ant Design icons`);
    return null;
  }
  const iconStyles: React.CSSProperties = {
    fontSize: typeof size === "number" ? `${size}px` : size,
    color,
    cursor: onClick ? "pointer" : "default",
    ...style,
  };
  return (
    <IconComponent className={className} style={iconStyles} onClick={onClick} />
  );
}

export function LoadingIcon(props: Omit<IconProps, "name">) {
  return <Icon name="LoadingOutlined" {...props} />;
}
export function CheckIcon(props: Omit<IconProps, "name">) {
  return <Icon name="CheckOutlined" {...props} />;
}
export function CloseIcon(props: Omit<IconProps, "name">) {
  return <Icon name="CloseOutlined" {...props} />;
}
export function EditIcon(props: Omit<IconProps, "name">) {
  return <Icon name="EditOutlined" {...props} />;
}
export function DeleteIcon(props: Omit<IconProps, "name">) {
  return <Icon name="DeleteOutlined" {...props} />;
}
export function SearchIcon(props: Omit<IconProps, "name">) {
  return <Icon name="SearchOutlined" {...props} />;
}
export function PlusIcon(props: Omit<IconProps, "name">) {
  return <Icon name="PlusOutlined" {...props} />;
}
export function DownloadIcon(props: Omit<IconProps, "name">) {
  return <Icon name="DownloadOutlined" {...props} />;
}
export function UploadIcon(props: Omit<IconProps, "name">) {
  return <Icon name="UploadOutlined" {...props} />;
}
export function SettingsIcon(props: Omit<IconProps, "name">) {
  return <Icon name="SettingOutlined" {...props} />;
}
