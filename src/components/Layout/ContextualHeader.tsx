import {
  BellOutlined,
  LogoutOutlined,
  MoonOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Dropdown,
  Input,
  Layout,
  Select,
  Space,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSearchContext } from "../../contexts/SearchContext";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../providers/ThemeProvider";

const { Header } = Layout;
const { Search } = Input;

interface ContextualHeaderProps {
  style?: React.CSSProperties;
}

// Mapowanie ścieżek na breadcrumbs
const pathToBreadcrumbs: Record<string, { icon?: string; label: string }[]> = {
  "/": [{ icon: "🏠", label: "Dashboard" }],
  "/projects": [
    { icon: "🏠", label: "Dashboard" },
    { icon: "📂", label: "Projekty" },
  ],
  "/klienci": [
    { icon: "🏠", label: "Dashboard" },
    { icon: "👥", label: "Klienci" },
  ],
  "/calendar": [
    { icon: "🏠", label: "Dashboard" },
    { icon: "📅", label: "Kalendarz" },
  ],
  "/projektowanie": [
    { icon: "🏠", label: "Dashboard" },
    { icon: "🎨", label: "Dział Projektowy" },
  ],
  "/cnc": [
    { icon: "🏠", label: "Dashboard" },
    { icon: "⚙️", label: "CNC" },
  ],
  "/produkcja": [
    { icon: "🏠", label: "Dashboard" },
    { icon: "🏭", label: "Produkcja" },
  ],
  "/magazyn": [
    { icon: "🏠", label: "Dashboard" },
    { icon: "📦", label: "Magazyn" },
  ],
  "/subcontractors": [
    { icon: "🏠", label: "Dashboard" },
    { icon: "🚚", label: "Podwykonawcy" },
  ],
  "/demands": [
    { icon: "🏠", label: "Dashboard" },
    { icon: "🛒", label: "Zapotrzebowania" },
  ],
};

export default function ContextualHeader({ style }: ContextualHeaderProps) {
  const location = useLocation();
  const { searchConfig, setSearchQuery } = useSearchContext();
  const { t, language, changeLanguage } = useTranslation("common");
  const { mode, toggleTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(mode === "dark");
  const [notifications] = useState([
    {
      id: 1,
      title: "Nowe zamówienie",
      message: "Projekt P-019 wymaga uwagi",
      time: "5 min temu",
    },
    {
      id: 2,
      title: "Niski stan magazynowy",
      message: "MDF 18mm poniżej minimum",
      time: "1 godz. temu",
    },
    {
      id: 3,
      title: "Zakończono zadanie",
      message: "CNC - cięcie elementów",
      time: "2 godz. temu",
    },
  ]);

  // Generuj breadcrumbs na podstawie ścieżki
  const breadcrumbItems = pathToBreadcrumbs[location.pathname] || [
    { icon: "🏠", label: "Dashboard" },
    { label: "Strona" },
  ];

  // Dropdown dla powiadomień
  const notificationItems = notifications.map((notif) => ({
    key: notif.id,
    label: (
      <div style={{ width: 300, padding: 8 }}>
        <div style={{ fontWeight: 500, fontSize: 14 }}>{notif.title}</div>
        <div style={{ color: "#666", fontSize: 12, marginTop: 2 }}>
          {notif.message}
        </div>
        <div style={{ color: "#999", fontSize: 11, marginTop: 4 }}>
          {notif.time}
        </div>
      </div>
    ),
  }));

  // Dropdown dla użytkownika
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Mój Profil",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Ustawienia",
    },
    {
      key: "help",
      icon: <QuestionCircleOutlined />,
      label: "Pomoc",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Wyloguj",
      danger: true,
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case "profile":
        console.warn("TODO: Profil użytkownika");
        break;
      case "settings":
        console.warn("TODO: Ustawienia");
        break;
      case "help":
        console.warn("TODO: Pomoc");
        break;
      case "logout":
        console.warn("TODO: Wylogowanie");
        break;
    }
  };

  const handleNotificationClick = ({ key }: { key: string }) => {
    console.warn("TODO: Kliknięto powiadomienie:", key);
  };

  return (
    <Header
      style={{
        background: "var(--bg-secondary)",
        padding: "0 24px",
        borderBottom: "1px solid var(--border-main)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        position: "sticky",
        top: 0,
        zIndex: 99,
        fontFamily: "var(--font-family)",
        ...style,
      }}
    >
      {/* Breadcrumbs (lewa strona) */}
      <div style={{ flex: "0 0 auto", marginRight: 24 }}>
        <Breadcrumb
          items={breadcrumbItems.map((item) => ({
            title: (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            ),
          }))}
          style={{
            fontSize: 14,
            fontFamily: "var(--font-family)",
          }}
        />
      </div>

      {/* Kontekstowa wyszukiwarka (środek) */}
      <div style={{ flex: "1 1 auto", maxWidth: 500, margin: "0 24px" }}>
        {searchConfig && (
          <Search
            placeholder={searchConfig.placeholder}
            value={searchConfig.value}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={searchConfig.onSearch}
            style={{ width: "100%" }}
            size="middle"
            enterButton={<SearchOutlined />}
            allowClear
          />
        )}
      </div>

      {/* Akcje (prawa strona) */}
      <div style={{ flex: "0 0 auto" }}>
        <Space size="middle">
          {/* Język */}
          <Select
            value={(language || "pl").slice(0, 2)}
            onChange={(lng) => changeLanguage(lng)}
            size="small"
            style={{ width: 90 }}
            options={[
              { value: "pl", label: "Polski" },
              { value: "en", label: "English" },
            ]}
          />

          {/* Przełącznik motywu */}
          <Button
            type="text"
            icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
            onClick={() => {
              setIsDarkMode(!isDarkMode);
              toggleTheme();
            }}
            style={{ color: "var(--text-secondary)" }}
            title={
              isDarkMode
                ? t("actions.switchToLight") || "Jasny motyw"
                : t("actions.switchToDark") || "Ciemny motyw"
            }
          />

          {/* Powiadomienia */}
          <Dropdown
            menu={{
              items: [
                {
                  key: "header",
                  label: (
                    <div
                      style={{
                        padding: "8px 16px",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <Typography.Text strong>Powiadomienia</Typography.Text>
                    </div>
                  ),
                  disabled: true,
                },
                ...notificationItems,
                {
                  type: "divider" as const,
                },
                {
                  key: "view-all",
                  label: (
                    <div style={{ textAlign: "center", padding: 4 }}>
                      <Button type="link" size="small">
                        Zobacz wszystkie
                      </Button>
                    </div>
                  ),
                },
              ],
              onClick: handleNotificationClick,
            }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Button type="text" style={{ color: "var(--text-secondary)" }}>
              <Badge count={notifications.length} size="small">
                <BellOutlined style={{ fontSize: 16 }} />
              </Badge>
            </Button>
          </Dropdown>

          {/* Profil użytkownika */}
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Button type="text" style={{ padding: 4 }}>
              <Avatar
                size={32}
                icon={<UserOutlined />}
                style={{ backgroundColor: "var(--primary-main)" }}
              />
            </Button>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
}
