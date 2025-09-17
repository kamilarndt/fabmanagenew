# FabTimeline - Architektura Systemu

## 🏗️ Przegląd Architektury

FabTimeline jest zbudowany w oparciu o architekturę modularną z wyraźnym podziałem na warstwy, co zapewnia skalowalność, łatwość utrzymania i testowania.

## 🎯 Zasady Architektoniczne

### 1. **Separation of Concerns**
- Każda warstwa ma określoną odpowiedzialność
- Minimalne zależności między warstwami
- Interface-based communication

### 2. **Performance First**
- Lazy loading i code splitting
- Virtual scrolling dla dużych zbiorów
- Canvas-based rendering dla animacji

### 3. **Developer Experience**
- TypeScript dla type safety
- Comprehensive testing
- Excellent documentation
- Hot reload w development

### 4. **Accessibility by Design**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode

## 🏛️ Architektura Warstwowa

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                      │
├─────────────────────────────────────────────────────────────┤
│  React Components  │  Canvas Renderer  │  Touch Handlers   │
├─────────────────────────────────────────────────────────────┤
│                    BUSINESS LOGIC LAYER                     │
├─────────────────────────────────────────────────────────────┤
│  Timeline Engine   │  Collaboration   │  Export Engine     │
├─────────────────────────────────────────────────────────────┤
│                      DATA LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  State Management  │  API Client      │  Cache Manager     │
├─────────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE LAYER                     │
├─────────────────────────────────────────────────────────────┤
│  WebSocket Client  │  File Storage    │  CDN Integration   │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Warstwa Prezentacji (Presentation Layer)

### React Component Architecture

```typescript
// Główny komponent Timeline
interface TimelineProps {
  data: TimelineData[];
  config: TimelineConfig;
  onEventChange?: (event: TimelineEvent) => void;
  onTimeRangeChange?: (range: TimeRange) => void;
}

export const Timeline: React.FC<TimelineProps> = memo(({
  data,
  config,
  onEventChange,
  onTimeRangeChange
}) => {
  // Hooks dla zarządzania stanem
  const timelineState = useTimelineState(data, config);
  const interactionHandlers = useTimelineInteractions(timelineState);
  const renderer = useTimelineRenderer(timelineState);
  
  return (
    <TimelineContainer>
      <TimelineHeader />
      <TimelineCanvas 
        renderer={renderer}
        interactions={interactionHandlers}
      />
      <TimelineControls />
    </TimelineContainer>
  );
});
```

### Komponenty UI

#### **TimelineContainer**
- Główny wrapper komponentu
- Zarządza layoutem i responsywnością
- Obsługuje keyboard shortcuts

#### **TimelineCanvas**
- Canvas-based renderer dla wydajności
- Obsługuje zoom, pan, selection
- Integracja z touch handlers

#### **TimelineHeader**
- Time axis i labels
- Zoom controls
- Time range indicators

#### **TimelineControls**
- Toolbar z akcjami
- View mode switcher
- Export options

### Canvas Renderer

```typescript
class TimelineCanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private viewport: Viewport;
  private elements: TimelineElement[];
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.viewport = new Viewport();
  }
  
  render(elements: TimelineElement[], viewport: Viewport) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render background
    this.renderBackground();
    
    // Render time axis
    this.renderTimeAxis();
    
    // Render elements (with culling)
    this.renderElements(elements, viewport);
    
    // Render selection
    this.renderSelection();
  }
  
  private renderElements(elements: TimelineElement[], viewport: Viewport) {
    const visibleElements = this.cullElements(elements, viewport);
    
    visibleElements.forEach(element => {
      this.renderElement(element);
    });
  }
  
  private cullElements(elements: TimelineElement[], viewport: Viewport): TimelineElement[] {
    // Spatial culling for performance
    return elements.filter(element => 
      this.isElementVisible(element, viewport)
    );
  }
}
```

### Touch & Gesture Handlers

