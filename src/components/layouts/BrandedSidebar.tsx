import { Avatar, ConfigProvider, Dropdown, Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { AppButton } from "../ui/AppButton";
import { Icon } from "../ui/Icon";
import { Body, Caption } from "../ui/Typography";

const { Sider } = Layout;

interface BrandedSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export function BrandedSidebar({ collapsed, onCollapse }: BrandedSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Menu items zgodnie ze specyfikacją
  const menuItems = [
    {
      key: "/",
      icon: <Icon name="HomeOutlined" />,
      label: "Dashboard",
      path: "/",
    },
    {
      key: "/projects",
      icon: <Icon name="FolderOutlined" />,
      label: "Projekty",
      path: "/projects",
    },
    {
      key: "/klienci",
      icon: <Icon name="TeamOutlined" />,
      label: "Klienci",
      path: "/klienci",
    },
    {
      key: "/calendar",
      icon: <Icon name="CalendarOutlined" />,
      label: "Kalendarz",
      path: "/calendar",
    },
    {
      key: "/projektowanie",
      icon: <Icon name="BgColorsOutlined" />,
      label: "Dział Projektowy",
      path: "/projektowanie",
    },
    {
      key: "/cnc",
      icon: <Icon name="ToolOutlined" />,
      label: "CNC",
      path: "/cnc",
    },
    {
      key: "/produkcja",
      icon: <Icon name="BuildOutlined" />,
      label: "Produkcja",
      path: "/produkcja",
    },
    {
      key: "/magazyn",
      icon: <Icon name="InboxOutlined" />,
      label: "Magazyn",
      path: "/magazyn",
    },
    {
      key: "/subcontractors",
      icon: <Icon name="TruckOutlined" />,
      label: "Podwykonawcy",
      path: "/subcontractors",
    },
    {
      key: "/demands",
      icon: <Icon name="ShoppingCartOutlined" />,
      label: "Zapotrzebowania",
      path: "/demands",
    },
  ];

  // Dropdown menu dla użytkownika
  const userMenuItems = [
    {
      key: "profile",
      icon: <Icon name="UserOutlined" />,
      label: "Mój Profil",
    },
    {
      key: "/settings",
      icon: <Icon name="SettingOutlined" />,
      label: "Ustawienia",
      path: "/settings",
    },
    {
      key: "help",
      icon: <Icon name="QuestionCircleOutlined" />,
      label: "Pomoc",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <Icon name="LogoutOutlined" />,
      label: "Wyloguj",
      danger: true,
    },
  ];

  const handleMenuClick = (item: { key: string }) => {
    const menuItem = menuItems.find((m) => m.key === item.key);
    if (menuItem) {
      navigate(menuItem.path);
    }
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case "profile":
        console.warn("TODO: Otwórz profil użytkownika");
        break;
      case "settings":
        navigate("/settings");
        break;
      case "help":
        console.warn("TODO: Otwórz pomoc");
        break;
      case "logout":
        console.warn("TODO: Wyloguj użytkownika");
        // TODO: Implementuj wylogowanie
        break;
    }
  };

  // Znajdź aktywny element menu na podstawie ścieżki
  const selectedKeys = [
    location.pathname.startsWith("/magazyn") ? "/magazyn" : location.pathname,
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            siderBg: "var(--bg-secondary)",
            triggerBg: "var(--bg-secondary)",
          },
          Menu: {
            darkItemBg: "var(--bg-secondary)",
            darkSubMenuItemBg: "var(--bg-secondary)",
            darkItemSelectedBg: "var(--primary-main)",
            darkItemHoverBg: "var(--bg-hover)",
          },
        },
      }}
    >
      <Sider
        collapsed={collapsed}
        onCollapse={onCollapse}
        width={280}
        collapsedWidth={80}
        style={{
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-main)",
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid var(--border-main)",
            padding: "0 24px",
            background: "var(--bg-secondary)",
          }}
        >
          {!collapsed ? (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: "var(--font-semibold)",
                  color: "var(--text-primary)",
                  lineHeight: 1.2,
                  marginBottom: 4,
                  fontFamily: "var(--font-family)",
                }}
              >
                🏭 Fabryka
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "var(--primary-main)",
                  fontWeight: "var(--font-medium)",
                  fontFamily: "var(--font-family)",
                }}
              >
                Dekoracji
              </div>
            </div>
          ) : (
            <div
              style={{
                fontSize: 24,
                color: "var(--primary-main)",
              }}
            >
              🏭
            </div>
          )}
        </div>

        {/* Collapse/Expand Button */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--border-main)",
          }}
        >
          <AppButton
            variant="ghost"
            size="middle"
            onClick={() => onCollapse(!collapsed)}
            style={{
              width: "100%",
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <Icon
              name={collapsed ? "MenuUnfoldOutlined" : "MenuFoldOutlined"}
              size={16}
            />
            {!collapsed && <span style={{ marginLeft: 8 }}>Zwiń menu</span>}
          </AppButton>
        </div>

        {/* Navigation Menu */}
        <Menu
          id="navigation"
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          style={{
            border: "none",
            background: "transparent",
            flex: 1,
            fontFamily: "var(--font-family)",
          }}
          onClick={handleMenuClick}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
          }))}
        />

        {/* User Section at Bottom */}
        <div
          style={{
            borderTop: "1px solid var(--border-main)",
            padding: "16px",
            background: "var(--bg-secondary)",
          }}
        >
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="topLeft"
            trigger={["click"]}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "8px",
                borderRadius: 6,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Avatar
                size={collapsed ? 32 : 40}
                icon={<Icon name="UserOutlined" />}
                style={{
                  backgroundColor: "var(--primary-main)",
                  flexShrink: 0,
                }}
              />
              {!collapsed && (
                <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                  <Body
                    weight="medium"
                    style={{
                      color: "var(--text-primary)",
                      display: "block",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Kamil Arndt
                  </Body>
                  <Caption
                    style={{
                      color: "var(--text-muted)",
                      display: "block",
                    }}
                  >
                    Administrator
                  </Caption>
                </div>
              )}
            </div>
          </Dropdown>
        </div>
      </Sider>
    </ConfigProvider>
  );
}

export default BrandedSidebar;
