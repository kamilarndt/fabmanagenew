# 🚀 Implementation Plan - FabManage-Clean Route-by-Route Audit

## 📋 Phase 1: Critical Forms Implementation (Priority: HIGH)

### 1.1 Add Client Form (Drawer Pattern)

**Location**: `src/components/forms/AddClientDrawer.tsx`

```typescript
// Zod Schema
const clientSchema = z.object({
  name: z.string().min(1, "Nazwa klienta jest wymagana"),
  email: z.string().email("Nieprawidłowy adres email").optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
});

// Component Structure
interface AddClientDrawerProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (client: Client) => void;
}

// Features:
- Right-side drawer (UI/UX Guidelines compliance)
- Zod validation with error display
- Loading states during submission
- Success feedback with auto-close
- Integration with existing createClient() service
```

### 1.2 Modernized Add Project Form

**Location**: `src/components/forms/AddProjectDrawer.tsx`

```typescript
// Zod Schema
const projectSchema = z.object({
  name: z.string().min(1, "Nazwa projektu jest wymagana"),
  clientId: z.string().min(1, "Klient jest wymagany"),
  deadline: z.string().min(1, "Termin jest wymagany"),
  budget: z.number().positive().optional(),
  modules: z.array(z.string()).min(1, "Wybierz co najmniej jeden moduł"),
  description: z.string().optional(),
});

// Features:
- Convert from Bootstrap to Drawer pattern
- Enhanced validation with Zod
- Module selection with checkboxes
- Client selection with search
- Integration with createProject() service
```

### 1.3 Form Components Library

**Location**: `src/components/ui/forms/`

```typescript
// FormField.tsx - Wrapper with validation
// FormDrawer.tsx - Standard drawer container
// FormSubmit.tsx - Submit button with loading states
// ValidationMessage.tsx - Error display component
```

---

## 📋 Phase 2: Missing Route Components (Priority: HIGH)

### 2.1 Projects List Component

**Location**: `src/new-ui/pages/ModernProjects.tsx`

**Replace placeholder with**:

- Project cards with status badges
- Advanced filtering (status, client, priority, date range)
- Search functionality
- Pagination for large datasets
- Quick actions (edit, duplicate, archive)

**Components needed**:

```typescript
// src/new-ui/components/projects/
-ProjectCard.tsx -
  ProjectFilters.tsx -
  ProjectSearch.tsx -
  ProjectStats.tsx -
  ProjectActions.tsx;
```

### 2.2 CNC Queue Management

**Location**: `src/new-ui/pages/CNCQueue.tsx` (new file)

**Features**:

- Queue visualization (pending, in-progress, completed)
- Machine status indicators
- Task assignment interface
- Production timeline/Gantt chart
- Drag-and-drop task reordering

**Components needed**:

```typescript
// src/new-ui/components/cnc/
-CNCQueue.tsx -
  MachineStatus.tsx -
  TaskCard.tsx -
  ProductionTimeline.tsx -
  TaskAssignment.tsx;
```

### 2.3 Production Kanban Board

**Location**: `src/new-ui/pages/ProductionBoard.tsx` (new file)

**Features**:

- Kanban columns (To Do, In Progress, Testing, Done)
- Task cards with progress indicators
- Resource allocation display
- Production charts/analytics
- Team assignment interface

**Components needed**:

```typescript
// src/new-ui/components/production/
-ProductionKanban.tsx -
  TaskCard.tsx -
  ProgressChart.tsx -
  ResourceAllocation.tsx -
  TeamAssignment.tsx;
```

### 2.4 Tile Management System

**Location**: `src/new-ui/pages/TileManagement.tsx` (new file)

**Features**:

- Tile kanban board
- Tile editor with CAD integration
- Material assignment per tile
- Production scheduling
- Quality control workflow

**Components needed**:

```typescript
// src/new-ui/components/tiles/
-TileKanban.tsx -
  TileEditor.tsx -
  MaterialAssignment.tsx -
  ProductionScheduler.tsx -
  QualityControl.tsx;
```

---

## 📋 Phase 3: Enhanced Services & Validation (Priority: MEDIUM)

### 3.1 Enhanced Client Service

**Location**: `src/services/clients.ts`

```typescript
// Add comprehensive validation
export const clientValidationSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

// Enhanced createClient with validation
export async function createClient(data: unknown): Promise<Client> {
  const validatedData = clientValidationSchema.parse(data);
  return api.post<Client>("/api/clients", validatedData);
}

// Add other CRUD operations
export async function updateClient(
  id: string,
  data: Partial<Client>
): Promise<Client>;
export async function deleteClient(id: string): Promise<void>;
export async function getClient(id: string): Promise<Client>;
```

