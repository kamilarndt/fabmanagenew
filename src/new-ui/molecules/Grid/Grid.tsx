import React from "react";
import { cn } from "@/lib/utils";

interface GridProps {
  children: React.ReactNode;
  className?: string;
}

interface RowProps {
  children: React.ReactNode;
  gutter?: [number, number] | number;
  className?: string;
  style?: React.CSSProperties;
}

interface ColProps {
  children: React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
  className?: string;
  style?: React.CSSProperties;
}

const Grid: React.FC<GridProps> & {
  Row: React.FC<RowProps>;
  Col: React.FC<ColProps>;
} = ({ children, className }) => {
  return (
    <div className={cn("grid", className)}>
      {children}
    </div>
  );
};

const Row: React.FC<RowProps> = ({ children, gutter, className, style }) => {
  const gutterStyle = gutter
    ? Array.isArray(gutter)
      ? { gap: `${gutter[0]}px ${gutter[1]}px` }
      : { gap: `${gutter}px` }
    : {};

  return (
    <div
      className={cn("flex flex-wrap", className)}
      style={{ ...gutterStyle, ...style }}
    >
      {children}
    </div>
  );
};

const Col: React.FC<ColProps> = ({
  children,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  className,
  style,
}) => {
  const getColClasses = () => {
    const classes = [];
    
    if (xs) classes.push(`col-span-${xs}`);
    if (sm) classes.push(`sm:col-span-${sm}`);
    if (md) classes.push(`md:col-span-${md}`);
    if (lg) classes.push(`lg:col-span-${lg}`);
    if (xl) classes.push(`xl:col-span-${xl}`);
    if (xxl) classes.push(`2xl:col-span-${xxl}`);
    
    // If no specific breakpoints are defined, default to full width
    if (classes.length === 0) {
      classes.push("col-span-24");
    }
    
    return classes.join(" ");
  };

  return (
    <div
      className={cn("flex-1", getColClasses(), className)}
      style={style}
    >
      {children}
    </div>
  );
};

Grid.Row = Row;
Grid.Col = Col;

export { Grid };
