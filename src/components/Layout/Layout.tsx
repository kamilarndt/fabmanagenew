import {
  BuildOutlined,
  BulbOutlined,
  DashboardOutlined,
  DollarOutlined,
  FileOutlined,
  FolderOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import {
  Layout as AntLayout,
  Button,
  Menu,
  Space,
  Typography,
  theme,
} from "antd";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = AntLayout;
const { Title } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: "/materials",
      icon: <ShoppingCartOutlined />,
      label: "Materials",
    },
    {
      key: "/tiles",
      icon: <DashboardOutlined />,
      label: "Project Tiles",
    },
    {
      key: "/pricing",
      icon: <DollarOutlined />,
      label: "Pricing",
    },
    {
      key: "/logistics",
      icon: <TruckOutlined />,
      label: "Logistics",
    },
    {
      key: "/accommodation",
      icon: <BuildOutlined />,
      label: "Accommodation",
    },
    {
      key: "/files",
      icon: <FileOutlined />,
      label: "Files",
    },
    {
      key: "/concepts",
      icon: <BulbOutlined />,
      label: "Concepts",
    },
    {
      key: "/documents",
      icon: <FolderOutlined />,
      label: "Documents",
    },
    {
      key: "/messaging",
      icon: <MessageOutlined />,
      label: "Messaging",
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: colorBgContainer,
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            padding: "16px",
            textAlign: "center",
            borderBottom: "1px solid #f0f0f0",
            marginBottom: "16px",
          }}
        >
          <Title level={4} style={{ margin: 0, color: "#1677ff" }}>
            {collapsed ? "FM" : "FabManage"}
          </Title>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: "none" }}
        />
      </Sider>

      <AntLayout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <Title level={3} style={{ margin: 0 }}>
              FabManage - Production Management System
            </Title>
          </Space>

          <Space>
            <Button type="primary" icon={<HomeOutlined />}>
              Dashboard
            </Button>
          </Space>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export { Layout };
