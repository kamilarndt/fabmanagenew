// Timeline controls component with render mode switching

import {
  TimelineGroup,
  TimelineItem,
  TimelineMode,
  TimelineSettings,
  TimelineTheme,
  Viewport,
} from "../types";
import { exportTimeline } from "../utils/exportUtils";

export interface TimelineControlsProps {
  items: TimelineItem[];
  groups: TimelineGroup[];
  viewport: Viewport;
  mode: TimelineMode;
  theme: TimelineTheme;
  settings: TimelineSettings;
  onViewportChange: (viewport: Viewport) => void;
  onZoom: (zoom: number, center?: { x: number; y: number }) => void;
  onPan: (pan: { x: number; y: number }) => void;
  onExport: (format: string, data: any) => void;
  onImport: (data: any) => void;
  renderMode?: "canvas" | "svg" | "webgl" | "virtual" | "lazy" | "touch" | "animated" | "mobile";
  onRenderModeChange?: (mode: "canvas" | "svg" | "webgl" | "virtual" | "lazy" | "touch" | "animated" | "mobile") => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function TimelineControls({
  items,
  groups,
  viewport,
  mode,
  theme,
  settings,
  onViewportChange,
  onZoom,
  onPan,
  onExport,
  onImport,
  renderMode = "canvas",
  onRenderModeChange,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: TimelineControlsProps) {
  const handleZoomIn = () => {
    const newZoom = Math.min(10, viewport.zoom * 1.2);
    onZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(0.1, viewport.zoom * 0.8);
    onZoom(newZoom);
  };

  const handleFitToContent = () => {
    if (items.length === 0) return;

    const startTimes = items.map((item) => item.start.getTime());
    const endTimes = items.map((item) => (item.end || item.start).getTime());

    const minTime = Math.min(...startTimes);
    const maxTime = Math.max(...endTimes);
    const duration = maxTime - minTime;

    if (duration > 0) {
      const padding = duration * 0.1; // 10% padding
      onViewportChange({
        ...viewport,
        start: new Date(minTime - padding),
        end: new Date(maxTime + padding),
        zoom: 1,
        pan: { x: 0, y: 0 },
      });
    }
  };

  const handleExportSVG = async () => {
    try {
      await exportTimeline(
        { items, groups, viewport, mode, theme, settings },
        { format: "svg", filename: "timeline-export" }
      );
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleExportPNG = async () => {
    try {
      await exportTimeline(
        { items, groups, viewport, mode, theme, settings },
        { format: "png", filename: "timeline-export" }
      );
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleExportJSON = async () => {
    try {
      await exportTimeline(
        { items, groups, viewport, mode, theme, settings },
        { format: "json", filename: "timeline-export" }
      );
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleExportCSV = async () => {
    try {
      await exportTimeline(
        { items, groups, viewport, mode, theme, settings },
        { format: "csv", filename: "timeline-export" }
      );
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div
      className="timeline-controls"
      style={{
        display: "flex",
        gap: "8px",
        padding: "8px",
        backgroundColor: theme.colors.surface,
        borderBottom: `1px solid ${theme.colors.border}`,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Zoom Controls */}
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        <button
          onClick={handleZoomOut}
          style={{
            padding: "4px 8px",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "4px",
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            cursor: "pointer",
          }}
        >
          -
        </button>
        <span
          style={{
            fontSize: "12px",
            color: theme.colors.textSecondary,
            minWidth: "60px",
            textAlign: "center",
          }}
        >
          {Math.round(viewport.zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          style={{
            padding: "4px 8px",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "4px",
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            cursor: "pointer",
          }}
        >
          +
        </button>
      </div>

      {/* Fit to Content */}
      <button
        onClick={handleFitToContent}
        style={{
          padding: "4px 8px",
          border: `1px solid ${theme.colors.border}`,
          borderRadius: "4px",
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        Fit to Content
      </button>

      {/* Render Mode Toggle */}
      {onRenderModeChange && (
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: theme.colors.textSecondary }}>
            Render:
          </span>
          <button
            onClick={() => onRenderModeChange("canvas")}
            style={{
              padding: "4px 8px",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: "4px",
              backgroundColor:
                renderMode === "canvas"
                  ? theme.colors.primary
                  : theme.colors.background,
              color:
                renderMode === "canvas"
                  ? theme.colors.background
                  : theme.colors.text,
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Canvas
          </button>
          <button
            onClick={() => onRenderModeChange("svg")}
            style={{
              padding: "4px 8px",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: "4px",
              backgroundColor:
                renderMode === "svg"
                  ? theme.colors.primary
                  : theme.colors.background,
              color:
                renderMode === "svg"
                  ? theme.colors.background
                  : theme.colors.text,
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            SVG
          </button>
          <button
            onClick={() => onRenderModeChange("webgl")}
            style={{
              padding: "4px 8px",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: "4px",
              backgroundColor:
                renderMode === "webgl"
                  ? theme.colors.primary
                  : theme.colors.background,
              color:
                renderMode === "webgl"
                  ? theme.colors.background
                  : theme.colors.text,
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            WebGL
          </button>
          <button
            onClick={() => onRenderModeChange("virtual")}
            style={{
              padding: "4px 8px",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: "4px",
              backgroundColor:
                renderMode === "virtual"
                  ? theme.colors.primary
                  : theme.colors.background,
              color:
                renderMode === "virtual"
                  ? theme.colors.background
                  : theme.colors.text,
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Virtual
          </button>
          <button
            onClick={() => onRenderModeChange("lazy")}
            style={{
              padding: "4px 8px",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: "4px",
              backgroundColor:
                renderMode === "lazy"
                  ? theme.colors.primary
                  : theme.colors.background,
              color:
                renderMode === "lazy"
                  ? theme.colors.background
                  : theme.colors.text,
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Lazy
          </button>
          <button
            onClick={() => onRenderModeChange("touch")}
            style={{
              padding: "4px 8px",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: "4px",
              backgroundColor:
                renderMode === "touch"
                  ? theme.colors.primary
                  : theme.colors.background,
              color:
                renderMode === "touch"
                  ? theme.colors.background
                  : theme.colors.text,
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Touch
          </button>
          <button
            onClick={() => onRenderModeChange("animated")}
            style={{
              padding: "4px 8px",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: "4px",
              backgroundColor:
                renderMode === "animated"
                  ? theme.colors.primary
                  : theme.colors.background,
              color:
                renderMode === "animated"
                  ? theme.colors.background
                  : theme.colors.text,
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Animated
          </button>
          <button
            onClick={() => onRenderModeChange("mobile")}
            style={{
              padding: "4px 8px",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: "4px",
              backgroundColor:
                renderMode === "mobile"
                  ? theme.colors.primary
                  : theme.colors.background,
              color:
                renderMode === "mobile"
                  ? theme.colors.background
                  : theme.colors.text,
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Mobile
          </button>
        </div>
      )}

      {/* Export Controls */}
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: theme.colors.textSecondary }}>
          Export:
        </span>
        <button
          onClick={handleExportSVG}
          style={{
            padding: "4px 8px",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "4px",
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          SVG
        </button>
        <button
          onClick={handleExportPNG}
          style={{
            padding: "4px 8px",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "4px",
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          PNG
        </button>
        <button
          onClick={handleExportJSON}
          style={{
            padding: "4px 8px",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "4px",
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          JSON
        </button>
        <button
          onClick={handleExportCSV}
          style={{
            padding: "4px 8px",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "4px",
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          CSV
        </button>
      </div>

      {/* Undo/Redo Controls */}
      {onUndo && onRedo && (
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            style={{
              ...buttonStyle,
              opacity: canUndo ? 1 : 0.5,
              cursor: canUndo ? "pointer" : "not-allowed",
            }}
          >
            ↶ Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            style={{
              ...buttonStyle,
              opacity: canRedo ? 1 : 0.5,
              cursor: canRedo ? "pointer" : "not-allowed",
            }}
          >
            ↷ Redo
          </button>
        </div>
      )}

      {/* Stats */}
      <div
        style={{
          fontSize: "12px",
          color: theme.colors.textSecondary,
          marginLeft: "auto",
        }}
      >
        {items.length} items, {groups.length} groups
      </div>
    </div>
  );
}