### 3.2 Enhanced Project Service

**Location**: `src/services/projects.ts`

```typescript
// Add comprehensive validation
export const projectValidationSchema = z.object({
  name: z.string().min(1, "Nazwa projektu jest wymagana"),
  clientId: z.string().min(1, "Klient jest wymagany"),
  deadline: z.string().min(1, "Termin jest wymagany"),
  budget: z.number().positive().optional(),
  modules: z.array(z.string()).min(1, "Wybierz moduły"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

// Enhanced createProject with validation
export async function createProject(data: unknown): Promise<Project> {
  const validatedData = projectValidationSchema.parse(data);
  // ... existing implementation
}
```

---

## 📋 Phase 4: Testing Implementation (Priority: MEDIUM)

### 4.1 E2E Test Setup

**Location**: `tests/e2e/`

```typescript
// tests/e2e/add-client.spec.ts
describe("Add Client Flow", () => {
  test("should create new client successfully", async () => {
    // Navigate to clients page
    // Click "Add Client" button
    // Fill form with valid data
    // Submit form
    // Verify success message
    // Verify client appears in list
  });

  test("should show validation errors", async () => {
    // Try to submit empty form
    // Verify validation messages
  });
});

// tests/e2e/add-project.spec.ts
describe("Add Project Flow", () => {
  test("should create new project successfully", async () => {
    // Navigate to projects page
    // Click "Add Project" button
    // Fill form with valid data
    // Submit form
    // Verify success message
    // Verify project appears in list
  });
});
```

### 4.2 Unit Tests for Components

**Location**: `src/components/forms/__tests__/`

```typescript
// AddClientDrawer.test.tsx
// AddProjectDrawer.test.tsx
// FormField.test.tsx
// ValidationMessage.test.tsx
```

---

## 📋 Phase 5: Design System Completion (Priority: LOW)

### 5.1 Form Components

**Location**: `src/components/ui/forms/`

```typescript
// FormField.tsx - Standardized form field wrapper
// FormDrawer.tsx - Consistent drawer container
// FormSubmit.tsx - Submit button with loading states
// ValidationMessage.tsx - Error display component
// FormSection.tsx - Grouped form sections
```

### 5.2 Layout Components

**Location**: `src/components/ui/layout/`

```typescript
// Drawer.tsx - Standardized drawer component
// Modal.tsx - Enhanced modal component
// Card.tsx - Consistent card component
// PageHeader.tsx - Standard page header
```

---

## 🎯 Implementation Timeline

### Week 1: Critical Forms

- **Day 1-2**: Add Client Drawer form
- **Day 3-4**: Modernized Add Project form
- **Day 5**: Form validation and error handling

### Week 2: Missing Components

- **Day 1-2**: Projects List component
- **Day 3-4**: CNC Queue management
- **Day 5**: Production Kanban board

### Week 3: Advanced Features

- **Day 1-2**: Tile Management system
- **Day 3-4**: Enhanced services with validation
- **Day 5**: Testing implementation

### Week 4: Polish & Testing

- **Day 1-2**: E2E test setup
- **Day 3-4**: Design system completion
- **Day 5**: Performance optimization

---

## 🔧 Technical Requirements

### Dependencies to Add

```json
{
  "zod": "^3.22.0",
  "@playwright/test": "^1.40.0",
  "react-hook-form": "^7.48.0",
  "@hookform/resolvers": "^3.3.0"
}
```

### File Structure

```
src/
├── components/
│   ├── forms/
│   │   ├── AddClientDrawer.tsx
│   │   ├── AddProjectDrawer.tsx
│   │   └── __tests__/
│   └── ui/
│       ├── forms/
│       └── layout/
├── new-ui/
│   ├── pages/
│   │   ├── CNCQueue.tsx
│   │   ├── ProductionBoard.tsx
│   │   └── TileManagement.tsx
│   └── components/
│       ├── projects/
│       ├── cnc/
│       ├── production/
│       └── tiles/
├── services/
│   ├── clients.ts (enhanced)
│   └── projects.ts (enhanced)
└── schemas/
    ├── client.schema.ts
    └── project.schema.ts
```

---

## 📊 Success Metrics

### Form Completion

- **Add Client**: >95% success rate
- **Add Project**: >90% success rate
- **Form Validation**: <5% validation errors

### Performance

- **Page Load**: <2s for all routes
- **Form Submission**: <1s response time
- **Bundle Size**: <10% increase

### Testing

- **E2E Coverage**: 100% critical user flows
- **Unit Tests**: >80% component coverage
- **Integration Tests**: All service endpoints

---

_This implementation plan addresses the critical gaps identified in the route-by-route audit and provides a clear path to production readiness._
