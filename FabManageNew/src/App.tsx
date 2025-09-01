import { Routes, Route } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Projekt from './pages/Projekt'
import Klienci from './pages/Klienci'
import Projektowanie from './pages/Projektowanie'
import CNC from './pages/CNC'
import Produkcja from './pages/Produkcja'
import Magazyn from './pages/Magazyn'
import './App.css'

function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="d-flex vh-100">
                {/* Simple Sidebar */}
                <div className="bg-white border-end" style={{ width: '280px' }}>
                    <div className="p-3">
                        <h5 className="mb-4">FabrykaManage</h5>
                        <nav className="nav flex-column">
                            <a href="/" className="nav-link">Dashboard</a>
                            <a href="/projekty" className="nav-link">Projekty</a>
                            <a href="/klienci" className="nav-link">Klienci</a>
                            <a href="/projektowanie" className="nav-link">Projektowanie</a>
                            <a href="/cnc" className="nav-link">CNC</a>
                            <a href="/produkcja" className="nav-link">Produkcja</a>
                            <a href="/magazyn" className="nav-link">Magazyn</a>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-grow-1">
                    <header className="bg-white border-bottom px-4 py-3">
                        <h4>FabrykaManage</h4>
                    </header>
                    <main className="p-4">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/projekty" element={<Projects />} />
                            <Route path="/projekt/:id" element={<Projekt />} />
                            <Route path="/klienci" element={<Klienci />} />
                            <Route path="/projektowanie" element={<Projektowanie />} />
                            <Route path="/cnc" element={<CNC />} />
                            <Route path="/produkcja" element={<Produkcja />} />
                            <Route path="/magazyn" element={<Magazyn />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </DndProvider>
    )
}

export default App
