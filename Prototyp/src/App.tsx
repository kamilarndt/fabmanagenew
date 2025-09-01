import { useState } from "react";
import { SidebarProvider } from "./components/ui/sidebar";
import { TileStatusProvider } from "./components/TileStatusSync";
import { Toaster } from "./components/ui/sonner";
import { MainSidebar } from "./components/MainSidebar";
import { HeaderBar } from "./components/HeaderBar";
import { Dashboard } from "./components/sections/Dashboard";
import { Projekty } from "./components/sections/Projekty";
import { PojjedynczyProjektComplete } from "./components/sections/PojjedynczyProjektComplete";
import { Klienci } from "./components/sections/Klienci";
import { DzialProjektowy } from "./components/sections/DzialProjektowy";
import { CNCKanban } from "./components/sections/CNCKanban";
import { Produkcja } from "./components/sections/Produkcja";
import { MagazynComplete } from "./components/sections/MagazynComplete";
import { Ustawienia } from "./components/sections/Ustawienia";
import { ConstructorContainer } from "./components/ui-kit";

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setShowProjectDetail(false);
  };

  const renderContent = () => {
    if (showProjectDetail) {
      return <PojjedynczyProjektComplete projectId={selectedProjectId} onBack={() => setShowProjectDetail(false)} />;
    }

    switch (activeSection) {
      case "dashboard":
        return <Dashboard onProjectClick={() => setShowProjectDetail(true)} />;
      case "projekty":
        return <Projekty onProjectClick={(id?: string) => { setSelectedProjectId(id); setShowProjectDetail(true); }} />;
      case "klienci":
        return <Klienci />;
      case "projektowy":
        return <DzialProjektowy />;
      case "cnc":
        return <CNCKanban />;
      case "produkcja":
        return <Produkcja />;
      case "magazyn":
        return <MagazynComplete />;
      case "ustawienia":
        return <Ustawienia />;
      default:
        return <Dashboard onProjectClick={() => setShowProjectDetail(true)} />;
    }
  };

  return (
    <SidebarProvider>
      <TileStatusProvider>
        <div className="flex h-screen bg-background overflow-hidden">
          <MainSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <HeaderBar activeSection={activeSection} onSectionChange={handleSectionChange} />

            <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background scrollbar-hide">
              <ConstructorContainer size="full" padding="none" className="min-h-full">
                {renderContent()}
              </ConstructorContainer>
            </main>
          </div>
        </div>
        <Toaster />
      </TileStatusProvider>
    </SidebarProvider>
  );
}