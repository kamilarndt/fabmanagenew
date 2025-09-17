import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gutter?: number | [number, number];
  align?: "top" | "middle" | "bottom";
  justify?: "start" | "end" | "center" | "space-around" | "space-between";
  wrap?: boolean;
}

export function Row({
  className,
  children,
  gutter = 0,
  align = "top",
  justify = "start",
  wrap = true,
  ...props
}: RowProps): React.ReactElement {
  const alignClasses = {
    top: "items-start",
    middle: "items-center",
    bottom: "items-end",
  };

  const justifyClasses = {
    start: "justify-start",
    end: "justify-end",
    center: "justify-center",
    "space-around": "justify-around",
    "space-between": "justify-between",
  };

  const gutterStyle = React.useMemo(() => {
    if (Array.isArray(gutter)) {
      return {
        marginLeft: `-${gutter[0] / 2}px`,
        marginRight: `-${gutter[0] / 2}px`,
        marginTop: `-${gutter[1] / 2}px`,
        marginBottom: `-${gutter[1] / 2}px`,
      };
    }
    return {
      marginLeft: `-${gutter / 2}px`,
      marginRight: `-${gutter / 2}px`,
    };
  }, [gutter]);

  return (
    <div
      className={cn(
        "flex",
        alignClasses[align],
        justifyClasses[justify],
        wrap ? "flex-wrap" : "flex-nowrap",
        className
      )}
      style={gutterStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  span?: number;
  offset?: number;
  order?: number;
  flex?: string | number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

export function Col({
  className,
  children,
  span = 24,
  offset = 0,
  order,
  flex,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  ...props
}: ColProps): React.ReactElement {
  const getSpanClass = (spanValue: number) => {
    if (spanValue === 0) return "hidden";
    return `w-${Math.round((spanValue / 24) * 100)}`;
  };

  const getOffsetClass = (offsetValue: number) => {
    if (offsetValue === 0) return "";
    return `ml-${Math.round((offsetValue / 24) * 100)}`;
  };

  const getOrderClass = (orderValue: number) => {
    return `order-${orderValue}`;
  };

  const getFlexStyle = () => {
    if (flex !== undefined) {
      return { flex: typeof flex === "number" ? `${flex} ${flex} auto` : flex };
    }
    return {};
  };

  const responsiveClasses = [
    xs !== undefined && `xs:${getSpanClass(xs)}`,
    sm !== undefined && `sm:${getSpanClass(sm)}`,
    md !== undefined && `md:${getSpanClass(md)}`,
    lg !== undefined && `lg:${getSpanClass(lg)}`,
    xl !== undefined && `xl:${getSpanClass(xl)}`,
    xxl !== undefined && `xxl:${getSpanClass(xxl)}`,
  ].filter(Boolean);

  return (
    <div
      className={cn(
        getSpanClass(span),
        getOffsetClass(offset),
        order !== undefined && getOrderClass(order),
        responsiveClasses,
        className
      )}
      style={getFlexStyle()}
      {...props}
    >
      {children}
    </div>
  );
}
