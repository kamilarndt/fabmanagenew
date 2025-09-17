import { cn } from "@/lib/utils";
import { Icon } from "@/new-ui/atoms/Icon/Icon";
import React, { useState } from "react";

interface CollapseProps {
  children: React.ReactNode;
  className?: string;
  ghost?: boolean;
}

interface CollapsePanelProps {
  header: React.ReactNode;
  children: React.ReactNode;
  key?: string;
  className?: string;
}

const Collapse: React.FC<CollapseProps> & {
  Panel: React.FC<CollapsePanelProps>;
} = ({ children, className = "", ghost = false }) => {
  return (
    <div
      className={cn(
        "border border-gray-200 rounded-lg overflow-hidden",
        ghost && "border-none bg-transparent",
        className
      )}
    >
      {children}
    </div>
  );
};

const CollapsePanel: React.FC<CollapsePanelProps> = ({
  header,
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("border-b border-gray-200 last:border-b-0", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{header}</span>
        <Icon
          name={isOpen ? "chevron-up" : "chevron-down"}
          className="w-4 h-4 text-gray-500"
        />
      </button>
      {isOpen && <div className="px-4 pb-3 text-gray-700">{children}</div>}
    </div>
  );
};

Collapse.Panel = CollapsePanel;

export { Collapse };
