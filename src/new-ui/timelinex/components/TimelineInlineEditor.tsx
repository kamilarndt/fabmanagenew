// Inline editor component for TimelineX items

import React, { useEffect, useRef, useState } from "react";
import { TimelineItem, TimelineTheme } from "../types";

export interface TimelineInlineEditorProps {
  item: TimelineItem;
  theme: TimelineTheme;
  onSave: (item: TimelineItem) => void;
  onCancel: () => void;
  onDelete?: (item: TimelineItem) => void;
  bounds: { x: number; y: number; width: number; height: number };
}

export function TimelineInlineEditor({
  item,
  theme,
  onSave,
  onCancel,
  onDelete,
  bounds,
}: TimelineInlineEditorProps) {
  const [editedItem, setEditedItem] = useState<TimelineItem>(item);
  const [activeField, setActiveField] = useState<
    "title" | "start" | "end" | null
  >(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeField === "title" && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    } else if (activeField === "start" && startInputRef.current) {
      startInputRef.current.focus();
      startInputRef.current.select();
    } else if (activeField === "end" && endInputRef.current) {
      endInputRef.current.focus();
      endInputRef.current.select();
    }
  }, [activeField]);

  const handleSave = () => {
    onSave(editedItem);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(item);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    } else if (event.key === "Delete" && event.ctrlKey && onDelete) {
      handleDelete();
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  };

  const parseDate = (dateString: string) => {
    return new Date(dateString);
  };

  const editorStyle: React.CSSProperties = {
    position: "absolute",
    left: bounds.x,
    top: bounds.y,
    width: Math.max(bounds.width, 300),
    height: Math.max(bounds.height, 120),
    backgroundColor: theme.colors.surface,
    border: `2px solid ${theme.colors.primary}`,
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    padding: "12px",
    zIndex: 1000,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.sm,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "6px 8px",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: "4px",
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.sm,
    marginBottom: "8px",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "6px 12px",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: "4px",
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    cursor: "pointer",
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.sm,
    marginRight: "8px",
  };

  const saveButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme.colors.primary,
    color: theme.colors.surface,
    borderColor: theme.colors.primary,
  };

  const deleteButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme.colors.error,
    color: theme.colors.surface,
    borderColor: theme.colors.error,
  };

  return (
    <div style={editorStyle} onKeyDown={handleKeyDown}>
      {/* Title Field */}
      <div style={{ marginBottom: "8px" }}>
        <label
          style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}
        >
          Title:
        </label>
        <input
          ref={titleInputRef}
          type="text"
          value={editedItem.title}
          onChange={(e) =>
            setEditedItem({ ...editedItem, title: e.target.value })
          }
          onFocus={() => setActiveField("title")}
          style={inputStyle}
          placeholder="Enter item title..."
        />
      </div>

      {/* Date Fields */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
        <div style={{ flex: 1 }}>
          <label
            style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}
          >
            Start:
          </label>
          <input
            ref={startInputRef}
            type="datetime-local"
            value={formatDate(editedItem.start)}
            onChange={(e) =>
              setEditedItem({
                ...editedItem,
                start: parseDate(e.target.value),
              })
            }
            onFocus={() => setActiveField("start")}
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label
            style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}
          >
            End:
          </label>
          <input
            ref={endInputRef}
            type="datetime-local"
            value={formatDate(editedItem.end || editedItem.start)}
            onChange={(e) =>
              setEditedItem({
                ...editedItem,
                end: parseDate(e.target.value),
              })
            }
            onFocus={() => setActiveField("end")}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Priority and Progress */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <div style={{ flex: 1 }}>
          <label
            style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}
          >
            Priority:
          </label>
          <select
            value={editedItem.priority || "normal"}
            onChange={(e) =>
              setEditedItem({
                ...editedItem,
                priority: e.target.value as any,
              })
            }
            style={inputStyle}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label
            style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}
          >
            Progress:
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={editedItem.progress || 0}
            onChange={(e) =>
              setEditedItem({
                ...editedItem,
                progress: parseInt(e.target.value),
              })
            }
            style={inputStyle}
          />
          <span style={{ fontSize: "12px", color: theme.colors.textSecondary }}>
            {editedItem.progress || 0}%
          </span>
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: "12px" }}>
        <label
          style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}
        >
          Description:
        </label>
        <textarea
          value={editedItem.description || ""}
          onChange={(e) =>
            setEditedItem({
              ...editedItem,
              description: e.target.value,
            })
          }
          style={{
            ...inputStyle,
            height: "60px",
            resize: "vertical",
          }}
          placeholder="Enter item description..."
        />
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <button style={saveButtonStyle} onClick={handleSave}>
            Save (Enter)
          </button>
          <button style={buttonStyle} onClick={handleCancel}>
            Cancel (Esc)
          </button>
        </div>
        {onDelete && (
          <button style={deleteButtonStyle} onClick={handleDelete}>
            Delete (Ctrl+Del)
          </button>
        )}
      </div>

      {/* Keyboard Shortcuts Help */}
      <div
        style={{
          marginTop: "8px",
          fontSize: "10px",
          color: theme.colors.textSecondary,
          textAlign: "center",
        }}
      >
        Press Enter to save, Esc to cancel, Ctrl+Del to delete
      </div>
    </div>
  );
}
