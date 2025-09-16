import { Layout } from "antd";
import React, { useState } from "react";

const { Sider, Content } = Layout;

interface ResizableLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  leftWidth?: number;
  rightWidth?: number;
  minLeftWidth?: number;
  minRightWidth?: number;
  orientation?: "horizontal" | "vertical";
  resizable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ResizableLayout({
  leftPanel,
  rightPanel,
  leftWidth = 300,
  rightWidth,
  minLeftWidth = 200,
  minRightWidth = 200,
  orientation = "horizontal",
  resizable = true,
  className,
  style,
}: ResizableLayoutProps) {
  const [leftPanelWidth, setLeftPanelWidth] = useState(leftWidth);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!resizable) return;
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = leftPanelWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newWidth =
        orientation === "horizontal" ? startWidth + deltaX : startWidth;

      const constrainedWidth = Math.max(
        minLeftWidth,
        Math.min(newWidth, window.innerWidth - minRightWidth)
      );

      setLeftPanelWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const rightPanelWidth = rightWidth || `calc(100% - ${leftPanelWidth}px)`;

  return (
    <Layout
      className={className}
      style={{
        height: "100%",
        background: "var(--bg-primary)",
        ...style,
      }}
      data-component="ResizableLayout"
      data-orientation={orientation}
      data-resizable={resizable}
    >
      <Sider
        width={leftPanelWidth}
        style={{
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-main)",
          overflow: "auto",
        }}
        data-panel="left"
      >
        {leftPanel}
      </Sider>

      {resizable && (
        <div
          style={{
            width: 4,
            background: isResizing
              ? "var(--primary-main)"
              : "var(--border-main)",
            cursor: "col-resize",
            position: "relative",
            zIndex: 10,
            transition: isResizing ? "none" : "background 0.2s",
          }}
          onMouseDown={handleMouseDown}
          data-resize-handle="true"
        />
      )}

      <Content
        style={{
          width: rightPanelWidth,
          background: "var(--bg-primary)",
          overflow: "auto",
        }}
        data-panel="right"
      >
        {rightPanel}
      </Content>
    </Layout>
  );
}

export function VerticalResizableLayout(
  props: Omit<ResizableLayoutProps, "orientation">
) {
  return <ResizableLayout orientation="vertical" {...props} />;
}

export default ResizableLayout;
