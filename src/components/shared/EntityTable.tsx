import { Checkbox, ConfigProvider, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useMemo, useState } from "react";
import { Caption } from "../ui/Typography";

export type SortDirection = "asc" | "desc" | null;

export type EntityColumn<T> = {
  key: keyof T | string;
  header: string;
  width?: number | string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  sorter?: (a: T, b: T) => number;
  hidden?: boolean;
};

import type { TablePaginationConfig } from "antd/es/table";

interface EntityTableProps<T> {
  rows: T[];
  columns: EntityColumn<T>[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  defaultSortKey?: keyof T | string;
  defaultSortDirection?: SortDirection;
  initialHiddenColumns?: Array<keyof T | string>;
  loading?: boolean;
  pagination?: false | TablePaginationConfig;
  size?: "small" | "middle" | "large";
  showColumnToggle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function EntityTable<T>({
  rows,
  columns,
  rowKey,
  onRowClick,
  defaultSortKey,
  defaultSortDirection = "asc",
  initialHiddenColumns = [],
  loading = false,
  pagination = false,
  size = "middle",
  showColumnToggle = true,
  className,
  style,
}: EntityTableProps<T>) {
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(
    new Set(initialHiddenColumns.map(String))
  );

  const toggleColumn = (key: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const visibleColumns = useMemo(
    () => columns.filter((c) => !hiddenColumns.has(String(c.key))),
    [columns, hiddenColumns]
  );

  // Convert EntityColumn to Ant Design ColumnsType
  const antColumns: ColumnsType<T> = useMemo(() => {
    return visibleColumns.map((col) => ({
      title: col.header,
      dataIndex: col.key as string,
      key: String(col.key),
      width: col.width,
      sorter: col.sortable
        ? col.sorter ||
          ((a: T, b: T) => {
            const aVal = String((a as any)[col.key] || "");
            const bVal = String((b as any)[col.key] || "");
            return aVal.localeCompare(bVal, "pl", { sensitivity: "base" });
          })
        : undefined,
      defaultSortOrder:
        col.key === defaultSortKey
          ? defaultSortDirection === "asc"
            ? "ascend"
            : "descend"
          : undefined,
      render: col.render
        ? (_value: unknown, record: T) => col.render!(record)
        : undefined,
    }));
  }, [visibleColumns, defaultSortKey, defaultSortDirection]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            borderRadius: 6,
            fontFamily: "var(--font-family)",
          },
        },
      }}
    >
      <div className={className} style={style}>
        {/* Column Toggle */}
        {showColumnToggle && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 12,
              padding: "8px 12px",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: 6,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <Caption style={{ margin: 0, marginRight: 8 }}>Kolumny:</Caption>
            <Space wrap size="small">
              {columns.map((col) => (
                <Checkbox
                  key={String(col.key)}
                  checked={!hiddenColumns.has(String(col.key))}
                  onChange={() => toggleColumn(String(col.key))}
                  style={{ fontSize: 12 }}
                >
                  <Caption>{col.header}</Caption>
                </Checkbox>
              ))}
            </Space>
          </div>
        )}

        {/* Table */}
        <Table<T>
          dataSource={rows}
          columns={antColumns}
          rowKey={rowKey}
          onRow={(record) => ({
            onClick: () => onRowClick?.(record),
            style: {
              cursor: onRowClick ? "pointer" : "default",
            },
          })}
          loading={loading}
          pagination={pagination}
          size={size}
          style={{
            fontFamily: "var(--font-family)",
          }}
        />
      </div>
    </ConfigProvider>
  );
}

// Simplified version for quick usage
interface SimpleTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    title: string;
    render?: (item: T) => React.ReactNode;
  }>;
  onRowClick?: (item: T) => void;
  loading?: boolean;
}

export function SimpleTable<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  loading,
}: SimpleTableProps<T>) {
  const entityColumns: EntityColumn<T>[] = columns.map((col) => ({
    key: col.key,
    header: col.title,
    render: col.render,
    sortable: true,
  }));

  return (
    <EntityTable
      rows={data}
      columns={entityColumns}
      rowKey={(row) => String(row.id)}
      onRowClick={onRowClick}
      loading={loading}
      showColumnToggle={false}
      size="small"
    />
  );
}

// Backward-compatible type alias for legacy imports
export type Column<T> = EntityColumn<T>;

export default EntityTable;
