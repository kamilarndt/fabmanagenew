import { features } from "@/lib/config";
import { DataTable } from "@/new-ui";
import { Table as AntTable } from "antd";
import * as React from "react";

export interface BridgeTableProps<T = any> {
  dataSource: T[];
  columns: any[];
  loading?: boolean;
  pagination?: any;
  rowKey?: string | ((record: T) => string);
  onRow?: (record: T, index?: number) => any;
  className?: string;
  style?: React.CSSProperties;
  size?: "small" | "middle" | "large";
  bordered?: boolean;
  showHeader?: boolean;
  scroll?: any;
  rowSelection?: any;
  expandable?: any;
  footer?: (currentPageData: T[]) => React.ReactNode;
  title?: (currentPageData: T[]) => React.ReactNode;
  summary?: (currentPageData: T[]) => React.ReactNode;
  virtual?: boolean;
  components?: any;
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
}

export function Table<T extends Record<string, any> = Record<string, any>>(
  props: BridgeTableProps<T>
): React.ReactElement {
  const { dataSource, columns, loading, onRow, ...restProps } = props;

  if (features.newUI) {
    // Transform Ant Design columns to new UI format
    const transformedColumns = columns.map((col) => ({
      key: col.key || col.dataIndex,
      title: col.title,
      sortable: col.sorter !== undefined,
      render: col.render,
    }));

    const handleRowClick = onRow
      ? (record: T) => {
          const rowProps = onRow(record, 0); // Add index parameter
          if (rowProps?.onClick) {
            rowProps.onClick();
          }
        }
      : undefined;

    return (
      <DataTable
        data={dataSource}
        columns={transformedColumns}
        loading={loading}
        onRowClick={handleRowClick}
        {...restProps}
      />
    );
  }

  const { footer, summary, title, ...antTableProps } = props;
  return <AntTable {...antTableProps} />;
}
