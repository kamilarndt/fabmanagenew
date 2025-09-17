import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "../../atoms/Icon/Icon";

interface BreadcrumbItem {
  title: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <Icon name="chevron-right" className="w-3 h-3" />,
  className,
}) => {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-gray-400 mx-1">{separator}</span>
          )}
          {item.href || item.onClick ? (
            <a
              href={item.href}
              onClick={item.onClick}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {item.title}
            </a>
          ) : (
            <span className="text-gray-900 font-medium">{item.title}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};