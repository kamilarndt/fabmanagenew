import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { designTokens } from "./design-tokens";
import { Header, Main, Sidebar } from "./index";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const theme = designTokens.getTheme();
  const backgroundColor = designTokens.resolveToken(
    designTokens.colors[theme].background.muted,
    theme
  );

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSidebarItemClick = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        navigate("/");
        break;
      case "projects":
        navigate("/projects");
        break;
      case "clients":
        navigate("/clients");
        break;
      case "calendar":
        navigate("/calendar");
        break;
      case "design":
        navigate("/design");
        break;
      case "cnc":
        navigate("/cnc");
        break;
      case "production":
        navigate("/production");
        break;
      case "warehouse":
        navigate("/warehouse");
        break;
      case "contractors":
        navigate("/contractors");
        break;
      case "requirements":
        navigate("/requirements");
        break;
      default:
        console.log(`Clicked sidebar item: ${itemId}`);
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: backgroundColor as string }}
    >
      {/* Sidebar */}
      <div
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } transition-all duration-300 ease-in-out`}
      >
        <Sidebar
          onToggle={handleSidebarToggle}
          items={[
            {
              id: "dashboard",
              label: "Dashboard",
              icon: "",
              onClick: () => handleSidebarItemClick("dashboard"),
            },
            {
              id: "projects",
              label: "Projekty",
              icon: "",
              onClick: () => handleSidebarItemClick("projects"),
            },
            {
              id: "clients",
              label: "Klienci",
              icon: "",
              onClick: () => handleSidebarItemClick("clients"),
            },
            {
              id: "calendar",
              label: "Kalendarz",
              icon: "",
              onClick: () => handleSidebarItemClick("calendar"),
            },
            {
              id: "design",
              label: "Dział Projektowy",
              icon: "",
              onClick: () => handleSidebarItemClick("design"),
            },
            {
              id: "cnc",
              label: "CNC",
              icon: "",
              onClick: () => handleSidebarItemClick("cnc"),
            },
            {
              id: "production",
              label: "Produkcja",
              icon: "",
              onClick: () => handleSidebarItemClick("production"),
            },
            {
              id: "warehouse",
              label: "Magazyn",
              icon: "",
              onClick: () => handleSidebarItemClick("warehouse"),
            },
            {
              id: "contractors",
              label: "Podwykonawcy",
              icon: "",
              onClick: () => handleSidebarItemClick("contractors"),
            },
            {
              id: "requirements",
              label: "Zapotrzebowania",
              icon: "",
              onClick: () => handleSidebarItemClick("requirements"),
            },
          ]}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16">
          <Header />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <Main
            title="FabManage - System Zarządzania Produkcją"
            description="Aplikacja została uproszczona do 3 głównych komponentów z Figmy"
          >
            {children}
          </Main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
