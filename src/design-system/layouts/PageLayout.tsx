import { Layout } from "antd";
import React from "react";

const { Content } = Layout;

interface PageLayoutProps {
  children: React.ReactNode;
  padding?: boolean;
  className?: string;
}

export function PageLayout({ 
  children, 
  padding = true, 
  className 
}: PageLayoutProps) {
  return (
    <Layout className={className}>
      <Content 
        style={{ 
          padding: padding ? "24px" : "0",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5"
        }}
      >
        {children}
      </Content>
    </Layout>
  );
}
