import type { PaginationProps } from "antd";
import { Pagination as AntPagination, ConfigProvider } from "antd";
import React from "react";

interface AppPaginationProps extends Omit<PaginationProps, "showTotal"> {
  variant?: "default" | "simple" | "mini";
  size?: "small" | "default";
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?:
    | boolean
    | ((total: number, range: [number, number]) => React.ReactNode);
  pageSizeOptions?: string[];
  hideOnSinglePage?: boolean;
}

export function AppPagination({
  variant = "default",
  size = "default",
  showSizeChanger = true,
  showQuickJumper = true,
  showTotal = true,
  pageSizeOptions = ["10", "20", "50", "100"],
  hideOnSinglePage = false,
  className,
  style,
  ...props
}: AppPaginationProps) {
  const paginationStyles: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    ...style,
  };

  const getDefaultShowTotal = (
    total: number,
    range: [number, number]
  ): React.ReactNode => {
    return `${range[0]}-${range[1]} z ${total} elementów`;
  };

  const getSizeConfig = () => {
    return size === "small" ? "small" : "default";
  };

  const getVariantConfig = (): Partial<PaginationProps> => {
    switch (variant) {
      case "simple":
        return {
          simple: true,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: undefined,
        };
      case "mini":
        return {
          simple: true,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: undefined,
          size: "small",
        };
      default:
        return {
          showSizeChanger,
          showQuickJumper,
          showTotal:
            showTotal === true
              ? getDefaultShowTotal
              : showTotal === false
              ? undefined
              : showTotal,
          pageSizeOptions,
        };
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Pagination: {
            fontFamily: "var(--font-family)",
            colorText: "var(--text-primary)",
            colorTextLightSolid: "var(--text-primary)",
            colorBgContainer: "var(--bg-card)",
            colorBorder: "var(--border-main)",
            colorPrimary: "var(--primary-main)",
            colorPrimaryHover: "var(--primary-light)",
          },
        },
      }}
    >
      <AntPagination
        size={getSizeConfig()}
        hideOnSinglePage={hideOnSinglePage}
        className={className}
        style={paginationStyles}
        data-component="AppPagination"
        data-variant={variant}
        data-size={size}
        {...getVariantConfig()}
        {...props}
      />
    </ConfigProvider>
  );
}

// Specialized pagination variants
export function AppPaginationSimple(
  props: Omit<AppPaginationProps, "variant">
) {
  return <AppPagination variant="simple" {...props} />;
}

export function AppPaginationMini(
  props: Omit<AppPaginationProps, "variant" | "size">
) {
  return <AppPagination variant="mini" size="small" {...props} />;
}

export function AppPaginationSmall(props: Omit<AppPaginationProps, "size">) {
  return <AppPagination size="small" {...props} />;
}

export function AppPaginationBasic(
  props: Omit<
    AppPaginationProps,
    "showSizeChanger" | "showQuickJumper" | "showTotal"
  >
) {
  return (
    <AppPagination
      showSizeChanger={false}
      showQuickJumper={false}
      showTotal={false}
      {...props}
    />
  );
}

export default AppPagination;
