import { ConfigProvider, Splitter } from "antd";
import React from "react";

interface ResizableLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  direction?: "horizontal" | "vertical";
  className?: string;
  style?: React.CSSProperties;
}

export function ResizableLayout({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 320,
  minLeftWidth = 200,
  maxLeftWidth = 600,
  direction = "horizontal",
  className,
  style,
}: ResizableLayoutProps) {
  const layoutStyles: React.CSSProperties = {
    height: "100vh",
    fontFamily: "var(--font-family)",
    ...style,
  };

  const panelStyles: React.CSSProperties = {
    padding: 0,
    overflow: "hidden",
  };

  return (
    <ConfigProvider>
      <Splitter className={className} style={layoutStyles}>
        <Splitter.Panel
          defaultSize={direction === "horizontal" ? defaultLeftWidth : "50%"}
          min={direction === "horizontal" ? minLeftWidth : "20%"}
          max={direction === "horizontal" ? maxLeftWidth : "80%"}
          style={panelStyles}
        >
          {leftPanel}
        </Splitter.Panel>
        <Splitter.Panel style={panelStyles}>{rightPanel}</Splitter.Panel>
      </Splitter>
    </ConfigProvider>
  );
}

interface MasterDetailLayoutProps {
  masterPanel: React.ReactNode;
  detailPanel: React.ReactNode;
  masterWidth?: number;
  minMasterWidth?: number;
  maxMasterWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function MasterDetailLayout({
  masterPanel,
  detailPanel,
  masterWidth = 350,
  minMasterWidth = 250,
  maxMasterWidth = 500,
  className,
  style,
}: MasterDetailLayoutProps) {
  return (
    <ResizableLayout
      leftPanel={masterPanel}
      rightPanel={detailPanel}
      defaultLeftWidth={masterWidth}
      minLeftWidth={minMasterWidth}
      maxLeftWidth={maxMasterWidth}
      className={className}
      style={style}
    />
  );
}

interface VerticalSplitLayoutProps {
  topPanel: React.ReactNode;
  bottomPanel: React.ReactNode;
  defaultTopHeight?: string;
  minTopHeight?: string;
  maxTopHeight?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function VerticalSplitLayout({
  topPanel,
  bottomPanel,
  defaultTopHeight = "50%",
  minTopHeight = "20%",
  maxTopHeight = "80%",
  className,
  style,
}: VerticalSplitLayoutProps) {
  return (
    <ConfigProvider>
      <Splitter className={className} style={{ height: "100vh", ...style }}>
        <Splitter.Panel
          defaultSize={defaultTopHeight}
          min={minTopHeight}
          max={maxTopHeight}
        >
          {topPanel}
        </Splitter.Panel>
        <Splitter.Panel>{bottomPanel}</Splitter.Panel>
      </Splitter>
    </ConfigProvider>
  );
}

export default ResizableLayout;
