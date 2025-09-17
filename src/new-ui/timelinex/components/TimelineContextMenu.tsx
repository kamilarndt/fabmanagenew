// Context menu component for TimelineX

import React, { useEffect, useRef, useState } from "react";
import { TimelineItem, TimelineTheme } from "../types";

export interface TimelineContextMenuProps {
  item: TimelineItem | null;
  position: { x: number; y: number } | null;
  theme: TimelineTheme;
  onClose: () => void;
  onEdit?: (item: TimelineItem) => void;
  onDelete?: (item: TimelineItem) => void;
  onDuplicate?: (item: TimelineItem) => void;
  onMoveToGroup?: (item: TimelineItem, groupId: string) => void;
  onSetPriority?: (
    item: TimelineItem,
    priority: "low" | "normal" | "high" | "critical"
  ) => void;
  onSetProgress?: (item: TimelineItem, progress: number) => void;
  onExport?: (item: TimelineItem) => void;
  groups?: Array<{ id: string; title: string }>;
}

export function TimelineContextMenu({
  item,
  position,
  theme,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  onMoveToGroup,
  onSetPriority,
  onSetProgress,
  onExport,
  groups = [],
}: TimelineContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [submenu, setSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!item || !position) return null;

  const menuStyle: React.CSSProperties = {
    position: "fixed",
    left: position.x,
    top: position.y,
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 1000,
    minWidth: "200px",
    padding: "4px 0",
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.sm,
  };

  const menuItemStyle: React.CSSProperties = {
    padding: "8px 16px",
    cursor: "pointer",
    color: theme.colors.text,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "none",
    background: "none",
    width: "100%",
    textAlign: "left",
  };

  const menuItemHoverStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary + "20",
  };

  const submenuStyle: React.CSSProperties = {
    position: "absolute",
    left: "100%",
    top: "0",
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    minWidth: "150px",
    padding: "4px 0",
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    onClose();
  };

  const handleSubmenuToggle = (submenuName: string) => {
    setSubmenu(submenu === submenuName ? null : submenuName);
  };

  return (
    <div ref={menuRef} style={menuStyle}>
      {/* Basic Actions */}
      {onEdit && (
        <button
          style={menuItemStyle}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, menuItemHoverStyle)
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, menuItemStyle)
          }
          onClick={() => handleMenuItemClick(() => onEdit(item))}
        >
          Edit Item
        </button>
      )}

      {onDuplicate && (
        <button
          style={menuItemStyle}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, menuItemHoverStyle)
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, menuItemStyle)
          }
          onClick={() => handleMenuItemClick(() => onDuplicate(item))}
        >
          Duplicate
        </button>
      )}

      {/* Priority Submenu */}
      {onSetPriority && (
        <div style={{ position: "relative" }}>
          <button
            style={menuItemStyle}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, menuItemHoverStyle)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, menuItemStyle)
            }
            onClick={() => handleSubmenuToggle("priority")}
          >
            Set Priority
            <span>▶</span>
          </button>
          {submenu === "priority" && (
            <div style={submenuStyle}>
              {["low", "normal", "high", "critical"].map((priority) => (
                <button
                  key={priority}
                  style={menuItemStyle}
                  onMouseEnter={(e) =>
                    Object.assign(e.currentTarget.style, menuItemHoverStyle)
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.currentTarget.style, menuItemStyle)
                  }
                  onClick={() =>
                    handleMenuItemClick(() =>
                      onSetPriority(item, priority as any)
                    )
                  }
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Progress Submenu */}
      {onSetProgress && (
        <div style={{ position: "relative" }}>
          <button
            style={menuItemStyle}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, menuItemHoverStyle)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, menuItemStyle)
            }
            onClick={() => handleSubmenuToggle("progress")}
          >
            Set Progress
            <span>▶</span>
          </button>
          {submenu === "progress" && (
            <div style={submenuStyle}>
              {[0, 25, 50, 75, 100].map((progress) => (
                <button
                  key={progress}
                  style={menuItemStyle}
                  onMouseEnter={(e) =>
                    Object.assign(e.currentTarget.style, menuItemHoverStyle)
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.currentTarget.style, menuItemStyle)
                  }
                  onClick={() =>
                    handleMenuItemClick(() => onSetProgress(item, progress))
                  }
                >
                  {progress}%
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Move to Group Submenu */}
      {onMoveToGroup && groups.length > 0 && (
        <div style={{ position: "relative" }}>
          <button
            style={menuItemStyle}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, menuItemHoverStyle)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, menuItemStyle)
            }
            onClick={() => handleSubmenuToggle("group")}
          >
            Move to Group
            <span>▶</span>
          </button>
          {submenu === "group" && (
            <div style={submenuStyle}>
              {groups.map((group) => (
                <button
                  key={group.id}
                  style={menuItemStyle}
                  onMouseEnter={(e) =>
                    Object.assign(e.currentTarget.style, menuItemHoverStyle)
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.currentTarget.style, menuItemStyle)
                  }
                  onClick={() =>
                    handleMenuItemClick(() => onMoveToGroup(item, group.id))
                  }
                >
                  {group.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Export */}
      {onExport && (
        <button
          style={menuItemStyle}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, menuItemHoverStyle)
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, menuItemStyle)
          }
          onClick={() => handleMenuItemClick(() => onExport(item))}
        >
          Export Item
        </button>
      )}

      {/* Separator */}
      <div
        style={{
          height: "1px",
          backgroundColor: theme.colors.border,
          margin: "4px 0",
        }}
      />

      {/* Delete */}
      {onDelete && (
        <button
          style={{
            ...menuItemStyle,
            color: theme.colors.error,
          }}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, {
              ...menuItemHoverStyle,
              backgroundColor: theme.colors.error + "20",
            })
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, {
              ...menuItemStyle,
              color: theme.colors.error,
            })
          }
          onClick={() => handleMenuItemClick(() => onDelete(item))}
        >
          Delete Item
        </button>
      )}
    </div>
  );
}
