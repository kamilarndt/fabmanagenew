import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface TreeNode {
  key: string;
  title: React.ReactNode;
  children?: TreeNode[];
  icon?: React.ReactNode;
  disabled?: boolean;
  selectable?: boolean;
  checkable?: boolean;
  isLeaf?: boolean;
  expanded?: boolean;
  selected?: boolean;
  checked?: boolean;
  data?: any;
}

export interface TreeProps {
  treeData?: TreeNode[];
  defaultExpandedKeys?: string[];
  defaultSelectedKeys?: string[];
  defaultCheckedKeys?: string[];
  expandedKeys?: string[];
  selectedKeys?: string[];
  checkedKeys?: string[];
  onExpand?: (expandedKeys: string[], info: { expanded: boolean; node: TreeNode }) => void;
  onSelect?: (selectedKeys: string[], info: { selected: boolean; selectedNodes: TreeNode[]; node: TreeNode }) => void;
  onCheck?: (checkedKeys: string[], info: { checked: boolean; checkedNodes: TreeNode[]; node: TreeNode }) => void;
  checkable?: boolean;
  selectable?: boolean;
  multiple?: boolean;
  showLine?: boolean;
  showIcon?: boolean;
  className?: string;
  blockNode?: boolean;
  draggable?: boolean;
}

export function Tree({
  treeData = [],
  defaultExpandedKeys = [],
  defaultSelectedKeys = [],
  defaultCheckedKeys = [],
  expandedKeys,
  selectedKeys,
  checkedKeys,
  onExpand,
  onSelect,
  onCheck,
  checkable = false,
  selectable = true,
  multiple = false,
  showLine = false,
  showIcon = true,
  className,
  blockNode = false,
  draggable = false,
}: TreeProps): React.ReactElement {
  const [internalExpandedKeys, setInternalExpandedKeys] = React.useState<string[]>(
    expandedKeys || defaultExpandedKeys
  );
  const [internalSelectedKeys, setInternalSelectedKeys] = React.useState<string[]>(
    selectedKeys || defaultSelectedKeys
  );
  const [internalCheckedKeys, setInternalCheckedKeys] = React.useState<string[]>(
    checkedKeys || defaultCheckedKeys
  );

  const currentExpandedKeys = expandedKeys !== undefined ? expandedKeys : internalExpandedKeys;
  const currentSelectedKeys = selectedKeys !== undefined ? selectedKeys : internalSelectedKeys;
  const currentCheckedKeys = checkedKeys !== undefined ? checkedKeys : internalCheckedKeys;

  const toggleExpanded = (key: string, node: TreeNode) => {
    const isExpanded = currentExpandedKeys.includes(key);
    const newExpandedKeys = isExpanded
      ? currentExpandedKeys.filter(k => k !== key)
      : [...currentExpandedKeys, key];

    if (expandedKeys === undefined) {
      setInternalExpandedKeys(newExpandedKeys);
    }
    onExpand?.(newExpandedKeys, { expanded: !isExpanded, node });
  };

  const toggleSelected = (key: string, node: TreeNode) => {
    if (!selectable || node.disabled) return;

    const isSelected = currentSelectedKeys.includes(key);
    let newSelectedKeys: string[];

    if (multiple) {
      newSelectedKeys = isSelected
        ? currentSelectedKeys.filter(k => k !== key)
        : [...currentSelectedKeys, key];
    } else {
      newSelectedKeys = isSelected ? [] : [key];
    }

    if (selectedKeys === undefined) {
      setInternalSelectedKeys(newSelectedKeys);
    }

    const selectedNodes = treeData.filter(node => newSelectedKeys.includes(node.key));
    onSelect?.(newSelectedKeys, { 
      selected: !isSelected, 
      selectedNodes, 
      node 
    });
  };

  const toggleChecked = (key: string, node: TreeNode) => {
    if (!checkable || node.disabled) return;

    const isChecked = currentCheckedKeys.includes(key);
    const newCheckedKeys = isChecked
      ? currentCheckedKeys.filter(k => k !== key)
      : [...currentCheckedKeys, key];

    if (checkedKeys === undefined) {
      setInternalCheckedKeys(newCheckedKeys);
    }

    const checkedNodes = treeData.filter(node => newCheckedKeys.includes(node.key));
    onCheck?.(newCheckedKeys, { 
      checked: !isChecked, 
      checkedNodes, 
      node 
    });
  };

  const renderTreeNode = (node: TreeNode, level: number = 0): React.ReactElement => {
    const isExpanded = currentExpandedKeys.includes(node.key);
    const isSelected = currentSelectedKeys.includes(node.key);
    const isChecked = currentCheckedKeys.includes(node.key);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.key} className="tree-node">
        <div
          className={cn(
            "flex items-center py-1 px-2 rounded cursor-pointer transition-colors",
            "hover:bg-gray-50 dark:hover:bg-gray-800",
            isSelected && "bg-blue-50 dark:bg-blue-900/20",
            node.disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{
            paddingLeft: `${level * 20 + 8}px`,
          }}
          onClick={() => !node.disabled && toggleSelected(node.key, node)}
        >
          {/* Expand/Collapse Icon */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(node.key, node);
              }}
              className="w-4 h-4 flex items-center justify-center mr-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              <svg
                className={cn(
                  "w-3 h-3 transition-transform",
                  isExpanded && "rotate-90"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Checkbox */}
          {checkable && (
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => {
                e.stopPropagation();
                toggleChecked(node.key, node);
              }}
              disabled={node.disabled}
              className="w-4 h-4 mr-2"
            />
          )}

          {/* Node Icon */}
          {showIcon && node.icon && (
            <div className="w-4 h-4 mr-2 flex items-center justify-center">
              {node.icon}
            </div>
          )}

          {/* Node Title */}
          <span
            className={cn(
              "flex-1 text-sm",
              isSelected && "font-medium",
              node.disabled && "text-gray-400 dark:text-gray-600"
            )}
            style={{
              color: node.disabled 
                ? "var(--color-foreground-disabled)" 
                : "var(--color-foreground-primary)"
            }}
          >
            {node.title}
          </span>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="tree-children">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "tree-container",
        className
      )}
      style={{
        backgroundColor: "var(--color-card-background)",
        color: "var(--color-foreground-primary)",
      }}
    >
      {treeData.map(node => renderTreeNode(node))}
    </div>
  );
}

