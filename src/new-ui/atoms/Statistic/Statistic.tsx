import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface StatisticProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "prefix"> {
  children: React.ReactNode;
  title?: string;
  value?: string | number;
  precision?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  valueStyle?: React.CSSProperties;
}

export function Statistic({
  className,
  children,
  title,
  value,
  precision,
  prefix,
  suffix,
  valueStyle,
  ...props
}: StatisticProps): React.ReactElement {
  const formatValue = (val: string | number) => {
    if (typeof val === "number" && precision !== undefined) {
      return val.toFixed(precision);
    }
    return val;
  };

  return (
    <div className={cn("text-center", className)} {...props}>
      {title && (
        <div className="mb-2 text-sm font-medium text-muted-foreground">
          {title}
        </div>
      )}
      <div className="text-2xl font-bold" style={valueStyle}>
        {prefix}
        {value !== undefined ? formatValue(value) : children}
        {suffix}
      </div>
    </div>
  );
}
