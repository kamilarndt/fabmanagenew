import { Icon } from "@/new-ui/atoms/Icon/Icon";
import { Typography } from "@/new-ui/atoms/Typography/Typography";
import React from "react";

interface ResultProps {
  status?: "success" | "error" | "info" | "warning" | "404" | "403" | "500";
  icon?: React.ReactNode;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  extra?: React.ReactNode[];
  className?: string;
}

const statusConfig = {
  success: {
    icon: "check-circle",
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  error: {
    icon: "x-circle",
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  info: {
    icon: "information-circle",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  warning: {
    icon: "exclamation-triangle",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  "404": {
    icon: "question-mark-circle",
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
  "403": {
    icon: "lock-closed",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  "500": {
    icon: "exclamation-circle",
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
};

export const Result: React.FC<ResultProps> = ({
  status = "info",
  icon,
  title,
  subTitle,
  extra,
  className = "",
}) => {
  const config = statusConfig[status];
  const displayIcon = icon || (
    <Icon name={config.icon} className={`w-16 h-16 ${config.color}`} />
  );

  return (
    <div className={`text-center py-8 px-4 ${className}`}>
      <div
        className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${config.bgColor} ${config.borderColor} border-2 mb-4`}
      >
        {displayIcon}
      </div>

      {title && (
        <Typography variant="h3" className="text-gray-900 mb-2">
          {title}
        </Typography>
      )}

      {subTitle && (
        <Typography variant="body" className="text-gray-600 mb-6">
          {subTitle}
        </Typography>
      )}

      {extra && extra.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {extra.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      )}
    </div>
  );
};