// Individual Tree Node Component
export interface TreeNodeProps {
  title: React.ReactNode;
  key?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  selectable?: boolean;
  checkable?: boolean;
  isLeaf?: boolean;
  expanded?: boolean;
  selected?: boolean;
  checked?: boolean;
  className?: string;
}

export function TreeNode({
  title,
  key,
  children,
  icon,
  disabled = false,
  selectable = true,
  checkable = false,
  isLeaf = false,
  expanded = false,
  selected = false,
  checked = false,
  className,
}: TreeNodeProps): React.ReactElement {
  return (
    <div className={cn("tree-node", className)}>
      <div
        className={cn(
          "flex items-center py-1 px-2 rounded cursor-pointer transition-colors",
          "hover:bg-gray-50 dark:hover:bg-gray-800",
          selected && "bg-blue-50 dark:bg-blue-900/20",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {/* Node Icon */}
        {icon && (
          <div className="w-4 h-4 mr-2 flex items-center justify-center">
            {icon}
          </div>
        )}

        {/* Node Title */}
        <span
          className={cn(
            "flex-1 text-sm",
            selected && "font-medium",
            disabled && "text-gray-400 dark:text-gray-600"
          )}
          style={{
            color: disabled 
              ? "var(--color-foreground-disabled)" 
              : "var(--color-foreground-primary)"
          }}
        >
          {title}
        </span>

        {/* Checkbox */}
        {checkable && (
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="w-4 h-4 ml-2"
          />
        )}
      </div>

      {/* Children */}
      {children && (
        <div className="tree-children ml-4">
          {children}
        </div>
      )}
    </div>
  );
}