```typescript
class TouchGestureHandler {
  private element: HTMLElement;
  private callbacks: GestureCallbacks;
  
  constructor(element: HTMLElement, callbacks: GestureCallbacks) {
    this.element = element;
    this.callbacks = callbacks;
    this.setupEventListeners();
  }
  
  private setupEventListeners() {
    // Touch events
    this.element.addEventListener('touchstart', this.handleTouchStart);
    this.element.addEventListener('touchmove', this.handleTouchMove);
    this.element.addEventListener('touchend', this.handleTouchEnd);
    
    // Mouse events (for desktop)
    this.element.addEventListener('mousedown', this.handleMouseDown);
    this.element.addEventListener('mousemove', this.handleMouseMove);
    this.element.addEventListener('mouseup', this.handleMouseUp);
    
    // Wheel events (for zoom)
    this.element.addEventListener('wheel', this.handleWheel);
  }
  
  private handlePinchZoom(touches: Touch[]) {
    if (touches.length === 2) {
      const distance = this.calculateDistance(touches[0], touches[1]);
      const scale = distance / this.lastDistance;
      
      this.callbacks.onZoom(scale, this.getCenterPoint(touches));
    }
  }
}
```

## ⚙️ Warstwa Logiki Biznesowej (Business Logic Layer)

### Timeline Engine

```typescript
class TimelineEngine {
  private state: TimelineState;
  private renderer: TimelineRenderer;
  private collaboration: CollaborationManager;
  
  constructor(config: TimelineConfig) {
    this.state = new TimelineState(config);
    this.renderer = new TimelineRenderer();
    this.collaboration = new CollaborationManager();
  }
  
  // Główne operacje timeline
  addEvent(event: TimelineEvent): void {
    this.state.addEvent(event);
    this.collaboration.broadcastEvent('add', event);
    this.renderer.scheduleRender();
  }
  
  updateEvent(eventId: string, updates: Partial<TimelineEvent>): void {
    this.state.updateEvent(eventId, updates);
    this.collaboration.broadcastEvent('update', { eventId, updates });
    this.renderer.scheduleRender();
  }
  
  deleteEvent(eventId: string): void {
    this.state.deleteEvent(eventId);
    this.collaboration.broadcastEvent('delete', { eventId });
    this.renderer.scheduleRender();
  }
  
  // Zoom i pan operations
  zoomTo(scale: number, center?: Point): void {
    this.state.zoomTo(scale, center);
    this.renderer.scheduleRender();
  }
  
  panTo(offset: Point): void {
    this.state.panTo(offset);
    this.renderer.scheduleRender();
  }
}
```

### State Management (Zustand)

```typescript
interface TimelineStore {
  // State
  events: TimelineEvent[];
  viewport: Viewport;
  selection: SelectionState;
  ui: UIState;
  
  // Actions
  addEvent: (event: TimelineEvent) => void;
  updateEvent: (id: string, updates: Partial<TimelineEvent>) => void;
  deleteEvent: (id: string) => void;
  selectEvent: (id: string) => void;
  clearSelection: () => void;
  zoomTo: (scale: number, center?: Point) => void;
  panTo: (offset: Point) => void;
  setViewMode: (mode: ViewMode) => void;
}

export const useTimelineStore = create<TimelineStore>((set, get) => ({
  // Initial state
  events: [],
  viewport: new Viewport(),
  selection: { selectedIds: [], focusedId: null },
  ui: { viewMode: 'horizontal', theme: 'light' },
  
  // Actions
  addEvent: (event) => set((state) => ({
    events: [...state.events, event]
  })),
  
  updateEvent: (id, updates) => set((state) => ({
    events: state.events.map(event => 
      event.id === id ? { ...event, ...updates } : event
    )
  })),
  
  deleteEvent: (id) => set((state) => ({
    events: state.events.filter(event => event.id !== id)
  })),
  
  selectEvent: (id) => set((state) => ({
    selection: { ...state.selection, selectedIds: [id], focusedId: id }
  })),
  
  clearSelection: () => set((state) => ({
    selection: { selectedIds: [], focusedId: null }
  })),
  
  zoomTo: (scale, center) => set((state) => ({
    viewport: state.viewport.zoomTo(scale, center)
  })),
  
  panTo: (offset) => set((state) => ({
    viewport: state.viewport.panTo(offset)
  })),
  
  setViewMode: (mode) => set((state) => ({
    ui: { ...state.ui, viewMode: mode }
  }))
}));
```

### Virtual Scrolling Engine

