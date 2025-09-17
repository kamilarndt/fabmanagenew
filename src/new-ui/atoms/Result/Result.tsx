import * as React from "react";
import { Icon } from "../Icon/Icon";
import { Typography } from "../Typography/Typography";

export interface ResultProps {
  status?: "success" | "error" | "info" | "warning" | "404" | "403" | "500";
  icon?: React.ReactNode;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  extra?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const statusConfig = {
  success: {
    icon: "check-circle",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  error: {
    icon: "x-circle",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  info: {
    icon: "info",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  warning: {
    icon: "alert-triangle",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  "404": {
    icon: "file-x",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
  },
  "403": {
    icon: "lock",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  "500": {
    icon: "server",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
};

export const Result = React.memo(function Result({
  status = "info",
  icon,
  title,
  subTitle,
  extra,
  children,
  className = "",
  style,
}: ResultProps) {
  const config = statusConfig[status];
  const displayIcon = icon || (
    <Icon name={config.icon} className={`h-16 w-16 ${config.color}`} />
  );

  return (
    <div
      className={`tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-p-8 ${config.bgColor} tw-rounded-lg ${className}`}
      style={style}
    >
      <div className="tw-mb-4">{displayIcon}</div>

      {title && (
        <Typography variant="h3" className="tw-mb-2 tw-text-gray-900">
          {title}
        </Typography>
      )}

      {subTitle && (
        <Typography variant="body" className="tw-mb-6 tw-text-gray-600">
          {subTitle}
        </Typography>
      )}

      {extra && (
        <div className="tw-flex tw-flex-wrap tw-gap-3 tw-justify-center tw-mb-4">
          {Array.isArray(extra)
            ? extra.map((item, index) => (
                <React.Fragment key={index}>{item}</React.Fragment>
              ))
            : extra}
        </div>
      )}

      {children}
    </div>
  );
});
