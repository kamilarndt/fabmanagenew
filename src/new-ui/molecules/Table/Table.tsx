import React from "react";
import { cn } from "@/lib/utils";

interface Column {
  title: string;
  dataIndex: string;
  key?: string;
  width?: number;
  render?: (value: any, record: any, index: number) => React.ReactNode;
}

interface TableProps {
  dataSource: any[];
  columns: Column[];
  rowKey?: string | ((record: any) => string);
  pagination?: boolean | object;
  onRow?: (record: any) => {
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  };
  className?: string;
  style?: React.CSSProperties;
}

export const Table: React.FC<TableProps> = ({
  dataSource,
  columns,
  rowKey = "key",
  pagination = false,
  onRow,
  className,
  style,
}) => {
  const getRowKey = (record: any, index: number) => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return record[rowKey] || index;
  };

  return (
    <div className={cn("overflow-x-auto", className)} style={style}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={column.key || column.dataIndex}
                className="px-4 py-3 text-left font-medium text-gray-700 bg-gray-50"
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSource.map((record, index) => {
            const rowProps = onRow?.(record) || {};
            return (
              <tr
                key={getRowKey(record, index)}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={rowProps.onClick}
                onMouseEnter={rowProps.onMouseEnter}
                onMouseLeave={rowProps.onMouseLeave}
              >
                {columns.map((column) => (
                  <td
                    key={column.key || column.dataIndex}
                    className="px-4 py-3"
                  >
                    {column.render
                      ? column.render(record[column.dataIndex], record, index)
                      : record[column.dataIndex]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
