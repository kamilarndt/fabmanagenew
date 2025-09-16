import { Input } from "@/new-ui/atoms/Input/Input";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (record: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  onRowClick,
  searchable = true,
  searchPlaceholder = "Search...",
  className,
}: DataTableProps<T>): React.ReactElement {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (loading) {
    return (
      <div
        className={cn(
          "tw-flex tw-items-center tw-justify-center tw-h-32",
          className
        )}
      >
        <div className="tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-b-2 tw-border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn("tw-space-y-4", className)}>
      {searchable && (
        <div className="tw-flex tw-items-center tw-space-x-2">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="tw-max-w-sm"
          />
        </div>
      )}

      <div className="tw-rounded-md tw-border">
        <div className="tw-overflow-x-auto">
          <table className="tw-w-full">
            <thead>
              <tr className="tw-border-b tw-bg-muted/50">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      "tw-h-12 tw-px-4 tw-text-left tw-align-middle tw-font-medium tw-text-muted-foreground",
                      column.sortable &&
                        "tw-cursor-pointer tw-hover:tw-bg-muted/80",
                      column.width && `tw-w-[${column.width}]`
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="tw-flex tw-items-center tw-space-x-2">
                      <span>{column.title}</span>
                      {column.sortable && sortConfig.key === column.key && (
                        <span className="tw-text-xs">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((record, index) => (
                <tr
                  key={index}
                  className={cn(
                    "tw-border-b tw-transition-colors",
                    onRowClick && "tw-cursor-pointer tw-hover:tw-bg-muted/50"
                  )}
                  onClick={() => onRowClick?.(record)}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="tw-p-4 tw-align-middle"
                    >
                      {column.render
                        ? column.render(record[column.key], record)
                        : String(record[column.key] || "-")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sortedData.length === 0 && (
        <div className="tw-text-center tw-py-8 tw-text-muted-foreground">
          No data found
        </div>
      )}
    </div>
  );
}
