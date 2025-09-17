# TimelineX - Architektura Systemu

## Status wdrożenia (wrzesień 2025)

- Zrealizowane moduły: Presentation (React) – `Timeline`, `TimelineCanvas`, `TimelineControls`; Data Layer – `timelineStore` (Zustand) + hooki; Rendering Layer – Canvas renderer (zoom/pan, hover/selection); Integration – integracja z `/calendar`.
- W toku: Business Logic (pozycjonowanie Y/stacking, event delegations), Rendering (layout vertical/gantt), Interactions (drag/resize, context menu), Accessibility.

## Architektura Ogólna

```
┌─────────────────────────────────────────────────────────────┐
│                    TimelineX Architecture                   │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer (React Components)                     │
│  ├── Timeline Container                                     │
│  ├── Timeline Canvas                                        │
│  ├── Timeline Controls                                      │
│  ├── Timeline Items                                         │
│  └── Timeline Groups                                        │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer (Core Engine)                        │
│  ├── Timeline Manager                                       │
│  ├── Event Handler                                          │
│  ├── Data Processor                                         │
│  ├── Animation Controller                                   │
│  └── Collaboration Manager                                  │
├─────────────────────────────────────────────────────────────┤
│  Rendering Layer (Canvas/SVG/WebGL)                        │
│  ├── Canvas Renderer                                        │
│  ├── SVG Renderer                                           │
│  ├── WebGL Renderer                                         │
│  └── Virtual Scrolling                                      │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (State Management)                             │
│  ├── Timeline Store (Zustand)                              │
│  ├── Data Adapter                                           │
│  ├── Cache Manager                                          │
│  └── Sync Manager                                           │
├─────────────────────────────────────────────────────────────┤
│  Integration Layer (APIs & Services)                       │
│  ├── REST API Client                                        │
│  ├── WebSocket Client                                       │
│  ├── Export Services                                        │
│  └── Media Services                                         │
└─────────────────────────────────────────────────────────────┘
```

## Komponenty Główne

### 1. Presentation Layer (React Components)

#### Timeline Container

```typescript
interface TimelineContainerProps {
  data: TimelineItem[];
  options: TimelineOptions;
  onItemClick?: (item: TimelineItem) => void;
  onItemEdit?: (item: TimelineItem) => void;
  theme?: TimelineTheme;
}
```

#### Timeline Canvas

```typescript
interface TimelineCanvasProps {
  viewport: ViewportState;
  renderMode: "canvas" | "svg" | "webgl";
  items: TimelineItem[];
  onViewportChange: (viewport: ViewportState) => void;
}
```

### 2. Business Logic Layer

#### Timeline Manager

```typescript
class TimelineManager {
  private store: TimelineStore;
  private renderer: TimelineRenderer;
  private eventHandler: EventHandler;

  public zoom(factor: number): void;
  public pan(deltaX: number, deltaY: number): void;
  public addItem(item: TimelineItem): void;
  public updateItem(id: string, updates: Partial<TimelineItem>): void;
  public deleteItem(id: string): void;
}
```

#### Event Handler

```typescript
class EventHandler {
  public onMouseMove(event: MouseEvent): void;
  public onMouseDown(event: MouseEvent): void;
  public onMouseUp(event: MouseEvent): void;
  public onWheel(event: WheelEvent): void;
  public onTouchStart(event: TouchEvent): void;
  public onTouchMove(event: TouchEvent): void;
  public onTouchEnd(event: TouchEvent): void;
}
```

### 3. Rendering Layer

#### Canvas Renderer

```typescript
class CanvasRenderer {
  private context: CanvasRenderingContext2D;
  private virtualScrolling: VirtualScrolling;

  public render(items: TimelineItem[], viewport: ViewportState): void;
  public renderItem(item: TimelineItem, context: RenderContext): void;
  public getItemAt(x: number, y: number): TimelineItem | null;
}
```

#### Virtual Scrolling

