import * as React from "react";
import { Icon } from "../Icon/Icon";

export interface CollapseProps {
  children: React.ReactNode;
  ghost?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface CollapsePanelProps {
  header: React.ReactNode;
  children: React.ReactNode;
  key: string;
  className?: string;
  style?: React.CSSProperties;
}

const CollapsePanel = React.memo(function CollapsePanel({
  header,
  children,
  className = "",
  style,
}: CollapsePanelProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      className={`tw-border tw-border-gray-200 tw-rounded-lg tw-mb-2 ${className}`}
      style={style}
    >
      <button
        className="tw-w-full tw-px-4 tw-py-3 tw-text-left tw-flex tw-items-center tw-justify-between tw-bg-gray-50 hover:tw-bg-gray-100 tw-transition-colors tw-rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="tw-font-medium tw-text-gray-900">{header}</span>
        <Icon
          name={isOpen ? "chevron-up" : "chevron-down"}
          className="tw-h-4 tw-w-4 tw-text-gray-500"
        />
      </button>
      {isOpen && (
        <div className="tw-px-4 tw-pb-4 tw-pt-2 tw-bg-white">{children}</div>
      )}
    </div>
  );
});

export const Collapse = React.memo(function Collapse({
  children,
  ghost = false,
  className = "",
  style,
}: CollapseProps) {
  const ghostClass = ghost ? "tw-bg-transparent tw-border-none" : "";

  return (
    <div className={`tw-space-y-2 ${ghostClass} ${className}`} style={style}>
      {children}
    </div>
  );
});

// Add Panel as a static property
Collapse.Panel = CollapsePanel;
