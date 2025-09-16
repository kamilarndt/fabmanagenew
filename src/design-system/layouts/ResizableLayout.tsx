import { Splitter } from "antd";
import React from "react";

interface ResizableLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultSizes?: [number, number];
  minSizes?: [number, number];
}

export function ResizableLayout({ 
  leftPanel, 
  rightPanel, 
  defaultSizes = [300, 0],
  minSizes = [200, 400]
}: ResizableLayoutProps) {
  return (
    <Splitter
      style={{ height: "100vh" }}
    >
      <Splitter.Panel 
        defaultSize={defaultSizes[0]} 
        min={minSizes[0]}
      >
        {leftPanel}
      </Splitter.Panel>
      <Splitter.Panel 
        min={minSizes[1]}
      >
        {rightPanel}
      </Splitter.Panel>
    </Splitter>
  );
}
