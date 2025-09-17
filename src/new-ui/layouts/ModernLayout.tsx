import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "../organisms/Sidebar";
import type { SidebarItem } from "../organisms/Sidebar/Sidebar";

const ModernLayout: React.FC = () => {
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
      id: "projekty",
      label: "Projekty",
      icon: "files",
      onClick: () => navigate("/projects"),
    },
    {
      id: "klienci",
      label: "Klienci",
      icon: "users",
      onClick: () => navigate("/klienci"),
    },
    {
      id: "kalendarz",
      label: "Kalendarz",
      icon: "calendar-days",
      onClick: () => navigate("/calendar"),
    },
    {
      id: "dzial-projektowy",
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
      id: "produkcja",
      label: "Produkcja",
      icon: "factory",
      onClick: () => navigate("/produkcja"),
    },
    {
      id: "magazyn",
      label: "Magazyn",
      icon: "warehouse",
      onClick: () => navigate("/magazyn"),
    },
    {
      id: "podwykonawcy",
      label: "Podwykonawcy",
      icon: "hard-hat",
      onClick: () => navigate("/subcontractors"),
    },
    {
      id: "zapotrzebowania",
      label: "Zapotrzebowania",
      icon: "package",
      onClick: () => navigate("/demands"),
    },
  ];

  // Określ aktywny element na podstawie aktualnej ścieżki
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/") return "dashboard";
    if (path.startsWith("/projects")) return "projekty";
    if (path.startsWith("/klienci")) return "klienci";
    if (path.startsWith("/calendar")) return "kalendarz";
    if (path.startsWith("/projektowanie")) return "dzial-projektowy";
    if (path.startsWith("/cnc")) return "cnc";
    if (path.startsWith("/produkcja")) return "produkcja";
    if (path.startsWith("/magazyn")) return "magazyn";
    if (path.startsWith("/subcontractors")) return "podwykonawcy";
    if (path.startsWith("/demands")) return "zapotrzebowania";
    return "dashboard";
  };

  const handleItemClick = (item: SidebarItem) => {
    item.onClick?.();
  };

  const header = (
    <div className="tw-flex tw-items-center tw-gap-3 tw-px-2">
      <div className="tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-lg tw-bg-sidebar-primary">
        <span className="tw-text-sm tw-font-bold tw-text-sidebar-primary-foreground">
          F
        </span>
      </div>
      <div>
        <div className="tw-text-base tw-font-semibold tw-text-sidebar-foreground">
          FabManage
        </div>
        <div className="tw-text-xs tw-text-sidebar-accent-foreground">
          System Zarządzania Produkcją
        </div>
      </div>
    </div>
  );

  return (
    <div className="tw-flex tw-h-screen tw-bg-background">
      {/* Sidebar */}
      <Sidebar
        items={sidebarItems}
        activeItem={getActiveItem()}
        onItemClick={handleItemClick}
        header={header}
        className="tw-w-64 tw-bg-sidebar tw-border-r tw-border-sidebar-border tw-flex-shrink-0"
      />

      {/* Main Content */}
      <div className="tw-flex-1 tw-flex tw-flex-col tw-overflow-hidden">
        {/* Header */}
        <header className="tw-h-18 tw-bg-background tw-border-b tw-border-border tw-px-6 tw-py-4">
          <div className="tw-flex tw-items-center tw-justify-between">
            <div className="tw-flex tw-items-center tw-gap-2">
              <span className="tw-text-muted-foreground">Title</span>
              <span className="tw-text-muted-foreground">›</span>
              <span className="tw-text-muted-foreground">Title</span>
              <span className="tw-text-muted-foreground">›</span>
              <span className="tw-text-foreground">Title</span>
            </div>
            <button className="tw-rounded-md tw-bg-primary tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-primary-foreground hover:tw-bg-primary/90">
              Documentation Link
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="tw-flex-1 tw-overflow-y-auto tw-bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ModernLayout;
