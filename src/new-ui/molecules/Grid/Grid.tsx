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
  const getGutterStyle = () => {
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
  };

  const getAlignClasses = () => {
    switch (align) {
      case "top":
        return "items-start";
      case "middle":
        return "items-center";
      case "bottom":
        return "items-end";
      default:
        return "items-start";
    }
  };

  const getJustifyClasses = () => {
    switch (justify) {
      case "start":
        return "justify-start";
      case "end":
        return "justify-end";
      case "center":
        return "justify-center";
      case "space-around":
        return "justify-around";
      case "space-between":
        return "justify-between";
      default:
        return "justify-start";
    }
  };

  return (
    <div
      className={cn(
        "flex",
        getAlignClasses(),
        getJustifyClasses(),
        wrap ? "flex-wrap" : "flex-nowrap",
        className
      )}
      style={getGutterStyle()}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const gutterStyle = Array.isArray(gutter)
            ? {
                paddingLeft: `${gutter[0] / 2}px`,
                paddingRight: `${gutter[0] / 2}px`,
                paddingTop: `${gutter[1] / 2}px`,
                paddingBottom: `${gutter[1] / 2}px`,
              }
            : {
                paddingLeft: `${gutter / 2}px`,
                paddingRight: `${gutter / 2}px`,
              };

          return React.cloneElement(child, {
            style: {
              ...child.props.style,
              ...gutterStyle,
            },
          });
        }
        return child;
      })}
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
    const percentage = (spanValue / 24) * 100;
    return `w-[${percentage}%]`;
  };

  const getOffsetClass = (offsetValue: number) => {
    const percentage = (offsetValue / 24) * 100;
    return `ml-[${percentage}%]`;
  };

  const getOrderClass = (orderValue: number) => {
    return `order-${orderValue}`;
  };

  const getFlexStyle = () => {
    if (flex) {
      return { flex: typeof flex === "number" ? `${flex} 1 0%` : flex };
    }
    return {};
  };

  const getResponsiveClasses = () => {
    const classes = [];

    if (xs !== undefined) classes.push(`sm:w-[${(xs / 24) * 100}%]`);
    if (sm !== undefined) classes.push(`md:w-[${(sm / 24) * 100}%]`);
    if (md !== undefined) classes.push(`lg:w-[${(md / 24) * 100}%]`);
    if (lg !== undefined) classes.push(`xl:w-[${(lg / 24) * 100}%]`);
    if (xl !== undefined) classes.push(`2xl:w-[${(xl / 24) * 100}%]`);
    if (xxl !== undefined) classes.push(`3xl:w-[${(xxl / 24) * 100}%]`);

    return classes.join(" ");
  };

  const getSpanClasses = () => {
    if (span === 0) return "hidden";
    if (span === 24) return "w-full";
    return getSpanClass(span);
  };

  const getOffsetClasses = () => {
    if (offset === 0) return "";
    return getOffsetClass(offset);
  };

  const getOrderClasses = () => {
    if (order === undefined) return "";
    return getOrderClass(order);
  };

  return (
    <div
      className={cn(
        getSpanClasses(),
        getOffsetClasses(),
        getOrderClasses(),
        getResponsiveClasses(),
        className
      )}
      style={getFlexStyle()}
      {...props}
    >
      {children}
    </div>
  );
}

// Grid component that combines Row and Col
export interface GridProps {
  children: React.ReactNode;
  className?: string;
}

export function Grid({ children, className }: GridProps): React.ReactElement {
  return <div className={cn("grid", className)}>{children}</div>;
}
