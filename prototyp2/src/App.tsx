import { useState, useEffect } from "react";
import { SidebarProvider } from "./components/ui/sidebar";
import { TileStatusProvider } from "./components/TileStatusSync";
import { Toaster } from "./components/ui/sonner";
import { MainSidebar } from "./components/MainSidebar";
import { HeaderBar } from "./components/HeaderBar";
import { Dashboard } from "./components/sections/Dashboard";
import { Projekty } from "./components/sections/Projekty";
import { ProjektDetail } from "./components/sections/ProjektDetail";
import { Klienci } from "./components/sections/Klienci";
import { DzialProjektowy } from "./components/sections/DzialProjektowy";
import { CNCKanban } from "./components/sections/CNCKanban";
import { Produkcja } from "./components/sections/Produkcja";
import { MagazynComplete } from "./components/sections/MagazynComplete";
import { Ustawienia } from "./components/sections/Ustawienia";
import { testBackendConnection } from "./utils/supabase/client";
import { showSuccessToast, showErrorToast } from "./utils/toast";

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'testing' | 'connected' | 'error'>('testing');

  // Test backend connection on app start
  useEffect(() => {
    const testConnection = async () => {
      try {
        const isConnected = await testBackendConnection();
        if (isConnected) {
          setBackendStatus('connected');
          showSuccessToast('Backend połączony pomyślnie!');
        } else {
          setBackendStatus('error');
          showErrorToast('Błąd połączenia z backend. Sprawdź console.');
        }
      } catch (error) {
        setBackendStatus('error');
        showErrorToast('Błąd połączenia z backend. Sprawdź console.');
      }
    };

    testConnection();
  }, []);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setShowProjectDetail(false);
    setSelectedProjectId(null);
  };

  const handleProjectClick = (projectId?: string) => {
    setSelectedProjectId(projectId || null);
    setShowProjectDetail(true);
  };

  const renderContent = () => {
    if (showProjectDetail) {
      return <ProjektDetail 
        projectId={selectedProjectId} 
        onBack={() => {
          setShowProjectDetail(false);
          setSelectedProjectId(null);
        }} 
      />;
    }

    switch (activeSection) {
      case "dashboard":
        return <Dashboard onProjectClick={handleProjectClick} />;
      case "projekty":
        return <Projekty onProjectClick={handleProjectClick} />;
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
        return <Dashboard onProjectClick={handleProjectClick} />;
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
              <div className="p-3 sm:p-4 lg:p-6 min-h-full">
                <div className="w-full min-w-0">
                  <div className="w-full">
                    {renderContent()}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <Toaster />
      </TileStatusProvider>
    </SidebarProvider>
  );
}