```typescript
class VirtualScrollingEngine {
  private containerHeight: number;
  private itemHeight: number;
  private scrollTop: number;
  private visibleRange: { start: number; end: number };
  
  constructor(containerHeight: number, itemHeight: number) {
    this.containerHeight = containerHeight;
    this.itemHeight = itemHeight;
    this.scrollTop = 0;
    this.visibleRange = { start: 0, end: 0 };
  }
  
  updateScrollPosition(scrollTop: number) {
    this.scrollTop = scrollTop;
    this.calculateVisibleRange();
  }
  
  private calculateVisibleRange() {
    const start = Math.floor(this.scrollTop / this.itemHeight);
    const end = Math.min(
      start + Math.ceil(this.containerHeight / this.itemHeight) + 1,
      this.totalItems
    );
    
    this.visibleRange = { start, end };
  }
  
  getVisibleItems<T>(items: T[]): T[] {
    return items.slice(this.visibleRange.start, this.visibleRange.end);
  }
  
  getScrollOffset(): number {
    return this.visibleRange.start * this.itemHeight;
  }
}
```

### Collaboration Manager

```typescript
class CollaborationManager {
  private socket: Socket;
  private roomId: string;
  private userId: string;
  private operationalTransform: OperationalTransform;
  
  constructor(roomId: string, userId: string) {
    this.roomId = roomId;
    this.userId = userId;
    this.socket = io('/timeline-collaboration');
    this.operationalTransform = new OperationalTransform();
    
    this.setupEventListeners();
  }
  
  private setupEventListeners() {
    this.socket.on('event_added', (data) => {
      this.handleRemoteEvent('add', data);
    });
    
    this.socket.on('event_updated', (data) => {
      this.handleRemoteEvent('update', data);
    });
    
    this.socket.on('event_deleted', (data) => {
      this.handleRemoteEvent('delete', data);
    });
    
    this.socket.on('user_cursor', (data) => {
      this.handleUserCursor(data);
    });
  }
  
  broadcastEvent(type: string, data: any) {
    this.socket.emit('timeline_event', {
      type,
      data,
      userId: this.userId,
      roomId: this.roomId,
      timestamp: Date.now()
    });
  }
  
  private handleRemoteEvent(type: string, data: any) {
    // Apply operational transform to resolve conflicts
    const transformedData = this.operationalTransform.transform(data);
    
    // Apply to local state
    this.applyEventToState(type, transformedData);
  }
}
```

## 💾 Warstwa Danych (Data Layer)

### API Client

```typescript
class TimelineAPIClient {
  private baseURL: string;
  private httpClient: AxiosInstance;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.httpClient = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  // Timeline operations
  async getTimeline(timelineId: string): Promise<TimelineData> {
    const response = await this.httpClient.get(`/timelines/${timelineId}`);
    return response.data;
  }
  
  async getEvents(timelineId: string, filters?: EventFilters): Promise<TimelineEvent[]> {
    const response = await this.httpClient.get(`/timelines/${timelineId}/events`, {
      params: filters
    });
    return response.data;
  }
  
  async createEvent(timelineId: string, event: CreateEventRequest): Promise<TimelineEvent> {
    const response = await this.httpClient.post(`/timelines/${timelineId}/events`, event);
    return response.data;
  }
  
  async updateEvent(timelineId: string, eventId: string, updates: UpdateEventRequest): Promise<TimelineEvent> {
    const response = await this.httpClient.patch(`/timelines/${timelineId}/events/${eventId}`, updates);
    return response.data;
  }
  
  async deleteEvent(timelineId: string, eventId: string): Promise<void> {
    await this.httpClient.delete(`/timelines/${timelineId}/events/${eventId}`);
  }
  
  // Export operations
  async exportTimeline(timelineId: string, format: ExportFormat): Promise<Blob> {
    const response = await this.httpClient.get(`/timelines/${timelineId}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }
}
```

### Cache Manager

```typescript
class TimelineCacheManager {
  private cache: Map<string, CachedData>;
  private maxSize: number;
  private ttl: number;
  
  constructor(maxSize: number = 1000, ttl: number = 300000) { // 5 minutes TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }
  
  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }
  
