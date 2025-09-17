import React from "react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  showSizeChanger?: boolean;
  size?: "small" | "default";
  className?: string;
  style?: React.CSSProperties;
}

export const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
  showSizeChanger = false,
  size = "default",
  className,
  style,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const startPage = Math.max(1, current - 2);
  const endPage = Math.min(totalPages, current + 2);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const sizeClass = size === "small" ? "text-sm" : "text-base";

  return (
    <div
      className={cn("flex items-center justify-center space-x-1", className)}
      style={style}
    >
      <button
        className={cn(
          "px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClass
        )}
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
      >
        ‹
      </button>
      
      {startPage > 1 && (
        <>
          <button
            className={cn(
              "px-2 py-1 rounded hover:bg-gray-100",
              sizeClass
            )}
            onClick={() => onChange(1)}
          >
            1
          </button>
          {startPage > 2 && <span className="px-1">...</span>}
        </>
      )}
      
      {pages.map((page) => (
        <button
          key={page}
          className={cn(
            "px-2 py-1 rounded",
            page === current
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100",
            sizeClass
          )}
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-1">...</span>}
          <button
            className={cn(
              "px-2 py-1 rounded hover:bg-gray-100",
              sizeClass
            )}
            onClick={() => onChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        className={cn(
          "px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClass
        )}
        onClick={() => onChange(current + 1)}
        disabled={current === totalPages}
      >
        ›
      </button>
    </div>
  );
};