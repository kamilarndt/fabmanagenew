import { Layout } from "antd";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ConnectionStatusIndicator from "../components/ConnectionStatusIndicator";
import ContextualHeader from "../components/Layout/ContextualHeader";
import { NewUINavigation } from "../components/NewUINavigation";
import { FadeIn } from "../components/ui/FadeIn";
import { SearchProvider } from "../contexts/SearchContext";
import type { SidebarItem } from "../new-ui/organisms/Sidebar/Sidebar";
import { Sidebar } from "../new-ui/organisms/Sidebar/Sidebar";

const { Content } = Layout;

export default function BrandedLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Menu items zgodnie z Figmą - nowe ikony i nazwy
  const sidebarItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "house",
      onClick: () => navigate("/"),
    },
    {
      id: "projects",
      label: "Projekty",
      icon: "files",
      onClick: () => navigate("/projects"),
    },
    {
      id: "clients",
      label: "Klienci",
      icon: "users",
      onClick: () => navigate("/klienci"),
    },
    {
      id: "calendar",
      label: "Kalendarz",
      icon: "calendar-days",
      onClick: () => navigate("/calendar"),
    },
    {
      id: "design",
      label: "Dział Projektowy",
      icon: "pencil-ruler",
      onClick: () => navigate("/projektowanie"),
    },
    {
      id: "cnc",
      label: "CNC",
      icon: "drill",
      onClick: () => navigate("/cnc"),
    },
    {
      id: "production",
      label: "Produkcja",
      icon: "factory",
      onClick: () => navigate("/produkcja"),
    },
    {
      id: "warehouse",
      label: "Magazyn",
      icon: "warehouse",
      onClick: () => navigate("/magazyn"),
    },
    {
      id: "contractors",
      label: "Podwykonawcy",
      icon: "hard-hat",
      onClick: () => navigate("/subcontractors"),
    },
    {
      id: "requirements",
      label: "Zapotrzebowania",
      icon: "package",
      onClick: () => navigate("/demands"),
    },
  ];

  // Określ aktywny element na podstawie aktualnej ścieżki
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/") return "dashboard";
    if (path.startsWith("/projects")) return "projects";
    if (path.startsWith("/klienci")) return "clients";
    if (path.startsWith("/calendar")) return "calendar";
    if (path.startsWith("/projektowanie")) return "design";
    if (path.startsWith("/cnc")) return "cnc";
    if (path.startsWith("/produkcja")) return "production";
    if (path.startsWith("/magazyn")) return "warehouse";
    if (path.startsWith("/subcontractors")) return "contractors";
    if (path.startsWith("/demands")) return "requirements";
    return "dashboard";
  };

  const handleItemClick = (item: SidebarItem) => {
    item.onClick?.();
  };

  return (
    <SearchProvider>
      <Layout style={{ minHeight: "100vh" }}>
        {/* New Sidebar */}
        <Sidebar
          items={sidebarItems}
          activeItem={getActiveItem()}
          onItemClick={handleItemClick}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="tw-w-64 tw-bg-sidebar tw-border-r tw-border-sidebar-border"
          header={
            <div className="tw-flex tw-items-center tw-gap-3 tw-px-2">
              <div className="tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-lg tw-bg-sidebar-primary">
                <span className="tw-text-sm tw-font-bold tw-text-sidebar-primary-foreground">
                  F
                </span>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <div className="tw-text-sm tw-font-semibold tw-text-sidebar-foreground">
                    FabManage
                  </div>
                  <div className="tw-text-xs tw-text-sidebar-accent-foreground">
                    System Zarządzania Produkcją
                  </div>
                </div>
              )}
            </div>
          }
        />

        {/* Main Layout */}
        <Layout
          style={{
            marginLeft: sidebarCollapsed ? 64 : 256,
            transition: "margin-left 0.2s",
            minHeight: "100vh",
          }}
        >
          {/* Contextual Header */}
          <ContextualHeader />

          {/* Content Area */}
          <Content
            id="main-content"
            className="tw-bg-background"
            style={{
              margin: 0,
              padding: 24,
              minHeight: "calc(100vh - 64px)",
              overflow: "auto",
              position: "relative",
            }}
          >
            {/* Connection Status Indicator */}
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 24,
                zIndex: 1000,
              }}
            >
              <ConnectionStatusIndicator />
            </div>

            <FadeIn>
              <div
                style={{
                  maxWidth: "none",
                  background: "transparent",
                }}
              >
                <Outlet />
              </div>
            </FadeIn>

            {/* New UI Navigation */}
            <NewUINavigation />
          </Content>
        </Layout>
      </Layout>
    </SearchProvider>
  );
}
