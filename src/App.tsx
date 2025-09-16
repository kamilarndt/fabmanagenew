import { Suspense, lazy, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { PageLoading } from "./components/ui/LoadingSpinner";
import { useInitializeRealData } from "./hooks/useInitializeRealData";
import useOfflineDetection from "./hooks/useOfflineDetection";
import { connectionMonitor } from "./lib/connectionMonitor";
import { useProjectsStore } from "./stores/projectsStore";

// Layouts
import BrandedLayout from "./layouts/BrandedLayout";

// Pages with Bootstrap layout
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const Projekt = lazy(() => import("./pages/Projekt"));
const AddProject = lazy(() => import("./pages/AddProject"));
const Projektowanie = lazy(() => import("./pages/Projektowanie"));
const CNC = lazy(() => import("./pages/CNC"));
const Produkcja = lazy(() => import("./pages/Produkcja"));
const Magazyn = lazy(() => import("./pages/MagazynUmms"));
const MagazynDashboard = lazy(() => import("./pages/MagazynDashboard"));
const Demands = lazy(() => import("./pages/Demands"));
const Tiles = lazy(() => import("./pages/Tiles"));
const DesignerDashboard = lazy(() => import("./pages/DesignerDashboard"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const CalendarProjects = lazy(() => import("./pages/CalendarProjects"));
const CalendarDesigners = lazy(() => import("./pages/CalendarDesigners"));
const CalendarTeams = lazy(() => import("./pages/CalendarTeams"));
const Subcontractors = lazy(() => import("./pages/Subcontractors"));
const Settings = lazy(() => import("./pages/Settings"));

// Special export pages removed

// Pages with Figma layout (prototypes)
const Klienci = lazy(() => import("./pages/Klienci"));
const Klient = lazy(() => import("./pages/ClientDetails"));

import "./App.css";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  // Monitor offline state globally
  useOfflineDetection();

  // Initialize all data stores with realistic production data
  useInitializeRealData();

  // Initialize connection monitor on app start (deterministic, no dynamic imports)
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.warn("🔌 Initializing connection monitor...");
        await connectionMonitor.forceCheck();
        await useProjectsStore.getState().initialize();
      } finally {
        setIsInitialized(true);
      }
    };
    initializeApp();
  }, []);

  if (!isInitialized) return <PageLoading />;

  return (
    <ErrorBoundary
      level="global"
      onError={(error, errorInfo) => {
        console.error("Global error:", error, errorInfo);
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            {/* Routes with Branded Layout */}
            <Route path="/" element={<BrandedLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/new" element={<AddProject />} />
              <Route path="projekty" element={<Projects />} />
              <Route path="projekty/nowy" element={<AddProject />} />
              <Route path="project/:id" element={<Projekt />} />
              <Route path="projekt/:id" element={<Projekt />} />
              <Route path="projektowanie" element={<Projektowanie />} />
              <Route path="cnc" element={<CNC />} />
              <Route path="produkcja" element={<Produkcja />} />
              <Route path="magazyn">
                <Route index element={<MagazynDashboard />} />
                <Route path="lista" element={<Magazyn />} />
              </Route>
              <Route path="kafelki" element={<Tiles />} />
              <Route path="tiles" element={<Tiles />} />
              <Route path="designer" element={<DesignerDashboard />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="calendar/projects" element={<CalendarProjects />} />
              <Route
                path="calendar/designers"
                element={<CalendarDesigners />}
              />
              <Route path="calendar/teams" element={<CalendarTeams />} />
              <Route path="subcontractors" element={<Subcontractors />} />
              <Route path="demands" element={<Demands />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Special routes removed */}

            {/* Clients under main layout for consistent navigation */}
            <Route path="/klienci" element={<BrandedLayout />}>
              <Route index element={<Klienci />} />
              <Route path=":id" element={<Klient />} />
            </Route>
            {/* Removed KlienciFigma route (file missing) */}
          </Routes>
        </Suspense>
      </DndProvider>
    </ErrorBoundary>
  );
}

export default App;
