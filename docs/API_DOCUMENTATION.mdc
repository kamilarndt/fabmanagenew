# FabManage API Documentation

## Table of Contents

1. [Overview](#overview)
2. [UI Kit Components](#ui-kit-components)
3. [Application Components](#application-components)
4. [Utility Functions](#utility-functions)
5. [Backend APIs](#backend-apis)
6. [State Management](#state-management)
7. [Data Models](#data-models)
8. [Usage Examples](#usage-examples)

## Overview

FabManage is a comprehensive production management system for a decoration factory, built with React 18, TypeScript, and Supabase. This documentation covers all public APIs, functions, and components available in the system.

### Technology Stack
- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand with persistence
- **Styling**: Tailwind CSS + Custom UI Kit
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Deployment**: Docker

---

## UI Kit Components

### ConstructorCard

A flexible card component with multiple variants and sizes.

#### Props
```typescript
interface ConstructorCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  selected?: boolean;
}
```

#### Usage Examples

```tsx
// Basic card
<ConstructorCard variant="default" size="md">
  <p>Card content</p>
</ConstructorCard>

// Elevated card with hover effect
<ConstructorCard variant="elevated" size="lg" hover={true}>
  <h3>Project Overview</h3>
  <p>Project details here</p>
</ConstructorCard>

// Clickable card
<ConstructorCard 
  variant="outlined" 
  onClick={() => handleCardClick()}
  selected={isSelected}
>
  <p>Clickable content</p>
</ConstructorCard>
```

### ProjectTileCard

Specialized card for displaying project tiles with priority and status indicators.

#### Props
```typescript
interface ProjectTileCardProps {
  children: React.ReactNode;
  priority: string; // 'Wysoki' | 'Średni' | 'Niski'
  status: string;   // 'W KOLEJCE' | 'W TRAKCIE CIĘCIA' | 'WYCIĘTE' | 'Zakończony'
  onClick?: () => void;
  className?: string;
}
```

#### Usage Example

```tsx
<ProjectTileCard 
  priority="Wysoki" 
  status="W KOLEJCE"
  onClick={() => handleTileClick(tile.id)}
>
  <div className="space-y-3">
    <h4 className="font-medium">{tile.name}</h4>
    <p className="text-sm text-gray-600">{tile.description}</p>
    <div className="flex justify-between items-center">
      <span className="text-xs">{tile.assignedTo}</span>
      <span className="text-xs">{tile.estimatedTime}</span>
    </div>
  </div>
</ProjectTileCard>
```

### DashboardCard

Card component designed for dashboard displays with title, subtitle, and icon.

#### Props
```typescript
interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
```

#### Usage Example

```tsx
<DashboardCard 
  title="Active Projects" 
  subtitle="Currently in production"
  icon={<FolderOpen className="w-6 h-6" />}
>
  <div className="text-3xl font-bold text-blue-600">12</div>
  <p className="text-sm text-gray-600">+2 from last week</p>
</DashboardCard>
```

### ConstructorBadge

Flexible badge component with multiple variants and sizes.

#### Props
```typescript
interface ConstructorBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}
```

#### Usage Examples

```tsx
// Basic badge
<ConstructorBadge variant="default" size="md">
  Default Badge
</ConstructorBadge>

// Success badge with icon
<ConstructorBadge variant="success" size="sm" icon={<CheckIcon />}>
  Completed
</ConstructorBadge>

// Warning badge
<ConstructorBadge variant="warning" size="lg">
  In Progress
</ConstructorBadge>
```

### StatusBadge

Specialized badge for displaying tile and project statuses.

#### Props
```typescript
interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

#### Supported Statuses
- `'W KOLEJCE'` - Blue info badge
- `'W TRAKCIE CIĘCIA'` - Orange warning badge
- `'WYCIĘTE'` - Green success badge
- `'Zakończony'` - Green success badge
- `'Planowanie'` - Gray default badge
- `'W trakcie'` - Orange warning badge
- `'Konserwacja'` - Red error badge
- `'Oczekiwanie'` - Gray outline badge

#### Usage Example

```tsx
<StatusBadge status="W KOLEJCE" size="md" />
<StatusBadge status="W TRAKCIE CIĘCIA" size="sm" />
<StatusBadge status="WYCIĘTE" size="lg" />
```

### PriorityBadge

Specialized badge for displaying priority levels.

#### Props
```typescript
interface PriorityBadgeProps {
  priority: string; // 'Wysoki' | 'Średni' | 'Niski'
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

#### Usage Example

```tsx
<PriorityBadge priority="Wysoki" size="md" />
<PriorityBadge priority="Średni" size="sm" />
<PriorityBadge priority="Niski" size="lg" />
```

### ConstructorButton

Flexible button component with multiple variants, sizes, and states.

#### Props
```typescript
interface ConstructorButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}
```

#### Usage Examples

```tsx
// Primary button
<ConstructorButton variant="primary" onClick={handleClick}>
  Save Changes
</ConstructorButton>

// Button with icon
<ConstructorButton 
  variant="success" 
  icon={<PlusIcon />} 
  iconPosition="left"
  onClick={handleAdd}
>
  Add New Item
</ConstructorButton>

// Loading button
<ConstructorButton 
  variant="primary" 
  loading={true}
  disabled={true}
>
  Processing...
</ConstructorButton>

// Full width button
<ConstructorButton variant="outline" fullWidth={true}>
  Cancel
</ConstructorButton>
```

### ActionButton

Specialized button for common actions with built-in icons.

#### Props
```typescript
interface ActionButtonProps {
  children: React.ReactNode;
  action: 'add' | 'edit' | 'delete' | 'save' | 'cancel';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}
```

#### Usage Example

```tsx
<ActionButton action="add" onClick={handleAddProject}>
  Add Project
</ActionButton>

<ActionButton action="edit" size="sm" onClick={handleEdit}>
  Edit
</ActionButton>

<ActionButton action="delete" variant="danger" onClick={handleDelete}>
  Delete
</ActionButton>
```

### IconButton

Button component designed for icon-only interactions.

#### Props
```typescript
interface IconButtonProps {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}
```

#### Usage Example

```tsx
<IconButton 
  icon={<SettingsIcon />} 
  variant="ghost" 
  size="md"
  onClick={handleSettings}
  title="Settings"
/>
```

### FloatingActionButton

Fixed position floating action button.

#### Props
```typescript
interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
}
```

#### Usage Example

```tsx
<FloatingActionButton 
  icon={<PlusIcon />}
  onClick={handleAddNew}
  title="Add new item"
/>
```

### Layout Components

#### ConstructorContainer

Container component with consistent max-widths and padding.

#### Props
```typescript
interface ConstructorContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
```

#### Usage Example

```tsx
<ConstructorContainer size="lg" padding="md">
  <h1>Page Content</h1>
  <p>Your content here</p>
</ConstructorContainer>
```

#### ConstructorSection

Section component with title, subtitle, and consistent spacing.

#### Props
```typescript
interface ConstructorSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}
```

#### Usage Example

```tsx
<ConstructorSection 
  title="Project Overview" 
  subtitle="Manage your projects"
  spacing="lg"
>
  <ProjectList projects={projects} />
</ConstructorSection>
```

#### ConstructorGrid

Responsive grid layout component.

#### Props
```typescript
interface ConstructorGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
```

#### Usage Example

```tsx
<ConstructorGrid cols={4} gap="md">
  {projects.map(project => (
    <ProjectCard key={project.id} project={project} />
  ))}
</ConstructorGrid>
```

#### ConstructorFlex

Flexbox layout component with consistent spacing.

#### Props
```typescript
interface ConstructorFlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: 'wrap' | 'wrap-reverse' | 'nowrap';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
```

#### Usage Example

```tsx
<ConstructorFlex 
  direction="row" 
  justify="between" 
  align="center"
  gap="md"
>
  <div>Left content</div>
  <div>Right content</div>
</ConstructorFlex>
```

#### ConstructorStack

Vertical stack layout for consistent spacing.

#### Props
```typescript
interface ConstructorStackProps {
  children: React.ReactNode;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
```

#### Usage Example

```tsx
<ConstructorStack spacing="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</ConstructorStack>
```

---

## Application Components

### App

Main application component that manages routing and global state.

#### Props
None (root component)

#### State
```typescript
interface AppState {
  activeSection: string;
  showProjectDetail: boolean;
  selectedProjectId: string | null;
  backendStatus: 'testing' | 'connected' | 'error';
}
```

#### Usage Example

```tsx
import App from './App';

// In your main.tsx or index.tsx
ReactDOM.render(<App />, document.getElementById('root'));
```

### CreateProjectModal

Modal component for creating new projects.

#### Props
```typescript
interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreate: (projectData: any) => void;
}
```

#### Usage Example

```tsx
const [modalOpen, setModalOpen] = useState(false);

<CreateProjectModal
  open={modalOpen}
  onOpenChange={setModalOpen}
  onProjectCreate={(projectData) => {
    console.log('New project:', projectData);
    setModalOpen(false);
  }}
/>
```

### EditProjectModal

Modal component for editing existing projects.

#### Props
```typescript
interface EditProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectData;
  onProjectUpdate: (projectData: any) => void;
}
```

#### Usage Example

```tsx
<EditProjectModal
  open={editModalOpen}
  onOpenChange={setEditModalOpen}
  project={selectedProject}
  onProjectUpdate={(updatedProject) => {
    console.log('Updated project:', updatedProject);
    setEditModalOpen(false);
  }}
/>
```

### TileStatusSync

Context provider for managing tile status synchronization across the application.

#### Props
```typescript
interface TileStatusProviderProps {
  children: React.ReactNode;
}
```

#### Context Value
```typescript
interface TileStatusContextType {
  tiles: TileData[];
  updateTileStatus: (tileId: string, newStatus: string, source: string) => Promise<void>;
  getTilesByStatus: (status: string) => TileData[];
  getTilesByProject: (projectId: string) => TileData[];
  addTile: (tile: TileData) => Promise<void>;
  updateTile: (tileId: string, updates: Partial<TileData>) => Promise<void>;
  loading: boolean;
  error: string | null;
  fetchTiles: () => Promise<void>;
  refreshData: () => Promise<void>;
}
```

#### Usage Example

```tsx
import { TileStatusProvider } from './components/TileStatusSync';

function App() {
  return (
    <TileStatusProvider>
      <div className="app">
        {/* Your app content */}
      </div>
    </TileStatusProvider>
  );
}

// Using the context in components
import { useContext } from 'react';
import { TileStatusContext } from './components/TileStatusSync';

function MyComponent() {
  const { tiles, updateTileStatus, loading } = useContext(TileStatusContext);
  
  const handleStatusChange = async (tileId: string, newStatus: string) => {
    await updateTileStatus(tileId, newStatus, 'component');
  };
  
  return (
    <div>
      {tiles.map(tile => (
        <div key={tile.id}>
          {tile.name} - {tile.status}
          <button onClick={() => handleStatusChange(tile.id, 'WYCIĘTE')}>
            Mark Complete
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Section Components

#### Dashboard

Main dashboard component displaying KPIs and project overview.

#### Props
```typescript
interface DashboardProps {
  onProjectClick?: (projectId?: string) => void;
}
```

#### Usage Example

```tsx
<Dashboard onProjectClick={(projectId) => {
  console.log('Project clicked:', projectId);
  // Navigate to project detail
}} />
```

#### Projekty

Projects list component with filtering and search capabilities.

#### Props
```typescript
interface ProjektyProps {
  onProjectClick?: (projectId?: string) => void;
}
```

#### Usage Example

```tsx
<Projekty onProjectClick={(projectId) => {
  setSelectedProjectId(projectId);
  setShowProjectDetail(true);
}} />
```

#### ProjektDetail

Detailed project view component.

#### Props
```typescript
interface ProjektDetailProps {
  projectId: string | null;
  onBack: () => void;
}
```

#### Usage Example

```tsx
<ProjektDetail 
  projectId={selectedProjectId}
  onBack={() => {
    setShowProjectDetail(false);
    setSelectedProjectId(null);
  }}
/>
```

#### CNCKanban

CNC production kanban board component.

#### Props
None

#### Usage Example

```tsx
<CNCKanban />
```

#### Produkcja

Production management component.

#### Props
None

#### Usage Example

```tsx
<Produkcja />
```

#### MagazynComplete

Complete warehouse management component.

#### Props
None

#### Usage Example

```tsx
<MagazynComplete />
```

---

## Utility Functions

### Toast Functions

Toast notification utilities using Sonner.

#### Functions

```typescript
// Success toast
showSuccessToast(message: string): void

// Error toast
showErrorToast(message: string): void

// Info toast
showInfoToast(message: string): void

// Loading toast (returns dismiss function)
showLoadingToast(message: string): (() => void)
```

#### Usage Examples

```tsx
import { 
  showSuccessToast, 
  showErrorToast, 
  showInfoToast, 
  showLoadingToast 
} from './utils/toast';

// Success notification
showSuccessToast('Project saved successfully!');

// Error notification
showErrorToast('Failed to save project');

// Info notification
showInfoToast('Processing your request...');

// Loading notification
const dismiss = showLoadingToast('Saving project...');
// Later...
dismiss();
```

### Supabase Client Functions

Backend connection testing utility.

#### Functions

```typescript
// Test backend connection
testBackendConnection(): Promise<boolean>
```

#### Usage Example

```tsx
import { testBackendConnection } from './utils/supabase/client';

const checkConnection = async () => {
  try {
    const isConnected = await testBackendConnection();
    if (isConnected) {
      console.log('Backend connected successfully');
    } else {
      console.log('Backend connection failed');
    }
  } catch (error) {
    console.error('Connection error:', error);
  }
};
```

---

## Backend APIs

### Server Endpoints

The backend provides RESTful APIs for managing projects, tiles, and materials.

#### Base URL
```
https://your-supabase-project.supabase.co/functions/v1/make-server-2095e8d8
```

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "version": "2.0",
  "endpoints": [
    "/tiles",
    "/projects", 
    "/tiles/:id/status",
    "/materials"
  ]
}
```

#### Tiles Management

##### Get All Tiles
```http
GET /tiles
```

**Response:**
```json
{
  "tiles": [
    {
      "id": "tile-1",
      "name": "Rama konstrukcyjna główna",
      "status": "W KOLEJCE",
      "project": "P-2025-001",
      "priority": "Wysoki",
      "assignedTo": "Marek Kowalczyk",
      "estimatedTime": "4h",
      "materials": ["Stal S355", "Blacha 8mm"],
      "dxfFile": "tile-1.dxf",
      "assemblyDrawing": "tile-1-assembly.pdf"
    }
  ]
}
```

##### Save Tiles
```http
POST /tiles
Content-Type: application/json

{
  "tiles": [
    {
      "id": "tile-1",
      "name": "Rama konstrukcyjna główna",
      "status": "W KOLEJCE",
      "project": "P-2025-001"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "tiles": [...]
}
```

##### Update Tile
```http
PUT /tiles/:id
Content-Type: application/json

{
  "status": "W TRAKCIE CIĘCIA",
  "assignedTo": "Jan Kowalski",
  "startTime": "2025-01-15T08:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "tile": {
    "id": "tile-1",
    "status": "W TRAKCIE CIĘCIA",
    "assignedTo": "Jan Kowalski",
    "startTime": "2025-01-15T08:00:00Z"
  }
}
```

##### Update Tile Status
```http
POST /tiles/:id/status
Content-Type: application/json

{
  "status": "WYCIĘTE",
  "source": "cnc-kanban"
}
```

**Response:**
```json
{
  "success": true,
  "tile": {
    "id": "tile-1",
    "status": "WYCIĘTE",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

#### Projects Management

##### Get All Projects
```http
GET /projects
```

**Response:**
```json
{
  "projects": [
    {
      "id": "P-2025-001",
      "name": "Automatyzacja Linii Spawalniczej Robot ABB",
      "client": "Stalprodukt S.A.",
      "manager": "Marek Kowalczyk",
      "status": "W realizacji",
      "priority": "Krytyczny",
      "startDate": "2024-11-15",
      "endDate": "2025-03-20",
      "budget": 750000,
      "spent": 485000,
      "progress": 68
    }
  ]
}
```

##### Create Project
```http
POST /projects
Content-Type: application/json

{
  "name": "New Project",
  "client": "Client Name",
  "manager": "Manager Name",
  "budget": 100000,
  "startDate": "2025-01-15",
  "endDate": "2025-06-15"
}
```

##### Update Project
```http
PUT /projects/:id
Content-Type: application/json

{
  "status": "W realizacji",
  "progress": 75
}
```

#### Materials Management

##### Get Materials
```http
GET /materials
```

**Response:**
```json
{
  "materials": [
    {
      "id": "mat-1",
      "name": "Stal S355",
      "type": "Blacha",
      "thickness": "8mm",
      "quantity": 100,
      "unit": "m²",
      "supplier": "Stalprodukt S.A.",
      "price": 45.50
    }
  ]
}
```

##### Add Material
```http
POST /materials
Content-Type: application/json

{
  "name": "Stal S355",
  "type": "Blacha",
  "thickness": "8mm",
  "quantity": 100,
  "unit": "m²",
  "supplier": "Stalprodukt S.A.",
  "price": 45.50
}
```

### Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## State Management

### TileStatusProvider

The main state management solution for tile synchronization across the application.

#### Context Methods

```typescript
// Update tile status
updateTileStatus(tileId: string, newStatus: string, source: string): Promise<void>

// Get tiles by status
getTilesByStatus(status: string): TileData[]

// Get tiles by project
getTilesByProject(projectId: string): TileData[]

// Add new tile
addTile(tile: TileData): Promise<void>

// Update tile data
updateTile(tileId: string, updates: Partial<TileData>): Promise<void>

// Fetch tiles from backend
fetchTiles(): Promise<void>

// Refresh all data
refreshData(): Promise<void>
```

#### Usage Example

```tsx
import { useContext } from 'react';
import { TileStatusContext } from './components/TileStatusSync';

function CNCKanban() {
  const { 
    tiles, 
    updateTileStatus, 
    getTilesByStatus, 
    loading, 
    error 
  } = useContext(TileStatusContext);

  const queuedTiles = getTilesByStatus('W KOLEJCE');
  const inProgressTiles = getTilesByStatus('W TRAKCIE CIĘCIA');
  const completedTiles = getTilesByStatus('WYCIĘTE');

  const handleStatusChange = async (tileId: string, newStatus: string) => {
    try {
      await updateTileStatus(tileId, newStatus, 'cnc-kanban');
    } catch (error) {
      console.error('Failed to update tile status:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="kanban-board">
      <div className="column">
        <h3>W kolejce ({queuedTiles.length})</h3>
        {queuedTiles.map(tile => (
          <TileCard 
            key={tile.id} 
            tile={tile}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
      {/* More columns... */}
    </div>
  );
}
```

---

## Data Models

### TileData

```typescript
interface TileData {
  id: string;
  name: string;
  status: string;
  project?: string;
  zone?: string;
  assignedTo?: string;
  priority?: string;
  estimatedTime?: string;
  progress?: number;
  materials?: string[];
  dxfFile?: string | null;
  assemblyDrawing?: string | null;
  notes?: string;
  machine?: string;
  startTime?: string;
  completedTime?: string;
  actualTime?: string;
  projectName?: string;
}
```

### ProjectData

```typescript
interface ProjectData {
  id: string;
  name: string;
  client: string;
  manager: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  team: string[];
  stage: string;
  overdue: boolean;
}
```

### MaterialData

```typescript
interface MaterialData {
  id: string;
  name: string;
  type: string;
  thickness?: string;
  quantity: number;
  unit: string;
  supplier: string;
  price: number;
  minStock?: number;
  currentStock?: number;
}
```

---

## Usage Examples

### Complete Project Management Flow

```tsx
import React, { useState, useContext } from 'react';
import { TileStatusContext } from './components/TileStatusSync';
import { CreateProjectModal } from './components/CreateProjectModal';
import { ProjectTileCard } from './components/ui-kit';
import { showSuccessToast, showErrorToast } from './utils/toast';

function ProjectManagement() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { tiles, addTile, updateTile } = useContext(TileStatusContext);

  const handleCreateProject = async (projectData) => {
    try {
      // Create project tiles
      const newTiles = generateProjectTiles(projectData);
      
      for (const tile of newTiles) {
        await addTile(tile);
      }
      
      showSuccessToast('Project created successfully!');
      setCreateModalOpen(false);
    } catch (error) {
      showErrorToast('Failed to create project');
      console.error(error);
    }
  };

  const generateProjectTiles = (project) => {
    const tileTemplates = [
      "Rama konstrukcyjna główna",
      "Panel sterowania",
      "System mocowań",
      "Elementy bezpieczeństwa"
    ];

    return tileTemplates.map((template, index) => ({
      id: `${project.id}-tile-${index + 1}`,
      name: template,
      status: "W KOLEJCE",
      project: project.id,
      priority: project.priority,
      assignedTo: project.manager,
      estimatedTime: "4h",
      materials: ["Stal S355", "Blacha 8mm"],
      progress: 0
    }));
  };

  return (
    <div className="project-management">
      <div className="header">
        <h1>Project Management</h1>
        <button onClick={() => setCreateModalOpen(true)}>
          Create New Project
        </button>
      </div>

      <div className="projects-grid">
        {tiles.map(tile => (
          <ProjectTileCard
            key={tile.id}
            priority={tile.priority}
            status={tile.status}
            onClick={() => handleTileClick(tile.id)}
          >
            <div className="tile-content">
              <h4>{tile.name}</h4>
              <p>Project: {tile.project}</p>
              <p>Assigned: {tile.assignedTo}</p>
              <p>Time: {tile.estimatedTime}</p>
            </div>
          </ProjectTileCard>
        ))}
      </div>

      <CreateProjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onProjectCreate={handleCreateProject}
      />
    </div>
  );
}
```

### CNC Kanban Board Implementation

```tsx
import React, { useContext } from 'react';
import { TileStatusContext } from './components/TileStatusSync';
import { ConstructorCard, StatusBadge, ConstructorButton } from './components/ui-kit';
import { showSuccessToast } from './utils/toast';

function CNCKanbanBoard() {
  const { tiles, updateTileStatus, getTilesByStatus } = useContext(TileStatusContext);

  const columns = [
    { id: 'queue', title: 'W kolejce', status: 'W KOLEJCE' },
    { id: 'production', title: 'W produkcji', status: 'W TRAKCIE CIĘCIA' },
    { id: 'completed', title: 'Gotowe', status: 'WYCIĘTE' }
  ];

  const handleStatusChange = async (tileId: string, newStatus: string) => {
    try {
      await updateTileStatus(tileId, newStatus, 'cnc-kanban');
      showSuccessToast('Status updated successfully');
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="cnc-kanban">
      <h1>CNC Production Board</h1>
      
      <div className="kanban-columns">
        {columns.map(column => {
          const columnTiles = getTilesByStatus(column.status);
          
          return (
            <div key={column.id} className="kanban-column">
              <div className="column-header">
                <h3>{column.title}</h3>
                <span className="tile-count">{columnTiles.length}</span>
              </div>
              
              <div className="tile-list">
                {columnTiles.map(tile => (
                  <ConstructorCard
                    key={tile.id}
                    variant="elevated"
                    className="tile-card"
                  >
                    <div className="tile-header">
                      <h4>{tile.name}</h4>
                      <StatusBadge status={tile.status} size="sm" />
                    </div>
                    
                    <div className="tile-details">
                      <p><strong>Project:</strong> {tile.project}</p>
                      <p><strong>Assigned:</strong> {tile.assignedTo}</p>
                      <p><strong>Time:</strong> {tile.estimatedTime}</p>
                    </div>
                    
                    <div className="tile-actions">
                      {column.status === 'W KOLEJCE' && (
                        <ConstructorButton
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusChange(tile.id, 'W TRAKCIE CIĘCIA')}
                        >
                          Start Production
                        </ConstructorButton>
                      )}
                      
                      {column.status === 'W TRAKCIE CIĘCIA' && (
                        <ConstructorButton
                          variant="success"
                          size="sm"
                          onClick={() => handleStatusChange(tile.id, 'WYCIĘTE')}
                        >
                          Mark Complete
                        </ConstructorButton>
                      )}
                    </div>
                  </ConstructorCard>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Dashboard Implementation

```tsx
import React from 'react';
import { DashboardCard, ConstructorGrid, ConstructorSection } from './components/ui-kit';
import { FolderOpen, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

function Dashboard() {
  const kpiData = [
    {
      title: 'Active Projects',
      value: '12',
      subtitle: 'Currently in production',
      icon: <FolderOpen className="w-6 h-6" />,
      trend: '+2 from last week'
    },
    {
      title: 'Overdue Tasks',
      value: '3',
      subtitle: 'Requires attention',
      icon: <AlertTriangle className="w-6 h-6" />,
      trend: '-1 from yesterday'
    },
    {
      title: 'Production Time',
      value: '4.2h',
      subtitle: 'Average per tile',
      icon: <Clock className="w-6 h-6" />,
      trend: '+0.3h from last week'
    },
    {
      title: 'Efficiency',
      value: '87%',
      subtitle: 'Production efficiency',
      icon: <TrendingUp className="w-6 h-6" />,
      trend: '+2% from last month'
    }
  ];

  return (
    <div className="dashboard">
      <ConstructorSection 
        title="Production Overview" 
        subtitle="Real-time production metrics"
        spacing="lg"
      >
        <ConstructorGrid cols={4} gap="lg">
          {kpiData.map((kpi, index) => (
            <DashboardCard
              key={index}
              title={kpi.title}
              subtitle={kpi.subtitle}
              icon={kpi.icon}
            >
              <div className="kpi-content">
                <div className="kpi-value">{kpi.value}</div>
                <div className="kpi-trend">{kpi.trend}</div>
              </div>
            </DashboardCard>
          ))}
        </ConstructorGrid>
      </ConstructorSection>
    </div>
  );
}
```

---

## Best Practices

### Component Usage

1. **Always use TypeScript interfaces** for component props
2. **Provide default values** for optional props
3. **Use semantic HTML elements** where appropriate
4. **Implement proper error boundaries** for critical components
5. **Use consistent naming conventions** across the codebase

### State Management

1. **Use the TileStatusProvider** for all tile-related state
2. **Implement proper loading states** for async operations
3. **Handle errors gracefully** with user-friendly messages
4. **Use optimistic updates** for better UX
5. **Cache data appropriately** to reduce API calls

### API Integration

1. **Always handle API errors** with proper error messages
2. **Use consistent error handling patterns** across the app
3. **Implement retry logic** for failed requests
4. **Use proper HTTP status codes** in responses
5. **Validate data** before sending to APIs

### Performance

1. **Use React.memo** for expensive components
2. **Implement proper key props** for list items
3. **Use lazy loading** for large components
4. **Optimize bundle size** by tree-shaking unused imports
5. **Use proper caching strategies** for API responses

---

## Troubleshooting

### Common Issues

1. **Tile status not updating**: Check if the TileStatusProvider is wrapping your component
2. **API connection errors**: Verify Supabase configuration in environment variables
3. **Component not rendering**: Check for missing required props
4. **State not persisting**: Ensure Zustand persistence is properly configured

### Debug Tools

1. **React DevTools** for component debugging
2. **Network tab** for API request debugging
3. **Console logs** for state management debugging
4. **Supabase dashboard** for database debugging

---

This documentation covers all public APIs, functions, and components in the FabManage system. For additional support or questions, please refer to the project README or contact the development team.