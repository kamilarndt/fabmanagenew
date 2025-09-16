import { Button } from "@/new-ui/atoms/Button/Button";
import { Checkbox } from "@/new-ui/atoms/Checkbox/Checkbox";
import { Icon } from "@/new-ui/atoms/Icon/Icon";
import { Pagination } from "@/new-ui/molecules/Pagination/Pagination";
import { SearchBox } from "@/new-ui/molecules/SearchBox/SearchBox";
import { Select } from "@/new-ui/molecules/Select/Select";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface Column<T> {
  key: keyof T | string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
  fixed?: "left" | "right";
  ellipsis?: boolean;
  sorter?: (a: T, b: T) => number;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    pageSizeOptions?: string[];
  };
  rowSelection?: {
    type: "checkbox" | "radio";
    selectedRowKeys?: React.Key[];
    onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled?: boolean };
  };
  onRow?: (
    record: T,
    index: number
  ) => {
    onClick?: (event: React.MouseEvent) => void;
    onDoubleClick?: (event: React.MouseEvent) => void;
    onContextMenu?: (event: React.MouseEvent) => void;
  };
  expandable?: {
    expandedRowKeys?: React.Key[];
    onExpandedRowsChange?: (expandedKeys: React.Key[]) => void;
    expandedRowRender?: (record: T, index: number) => React.ReactNode;
    expandIcon?: (props: {
      expanded: boolean;
      onExpand: () => void;
      record: T;
    }) => React.ReactNode;
  };
  scroll?: {
    x?: number | string;
    y?: number | string;
  };
  size?: "small" | "middle" | "large";
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
  emptyText?: string;
  loadingText?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  filterable?: boolean;
  onFilter?: (filters: Record<string, any>) => void;
  exportable?: boolean;
  onExport?: (format: "csv" | "excel" | "pdf") => void;
  actions?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination,
  rowSelection,
  onRow,
  expandable,
  scroll,
  size = "middle",
  bordered = false,
  striped = false,
  hoverable = true,
  className,
  emptyText = "No data available",
  loadingText = "Loading...",
  searchable = false,
  searchPlaceholder = "Search...",
  onSearch,
  filterable = false,
  onFilter,
  exportable = false,
  onExport,
  actions,
}: DataTableProps<T>): React.ReactElement {
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [expandedRows, setExpandedRows] = React.useState<React.Key[]>(
    expandable?.expandedRowKeys || []
  );
  const [selectedRows, setSelectedRows] = React.useState<React.Key[]>(
    rowSelection?.selectedRowKeys || []
  );

  const sizeClasses = {
    small: "tw-text-xs",
    middle: "tw-text-sm",
    large: "tw-text-base",
  };

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    const direction =
      sortConfig?.key === column.key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";

    setSortConfig({ key: column.key as string, direction });
  };

  const handleRowSelection = (record: T, checked: boolean) => {
    if (!rowSelection) return;

    const key = (record as any).key || (record as any).id;
    let newSelectedRows: React.Key[];

    if (rowSelection.type === "radio") {
      newSelectedRows = checked ? [key] : [];
    } else {
      newSelectedRows = checked
        ? [...selectedRows, key]
        : selectedRows.filter((k) => k !== key);
    }

    setSelectedRows(newSelectedRows);
    rowSelection.onChange?.(
      newSelectedRows,
      data.filter((item) =>
        newSelectedRows.includes((item as any).key || (item as any).id)
      )
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (!rowSelection || rowSelection.type === "radio") return;

    const newSelectedRows = checked
      ? data.map((item) => (item as any).key || (item as any).id)
      : [];

    setSelectedRows(newSelectedRows);
    rowSelection.onChange?.(newSelectedRows, checked ? data : []);
  };

  const handleExpand = (record: T) => {
    if (!expandable) return;

    const key = (record as any).key || (record as any).id;
    const newExpandedRows = expandedRows.includes(key)
      ? expandedRows.filter((k) => k !== key)
      : [...expandedRows, key];

    setExpandedRows(newExpandedRows);
    expandable.onExpandedRowsChange?.(newExpandedRows);
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const renderCell = (column: Column<T>, record: T, index: number) => {
    const value = column.dataIndex
      ? record[column.dataIndex]
      : (record as any)[column.key];

    if (column.render) {
      return column.render(value, record, index);
    }

    if (column.ellipsis) {
      return (
        <div className="tw-truncate tw-max-w-[200px]" title={String(value)}>
          {value}
        </div>
      );
    }

    return <span>{value}</span>;
  };

  const renderExpandIcon = (record: T) => {
    if (!expandable) return null;

    const key = (record as any).key || (record as any).id;
    const expanded = expandedRows.includes(key);

    if (expandable.expandIcon) {
      return expandable.expandIcon({
        expanded,
        onExpand: () => handleExpand(record),
        record,
      });
    }

    return (
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => handleExpand(record)}
        className="tw-h-6 tw-w-6"
      >
        <Icon
          name={expanded ? "chevron-up" : "chevron-down"}
          className="tw-h-4 tw-w-4"
        />
      </Button>
    );
  };

  if (loading) {
    return (
      <div className="tw-flex tw-items-center tw-justify-center tw-h-64">
        <div className="tw-flex tw-items-center tw-gap-2 tw-text-muted-foreground">
          <Icon name="loader-2" className="tw-h-6 tw-w-6 tw-animate-spin" />
          <span>{loadingText}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("tw-space-y-4", className)}>
      {/* Toolbar */}
      {(searchable || filterable || exportable || actions) && (
        <div className="tw-flex tw-items-center tw-justify-between tw-gap-4">
          <div className="tw-flex tw-items-center tw-gap-4">
            {searchable && (
              <SearchBox
                placeholder={searchPlaceholder}
                onSearch={onSearch}
                className="tw-w-64"
              />
            )}
            {filterable && (
              <Select
                options={[
                  { value: "all", label: "All" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
                placeholder="Filter..."
                className="tw-w-32"
              />
            )}
          </div>

          <div className="tw-flex tw-items-center tw-gap-2">
            {exportable && (
              <ButtonGroup>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExport?.("csv")}
                >
                  <Icon name="download" className="tw-h-4 tw-w-4" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExport?.("excel")}
                >
                  <Icon name="download" className="tw-h-4 tw-w-4" />
                  Excel
                </Button>
              </ButtonGroup>
            )}
            {actions}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="tw-overflow-auto tw-rounded-lg tw-border">
        <table
          className={cn("tw-w-full tw-border-collapse", sizeClasses[size])}
          style={scroll ? { minWidth: scroll.x } : undefined}
        >
          <thead>
            <tr className="tw-border-b tw-bg-muted/50">
              {rowSelection && (
                <th className="tw-p-4 tw-text-left">
                  {rowSelection.type === "checkbox" && (
                    <Checkbox
                      checked={
                        selectedRows.length === data.length && data.length > 0
                      }
                      indeterminate={
                        selectedRows.length > 0 &&
                        selectedRows.length < data.length
                      }
                      onChange={(checked) => handleSelectAll(checked)}
                    />
                  )}
                </th>
              )}
              {expandable && <th className="tw-w-12 tw-p-4" />}
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={cn(
                    "tw-p-4 tw-font-medium tw-text-muted-foreground",
                    column.align === "center" && "tw-text-center",
                    column.align === "right" && "tw-text-right",
                    column.sortable &&
                      "tw-cursor-pointer hover:tw-text-foreground"
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <Icon
                        name={
                          sortConfig?.key === column.key
                            ? sortConfig.direction === "asc"
                              ? "chevron-up"
                              : "chevron-down"
                            : "chevrons-up-down"
                        }
                        className="tw-h-4 tw-w-4 tw-opacity-50"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (rowSelection ? 1 : 0) +
                    (expandable ? 1 : 0)
                  }
                  className="tw-p-8 tw-text-center tw-text-muted-foreground"
                >
                  <div className="tw-flex tw-flex-col tw-items-center tw-gap-2">
                    <Icon name="inbox" className="tw-h-8 tw-w-8" />
                    <span>{emptyText}</span>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((record, index) => {
                const key = (record as any).key || (record as any).id || index;
                const isSelected = selectedRows.includes(key);
                const isExpanded = expandedRows.includes(key);
                const rowProps = onRow?.(record, index) || {};

                return (
                  <React.Fragment key={key}>
                    <tr
                      className={cn(
                        "tw-border-b tw-transition-colors",
                        striped && index % 2 === 1 && "tw-bg-muted/25",
                        hoverable && "hover:tw-bg-muted/50",
                        isSelected && "tw-bg-primary/5"
                      )}
                      {...rowProps}
                    >
                      {rowSelection && (
                        <td className="tw-p-4">
                          <Checkbox
                            checked={isSelected}
                            onChange={(checked) =>
                              handleRowSelection(record, checked)
                            }
                            {...rowSelection.getCheckboxProps?.(record)}
                          />
                        </td>
                      )}
                      {expandable && (
                        <td className="tw-p-4">{renderExpandIcon(record)}</td>
                      )}
                      {columns.map((column) => (
                        <td
                          key={column.key as string}
                          className={cn(
                            "tw-p-4",
                            column.align === "center" && "tw-text-center",
                            column.align === "right" && "tw-text-right"
                          )}
                        >
                          {renderCell(column, record, index)}
                        </td>
                      ))}
                    </tr>
                    {expandable && isExpanded && (
                      <tr>
                        <td
                          colSpan={
                            columns.length +
                            (rowSelection ? 1 : 0) +
                            (expandable ? 1 : 0)
                          }
                          className="tw-p-0"
                        >
                          <div className="tw-border-b tw-bg-muted/25 tw-p-4">
                            {expandable.expandedRowRender?.(record, index)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="tw-flex tw-items-center tw-justify-between">
          <div className="tw-text-sm tw-text-muted-foreground">
            Showing {(pagination.current - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(
              pagination.current * pagination.pageSize,
              pagination.total
            )}{" "}
            of {pagination.total} entries
          </div>
          <Pagination
            currentPage={pagination.current}
            totalPages={Math.ceil(pagination.total / pagination.pageSize)}
            onPageChange={(page) => {
              // Handle page change
            }}
          />
        </div>
      )}
    </div>
  );
}
