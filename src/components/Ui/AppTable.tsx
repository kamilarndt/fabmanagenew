import {
  DownloadOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import { Button, Checkbox, Dropdown, Input, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useMemo, useState } from "react";

interface AppTableColumn<T> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  fixed?: "left" | "right";
  hidden?: boolean;
}

interface AppTableProps<T> extends Omit<TableProps<T>, "columns"> {
  columns: AppTableColumn<T>[];
  data: T[];
  searchable?: boolean;
  exportable?: boolean;
  columnManagement?: boolean;
  globalSearch?: boolean;
  onExport?: (data: T[]) => void;
}

export function AppTable<T extends Record<string, any>>({
  columns,
  data,
  searchable = true,
  exportable = false,
  columnManagement = true,
  globalSearch = true,
  onExport,
  ...tableProps
}: AppTableProps<T>) {
  const [searchText, setSearchText] = useState("");
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());

  const filteredData = useMemo(() => {
    if (!searchText || !globalSearch) return data;
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [data, searchText, globalSearch]);

  const processedColumns = useMemo(() => {
    return columns
      .filter((col) => !hiddenColumns.has(col.key))
      .map((col) => ({
        key: col.key,
        title: col.title,
        dataIndex: col.dataIndex as any,
        render: col.render,
        sorter: col.sortable
          ? (a: T, b: T) => {
              const aValue = col.dataIndex ? (a as any)[col.dataIndex] : "";
              const bValue = col.dataIndex ? (b as any)[col.dataIndex] : "";
              return String(aValue).localeCompare(String(bValue));
            }
          : undefined,
        width: col.width,
        fixed: col.fixed,
      })) as ColumnsType<T>;
  }, [columns, hiddenColumns]);

  const columnVisibilityItems = columns.map((col) => ({
    key: col.key,
    label: (
      <Checkbox
        checked={!hiddenColumns.has(col.key)}
        onChange={(e) => {
          const next = new Set(hiddenColumns);
          if (e.target.checked) next.delete(col.key);
          else next.add(col.key);
          setHiddenColumns(next);
        }}
      >
        {col.title}
      </Checkbox>
    ),
  }));

  const toolbar = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      {searchable && (
        <Input
          placeholder="Szukaj w tabeli..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
          data-testid="table-search"
        />
      )}
      <Space>
        {exportable && (
          <Button
            icon={<DownloadOutlined />}
            onClick={() => onExport?.(filteredData)}
          >
            Eksportuj
          </Button>
        )}
        {columnManagement && (
          <Dropdown menu={{ items: columnVisibilityItems }} trigger={["click"]}>
            <Button icon={<SettingOutlined />}>Kolumny</Button>
          </Dropdown>
        )}
      </Space>
    </div>
  );

  return (
    <div
      data-testid="app-table"
      data-component="AppTable"
      data-variant={
        exportable && columnManagement
          ? "full-featured"
          : exportable
          ? "with-export"
          : columnManagement
          ? "with-columns"
          : "basic"
      }
      data-state={searchable ? "searchable" : "static"}
    >
      {toolbar}
      <Table
        columns={processedColumns}
        dataSource={filteredData}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} z ${total} elementów`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        scroll={{ x: "max-content" }}
        {...tableProps}
      />
    </div>
  );
}
