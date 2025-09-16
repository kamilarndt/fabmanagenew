import type { ColProps, RowProps } from "antd";
import { Col as AntCol, Row as AntRow } from "antd";
import React from "react";

interface AppRowProps extends RowProps {
  gutter?:
    | number
    | [number, number]
    | {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        xxl?: number;
      };
  justify?:
    | "start"
    | "end"
    | "center"
    | "space-around"
    | "space-between"
    | "space-evenly";
  align?: "top" | "middle" | "bottom" | "stretch";
  wrap?: boolean;
}

interface AppColProps extends ColProps {
  span?: number;
  offset?: number;
  order?: number;
  pull?: number;
  push?: number;
  xs?: number | ColProps;
  sm?: number | ColProps;
  md?: number | ColProps;
  lg?: number | ColProps;
  xl?: number | ColProps;
  xxl?: number | ColProps;
}

export function AppRow({
  gutter = [16, 16],
  justify,
  align,
  wrap = true,
  className,
  style,
  children,
  ...props
}: AppRowProps) {
  const rowStyles: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    ...style,
  };

  return (
    <AntRow
      gutter={gutter}
      justify={justify}
      align={align}
      wrap={wrap}
      className={className}
      style={rowStyles}
      data-component="AppRow"
      {...props}
    >
      {children}
    </AntRow>
  );
}

export function AppCol({
  span,
  offset,
  order,
  pull,
  push,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  className,
  style,
  children,
  ...props
}: AppColProps) {
  const colStyles: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    ...style,
  };

  return (
    <AntCol
      span={span}
      offset={offset}
      order={order}
      pull={pull}
      push={push}
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      xxl={xxl}
      className={className}
      style={colStyles}
      data-component="AppCol"
      {...props}
    >
      {children}
    </AntCol>
  );
}

// Common grid layouts
export function AppGridContainer({ children, ...props }: AppRowProps) {
  return (
    <AppRow gutter={[24, 24]} {...props}>
      {children}
    </AppRow>
  );
}

export function AppGridItem({ children, ...props }: AppColProps) {
  return <AppCol {...props}>{children}</AppCol>;
}

// Responsive grid helpers
export function AppGridResponsive({
  children,
  xs = 24,
  sm = 12,
  md = 8,
  lg = 6,
  xl = 4,
  ...props
}: AppColProps & {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}) {
  return (
    <AppCol xs={xs} sm={sm} md={md} lg={lg} xl={xl} {...props}>
      {children}
    </AppCol>
  );
}

// Grid with specific spacing
export function AppGridTight({ children, ...props }: AppRowProps) {
  return (
    <AppRow gutter={[8, 8]} {...props}>
      {children}
    </AppRow>
  );
}

export function AppGridLoose({ children, ...props }: AppRowProps) {
  return (
    <AppRow gutter={[32, 32]} {...props}>
      {children}
    </AppRow>
  );
}

export default AppRow;