```typescript
class VirtualScrolling {
  private viewport: ViewportState;
  private itemCache: Map<string, RenderedItem>;

  public getVisibleItems(items: TimelineItem[]): TimelineItem[];
  public invalidateCache(): void;
  public updateViewport(viewport: ViewportState): void;
}
```

### 4. Data Layer (State Management)

#### Timeline Store (Zustand)

```typescript
interface TimelineStore {
  // Data
  items: TimelineItem[];
  groups: TimelineGroup[];
  viewport: ViewportState;

  // UI State
  zoom: number;
  selection: string[];
  editing: EditingState;

  // Actions
  addItem: (item: TimelineItem) => void;
  updateItem: (id: string, updates: Partial<TimelineItem>) => void;
  deleteItem: (id: string) => void;
  setViewport: (viewport: ViewportState) => void;
  setZoom: (zoom: number) => void;
  setSelection: (selection: string[]) => void;
}
```

#### Data Models

```typescript
interface TimelineItem {
  id: string;
  title: string;
  startDate: Date;
  endDate?: Date;
  type: "event" | "milestone" | "range";
  group?: string;
  data?: any;
  style?: ItemStyle;
}

interface TimelineGroup {
  id: string;
  title: string;
  items: string[];
  collapsed?: boolean;
  style?: GroupStyle;
}

interface ViewportState {
  startDate: Date;
  endDate: Date;
  zoom: number;
  offsetX: number;
  offsetY: number;
}
```

### 5. Integration Layer

#### WebSocket Client

```typescript
class WebSocketClient {
  private socket: WebSocket;
  private reconnectInterval: number;

  public connect(url: string): Promise<void>;
  public disconnect(): void;
  public send(message: any): void;
  public onMessage(callback: (message: any) => void): void;
}
```

#### Export Services

```typescript
class ExportService {
  public toPDF(timeline: TimelineData): Promise<Blob>;
  public toSVG(timeline: TimelineData): string;
  public toPNG(timeline: TimelineData): Promise<Blob>;
  public toPowerPoint(timeline: TimelineData): Promise<Blob>;
  public toExcel(timeline: TimelineData): Promise<Blob>;
}
```

## Technologie i Biblioteki

### Core Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management

### Rendering

- **Canvas 2D API** - High performance rendering
- **SVG** - Scalable vector graphics
- **WebGL** - Advanced graphics (optional)

### Utilities

- **date-fns** - Date manipulation
- **lodash** - Utility functions
- **d3-scale** - Scaling functions

### Testing

- **Vitest** - Unit testing
- **Testing Library** - Component testing
- **Playwright** - E2E testing

### Development

- **Storybook** - Component documentation
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Performance Optimizations

### 1. Virtual Scrolling

- Renderowanie tylko widocznych elementów
- Lazy loading elementów poza viewportem
- Efficient cache management

### 2. Canvas Optimizations

- Off-screen canvas for complex elements
- Requestanimationframe dla smooth animations
- Dirty rectangle rendering

### 3. Memory Management

- Object pooling dla często używanych objektów
- Efficient garbage collection
- Memory leak prevention

### 4. Data Processing

- Indexowanie dla szybkiego wyszukiwania
- Spatial indexing dla hit testing
- Efficient data structures

## Security Considerations

### 1. Input Validation

- Sanitization HTML content
- Validation timeline data
- XSS protection

### 2. WebSocket Security

- Authentication tokens
- Message validation
- Rate limiting

### 3. Export Security

- Safe file generation
- Content validation
- Size limits

## Deployment Architecture

### 1. Package Structure

```
timelinex/
├── src/
│   ├── components/
│   ├── core/
│   ├── rendering/
│   ├── data/
│   └── integration/
├── dist/
├── docs/
└── examples/
```

### 2. Build Outputs

- **ES Modules** - Modern bundlers
- **CommonJS** - Node.js compatibility
- **UMD** - Browser compatibility
- **TypeScript Definitions** - Type support

### 3. Distribution

- **NPM Package** - Primary distribution
- **CDN** - Browser usage
- **GitHub Releases** - Source code
- **Documentation Site** - Hosted docs
