import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { TileStatusProvider } from './state/TileStatusContext'
import { ProjectsProvider } from './state/ProjectsContext'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ProjectsProvider>
        <TileStatusProvider>
          <DndProvider backend={HTML5Backend}>
            <App />
          </DndProvider>
        </TileStatusProvider>
      </ProjectsProvider>
    </BrowserRouter>
  </StrictMode>,
)