  set<T>(key: string, data: T): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  invalidate(pattern: string): void {
    const regex = new RegExp(pattern);
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}
```

## 🔧 Warstwa Infrastruktury (Infrastructure Layer)

### WebSocket Client

```typescript
class TimelineWebSocketClient {
  private socket: Socket;
  private roomId: string;
  private userId: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  
  constructor(roomId: string, userId: string) {
    this.roomId = roomId;
    this.userId = userId;
    this.socket = io('/timeline', {
      auth: { userId, roomId },
      transports: ['websocket', 'polling']
    });
    
    this.setupEventListeners();
  }
  
  private setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to timeline room');
      this.reconnectAttempts = 0;
    });
    
    this.socket.on('disconnect', () => {
      console.log('Disconnected from timeline room');
      this.handleReconnect();
    });
    
    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }
  
  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      
      setTimeout(() => {
        this.socket.connect();
      }, delay);
    }
  }
  
  joinRoom(roomId: string) {
    this.socket.emit('join_room', { roomId, userId: this.userId });
  }
  
  leaveRoom(roomId: string) {
    this.socket.emit('leave_room', { roomId, userId: this.userId });
  }
  
  broadcastEvent(type: string, data: any) {
    this.socket.emit('timeline_event', {
      type,
      data,
      userId: this.userId,
      roomId: this.roomId,
      timestamp: Date.now()
    });
  }
}
```

### File Storage Integration

```typescript
class TimelineFileStorage {
  private storage: SupabaseStorageClient;
  private bucketName: string = 'timeline-assets';
  
  constructor(storage: SupabaseStorageClient) {
    this.storage = storage;
  }
  
  async uploadMedia(file: File, timelineId: string): Promise<string> {
    const fileName = `${timelineId}/${Date.now()}-${file.name}`;
    
    const { data, error } = await this.storage
      .from(this.bucketName)
      .upload(fileName, file);
    
    if (error) throw error;
    
    return data.path;
  }
  
  async getMediaUrl(path: string): Promise<string> {
    const { data } = this.storage
      .from(this.bucketName)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
  
  async deleteMedia(path: string): Promise<void> {
    const { error } = await this.storage
      .from(this.bucketName)
      .remove([path]);
    
    if (error) throw error;
  }
}
```

## 🧪 Testing Strategy

### Unit Tests
- **Components**: React Testing Library
- **Business Logic**: Jest + TypeScript
- **Utilities**: Jest + Coverage reports

### Integration Tests
- **API Integration**: Supertest + Jest
- **WebSocket**: Socket.io testing
- **Canvas Rendering**: jsdom + Canvas mock

### E2E Tests
- **User Flows**: Playwright
- **Performance**: Lighthouse CI
- **Accessibility**: axe-core

### Test Structure
```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── integration/
├── __mocks__/
└── test-utils/
```

## 📦 Bundle Optimization

### Code Splitting
```typescript
// Lazy load heavy components
const TimelineCanvas = lazy(() => import('./TimelineCanvas'));
const ExportDialog = lazy(() => import('./ExportDialog'));
const CollaborationPanel = lazy(() => import('./CollaborationPanel'));

// Dynamic imports for features
const loadExportFeature = () => import('./features/export');
const loadCollaborationFeature = () => import('./features/collaboration');
```

### Tree Shaking
- ES modules for all dependencies
- Side-effect free imports
- Barrel exports optimization

### Bundle Analysis
- Webpack Bundle Analyzer
- Bundle size monitoring
- Performance budgets

## 🔄 Performance Optimization

### Rendering Optimizations
- **Virtual Scrolling**: Only render visible elements
- **Canvas Culling**: Skip off-screen elements
- **RequestAnimationFrame**: Smooth animations
- **Debounced Updates**: Batch state changes

### Memory Management
- **WeakMap**: For element references
- **Object Pooling**: Reuse objects
- **Cleanup**: Remove event listeners
- **Garbage Collection**: Monitor memory usage

### Network Optimizations
- **Lazy Loading**: Load data on demand
- **Caching**: Aggressive caching strategy
- **Compression**: Gzip/Brotli compression
- **CDN**: Static asset delivery

---

**Architecture Version**: 1.0  
**Last Updated**: Styczeń 2025  
**Next Review**: Luty 2025
