import { Routes, Route } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Suspense, lazy } from 'react'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import { PageLoading } from './components/Ui/LoadingSpinner'
import useOfflineDetection from './hooks/useOfflineDetection'

// Layouts
import BootstrapLayout from './layouts/BootstrapLayout'

// Pages with Bootstrap layout
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Projects = lazy(() => import('./pages/Projects'))
const Projekt = lazy(() => import('./pages/Projekt'))
const AddProject = lazy(() => import('./pages/AddProject'))
const Projektowanie = lazy(() => import('./pages/Projektowanie'))
const CNC = lazy(() => import('./pages/CNC'))
const Produkcja = lazy(() => import('./pages/Produkcja'))
const Magazyn = lazy(() => import('./pages/MagazynNew'))
const Demands = lazy(() => import('./pages/Demands'))
const Tiles = lazy(() => import('./pages/Tiles'))
const DesignerDashboard = lazy(() => import('./pages/DesignerDashboard'))
const CalendarPage = lazy(() => import('./pages/CalendarPage'))
const CalendarProjects = lazy(() => import('./pages/CalendarProjects'))
const CalendarDesigners = lazy(() => import('./pages/CalendarDesigners'))
const CalendarTeams = lazy(() => import('./pages/CalendarTeams'))
const Subcontractors = lazy(() => import('./pages/Subcontractors'))

// Pages with Figma layout (prototypes)
const Klienci = lazy(() => import('./pages/Klienci'))
const Klient = lazy(() => import('./pages/ClientDetails'))

import './App.css'

function App() {
    // Monitor offline state globally
    useOfflineDetection()

    return (
        <ErrorBoundary level="global" onError={(error, errorInfo) => {
            console.error('Global error:', error, errorInfo)
        }}>
            <DndProvider backend={HTML5Backend}>
                <Suspense fallback={<PageLoading />}>
                    <Routes>
                        {/* Routes with Bootstrap Layout */}
                        <Route path="/" element={<BootstrapLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="projekty" element={<Projects />} />
                            <Route path="projekty/nowy" element={<AddProject />} />
                            <Route path="projekt/:id" element={<Projekt />} />
                            <Route path="projektowanie" element={<Projektowanie />} />
                            <Route path="cnc" element={<CNC />} />
                            <Route path="produkcja" element={<Produkcja />} />
                            <Route path="magazyn" element={<Magazyn />} />
                            <Route path="kafelki" element={<Tiles />} />
                            <Route path="designer" element={<DesignerDashboard />} />
                            <Route path="kalendarz" element={<CalendarPage />} />
                            <Route path="kalendarz/projekty" element={<CalendarProjects />} />
                            <Route path="kalendarz/projektanci" element={<CalendarDesigners />} />
                            <Route path="kalendarz/ekipy" element={<CalendarTeams />} />
                            <Route path="podwykonawcy" element={<Subcontractors />} />
                            <Route path="zapotrzebowania" element={<Demands />} />
                        </Route>

                        {/* Clients under main layout for consistent navigation */}
                        <Route path="/klienci" element={<BootstrapLayout />}>
                            <Route index element={<Klienci />} />
                            <Route path=":id" element={<Klient />} />
                        </Route>
                        {/* Removed KlienciFigma route (file missing) */}
                    </Routes>
                </Suspense>
            </DndProvider>
        </ErrorBoundary>
    )
}

export default App
