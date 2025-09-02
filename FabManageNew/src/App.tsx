import { Routes, Route, Link } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Suspense, lazy } from 'react'
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Projects = lazy(() => import('./pages/Projects'))
const Projekt = lazy(() => import('./pages/Projekt'))
const AddProject = lazy(() => import('./pages/AddProject'))
const Klienci = lazy(() => import('./pages/Klienci'))
const Projektowanie = lazy(() => import('./pages/Projektowanie'))
const CNC = lazy(() => import('./pages/CNC'))
const Produkcja = lazy(() => import('./pages/Produkcja'))
const MagazynNew = lazy(() => import('./pages/MagazynNew'))
import './App.css'

function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="d-flex vh-100">
                <a href="#main-content" className="visually-hidden-focusable position-absolute top-0 start-0 m-2 btn btn-primary btn-sm">Pomiń do treści</a>
                {/* Simple Sidebar */}
                <div className="bg-white border-end" style={{ width: '280px' }}>
                    <div className="p-3">
                        <h5 className="mb-4">FabrykaManage</h5>
                        <nav className="nav flex-column" aria-label="Główna nawigacja">
                            <Link to="/" className="nav-link">Dashboard</Link>
                            <Link to="/projekty" className="nav-link">Projekty</Link>
                            <Link to="/klienci" className="nav-link">Klienci</Link>
                            <Link to="/projektowanie" className="nav-link">Projektowanie</Link>
                            <Link to="/cnc" className="nav-link">CNC</Link>
                            <Link to="/produkcja" className="nav-link">Produkcja</Link>
                            <Link to="/magazyn" className="nav-link">Magazyn</Link>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-grow-1">
                    <header className="bg-white border-bottom px-4 py-3" role="banner">
                        <h4>FabrykaManage</h4>
                    </header>
                    <main id="main-content" className="p-4" role="main">
                        <Suspense fallback={<div>Ładowanie...</div>}>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/projekty" element={<Projects />} />
                                <Route path="/projekty/nowy" element={<AddProject />} />
                                <Route path="/projekt/:id" element={<Projekt />} />
                                <Route path="/klienci" element={<Klienci />} />
                                <Route path="/projektowanie" element={<Projektowanie />} />
                                <Route path="/cnc" element={<CNC />} />
                                <Route path="/produkcja" element={<Produkcja />} />
                                <Route path="/magazyn" element={<MagazynNew />} />
                            </Routes>
                        </Suspense>
                    </main>
                </div>
            </div>
        </DndProvider>
    )
}

export default App
