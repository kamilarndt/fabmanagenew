import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../atoms/Icon/Icon";
import { Sidebar } from "../organisms/Sidebar";
import type { SidebarItem } from "../organisms/Sidebar/Sidebar";

interface ModernLayoutProps {
  children?: React.ReactNode;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Menu items zgodnie z Figmą - nowe ikony i nazwy
  const sidebarItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "house",
      href: "/",
      onClick: () => navigate("/"),
    },
    {
      id: "projekty",
      label: "Projekty",
      icon: "files",
      href: "/projects",
      onClick: () => navigate("/projects"),
    },
    {
      id: "klienci",
      label: "Klienci",
      icon: "users",
      href: "/klienci",
      onClick: () => navigate("/klienci"),
    },
    {
      id: "kalendarz",
      label: "Kalendarz",
      icon: "calendar-days",
      href: "/calendar",
      onClick: () => navigate("/calendar"),
    },
    {
      id: "dzial-projektowy",
      label: "Dział Projektowy",
      icon: "pencil-ruler",
      href: "/projektowanie",
      onClick: () => navigate("/projektowanie"),
    },
    {
      id: "cnc",
      label: "CNC",
      icon: "drill",
      href: "/cnc",
      onClick: () => navigate("/cnc"),
    },
    {
      id: "produkcja",
      label: "Produkcja",
      icon: "factory",
      href: "/produkcja",
      onClick: () => navigate("/produkcja"),
    },
    {
      id: "magazyn",
      label: "Magazyn",
      icon: "warehouse",
      href: "/magazyn",
      onClick: () => navigate("/magazyn"),
    },
    {
      id: "podwykonawcy",
      label: "Podwykonawcy",
      icon: "hard-hat",
      href: "/subcontractors",
      onClick: () => navigate("/subcontractors"),
    },
    {
      id: "zapotrzebowania",
      label: "Zapotrzebowania",
      icon: "package",
      href: "/demands",
      onClick: () => navigate("/demands"),
    },
  ];

  // Określ aktywny element na podstawie aktualnej ścieżki
  const getActiveItem = () => {
    const path = location.pathname;
    const findActive = (items: SidebarItem[]): SidebarItem | undefined => {
      for (const item of items) {
        if (item.href === path) {
          return item;
        }
        if (item.children) {
          const activeChild = findActive(item.children);
          if (activeChild) {
            return activeChild;
          }
        }
      }
      return undefined;
    };
    return findActive(sidebarItems);
  };

  const handleItemClick = (item: SidebarItem) => {
    item.onClick?.();
  };

  const header = (
    <div className="flex items-center gap-4">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl"
        style={{
          backgroundColor: "var(--color-foreground-primary)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <span
          className="text-xl font-bold"
          style={{ color: "var(--color-background-default)" }}
        >
          F
        </span>
      </div>
      <div>
        <div
          className="text-lg font-bold"
          style={{ color: "var(--color-foreground-primary)" }}
        >
          FabManage
        </div>
        <div
          className="text-xs"
          style={{ color: "var(--color-foreground-muted)" }}
        >
          System Zarządzania Produkcją
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="flex h-screen"
      style={{
        background:
          "linear-gradient(135deg, var(--color-background-default) 0%, var(--color-background-secondary) 50%, var(--color-background-default) 100%)",
      }}
    >
      {/* Sidebar */}
      <div
        className="w-64 flex-shrink-0"
        style={{ backgroundColor: "var(--color-sidebar-DEFAULT)" }}
      >
        <Sidebar
          items={sidebarItems}
          activeItem={getActiveItem()}
          onItemClick={handleItemClick}
          header={header}
          className="h-full"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className="m-4 mb-0 p-6"
          style={{
            backgroundColor: "var(--color-background-card)",
            border: "1px solid var(--color-border-default)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span style={{ color: "var(--color-foreground-muted)" }}>
                Dashboard
              </span>
              <Icon
                name="chevron-right"
                className="w-4 h-4"
                style={{ color: "var(--color-foreground-muted)" }}
              />
              <span
                className="font-medium"
                style={{ color: "var(--color-foreground-primary)" }}
              >
                Przegląd
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className="px-4 py-2 flex items-center space-x-2 hover-lift"
                style={{
                  backgroundColor: "var(--color-background-muted)",
                  color: "var(--color-foreground-primary)",
                  border: "1px solid var(--color-border-default)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <Icon name="bell" className="w-4 h-4" />
                <span>Powiadomienia</span>
              </button>
              <button
                className="px-4 py-2 flex items-center space-x-2 hover-lift"
                style={{
                  backgroundColor: "var(--color-background-accent)",
                  color: "var(--color-foreground-accent)",
                  border: "1px solid var(--color-border-default)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <Icon name="user" className="w-4 h-4" />
                <span>Profil</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="animate-fade-in">{children || <Outlet />}</div>
        </main>
      </div>
    </div>
  );
};

export default ModernLayout;
