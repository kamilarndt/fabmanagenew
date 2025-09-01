## Zestaw instrukcji dla Figma Make - Prototyp aplikacji zarządzania projektami Fabryka Dekoracji

## Instrukcja 1: Utworzenie podstawowej struktury i nawigacji

```
Stwórz podstawową strukturę aplikacji zarządzania projektami dla firmy produkcyjnej "Fabryka Dekoracji".

KONTEKST: Aplikacja dla kierowników projektów, zarządu i pracowników produkcji w firmie produkującej dekoracje. Użytkownicy potrzebują centralnego miejsca do zarządzania projektami od oferty po montaż.

ZADANIE: Stwórz główny layout aplikacji z nawigacją i podstawową strukturą wszystkich zakładek.

LAYOUT GŁÓWNY:
- Top navigation bar: logo "Fabryka Dekoracji" (lewy górny róg), główna nawigacja horizontal (Home, Projekty, Klienci, Projektowanie, CNC, Magazyn, Produkcja), search globalny (ikona lupy + input), profil użytkownika (avatar + dropdown)
- Breadcrumb navigation pod top bar
- Main content area (dynamiczna zawartość zakładek)
- Footer z podstawowymi linkami i statusem systemu

KOMPONENTY NAWIGACJI:
- Logo jako link do Home
- 7 navigation tabs z hover states i active state
- Global search z placeholder "Szukaj projektów, klientów..."
- User avatar (40px okrągły) z dropdown menu: Profil, Ustawienia, Wyloguj
- Breadcrumb trail z separatorami ">"

ZACHOWANIA:
- Active tab highlighted z blue underline
- Hover na tabs z subtle background change
- Search otwiera dropdown z recent searches i suggestions
- User dropdown otwiera się na klik
- Responsive: na mobile nawigacja zmienia się w hamburger menu

STYL: 
- Paleta kolorów: Primary #2563eb, Success #10b981, Warning #f59e0b, Danger #ef4444, Neutral #6b7280, Background #f9fafb
- Typography: Inter font family, Navigation 14px weight 500, Logo 18px weight 600
- Top bar wysokość 64px, białe tło z subtle shadow
- Border-radius 8px dla wszystkich elementów interaktywnych
- Transitions 0.2s ease-in-out

RESPONSIVE:
- Desktop: pełna nawigacja jak opisana
- Tablet (768px-1024px): kompaktowa nawigacja, mniejsze spacings
- Mobile (<768px): hamburger menu, bottom navigation dla głównych zakładek
```

## Instrukcja 2: Zakładka Home - Dashboard główny

```
Stwórz stronę główną (Home) dashboardu dla aplikacji zarządzania projektami.

KONTEKST: Landing page dla wszystkich użytkowników po zalogowaniu. Musi dać szybki przegląd najważniejszych informacji i metryk firmy.

LAYOUT HOME:
Hero Section (100% width, 120px height):
- Personalized greeting: "Dzień dobry, [Imię Użytkownika]" + rola + ostatnia aktywność
- 4 KPI cards horizontal: Aktywne projekty (liczba + trend), Przychód miesiąca (PLN + % do celu), Terminowość dostaw (% OTIF), Wykorzystanie produkcji (% capacity)

Main Section (3 kolumny):
Kolumna lewa (40% width):
- Card "Moje zadania": lista 7 najbliższych deadline'ów z checkbox, nazwa zadania, projekt, deadline
- Card "Ostatnie projekty": 5 miniaturek projektów z nazwą, statusem, progress bar

Kolumna środkowa (30% width):
- Chart "Obciążenie produkcji": bar chart na 14 dni
- Chart "Statusy projektów": pie chart z legendą (oferta, produkcja, montaż, zakończone)

Kolumna prawa (30% width):
- Card "Powiadomienia": lista 10 alertów z ikonami, czasem, akcją
- Card "Szybkie akcje": 6 dużych buttonów (Nowy projekt, Nowa oferta, Raport, Kalendarz, Magazyn, Produkcja)

Bottom Section:
- Timeline "Nadchodzące kamienie milowe": horizontal timeline na 15 dni z eventami
- Card "Ostatnia aktywność": scrollable feed ostatnich 15 działań w systemie

KOMPONENTY UI:
- 4x KPI Card: ikona (lewy górny), wartość (duża cyfra), label (pod wartością), trend arrow (prawy górny)
- Task list: checkbox + task name + project badge + deadline with color coding
- Project thumbnails: image placeholder + name + status badge + progress bar
- Charts: interactive z tooltips, responsive
- Notification list: icon + message + timestamp + action button
- Quick action buttons: icon + label, 2x3 grid
- Timeline: horizontal scroll z event markers
- Activity feed: avatar + action description + timestamp

INTERAKCJE:
- KPI cards: hover shadow + scale(1.02), kliknięcie otwiera modal z szczegółami
- Task checkboxes: animowane check, update w real-time
- Project thumbnails: hover border + shadow, kliknięcie przechodzi do projektu
- Charts: hover tooltips, clickable segments
- Notifications: kliknięcie oznacza jako przeczytane i linkuje do źródła
- Quick actions: hover scale + shadow, loading state po kliknięciu
- Timeline events: hover popup z detalami
- Activity feed: infinite scroll

STYL: Consistent z nawigacją, cards z white background + shadow + border-radius 8px, 16px spacing między elementami, charts w brand colors.
```

## Instrukcja 3: Zakładka Projekty - Lista i zarządzanie

```
Stwórz zakładkę Projekty z listą projektów i funkcjami zarządzania.

KONTEKST: Główny widok dla kierowników projektów do przeglądania, filtrowania i zarządzania wszystkimi projektami w firmie.

LAYOUT PROJEKTY:
Header Section (100% width, 80px):
- Filters row: 4 dropdowns horizontal (Status projektu, Manager, Data rozpoczęcia, Klient)
- View toggle buttons: Lista | Kanban | Gantt | Kalendarz (default: Lista active)
- Search input z ikoną (placeholder: "Szukaj projektów...")
- Button "Nowy projekt" (primary blue, right aligned)

KPI Row (100% width, 100px):
- 4 karty horizontal: Łączna wartość projektów (PLN), Średni czas realizacji (dni), Terminowość (% na czas), Marża portfela (% średnia)

Main Content (2 panele):
Left Panel (25% width):
- Advanced Filters (collapsible cards):
  - Zakres wartości: dual slider (0-500k PLN)
  - Etap realizacji: checkboxes (Oferta, Projektowanie, Produkcja, Montaż, Zakończony)
  - Priorytet: radio buttons (Niski, Średni, Wysoki, Krytyczny)
  - Zespół: multi-select dropdown

Right Panel (75% width):
- Projects table z kolumnami:
  - Checkbox (bulk selection)
  - Nazwa projektu (link, sortable)
  - Klient (sortable)
  - Manager (avatar + name)
  - Status (colored badge)
  - Budżet/Wykonanie (progress bar z wartościami)
  - Deadline (date, red flag jeśli overdue)
  - Akcje (3 ikony: edit, copy, archive)
- Pagination na dole
- Bulk actions bar (gdy wybrane projekty): Export, Archive, Assign, Change Status

Bottom Panel (collapsible, 300px height):
- Project details dla wybranego projektu:
  - Left: Team members (avatary + role badges)
  - Center: Timeline kluczowych etapów (horizontal)
  - Right: Recent comments + Documents list

KOMPONENTY UI:
- 4x Filter Dropdown: searchable, multi-select where applicable
- View Toggle: button group z active state
- Search Input: icon + input + clear button
- Primary CTA Button: large, branded
- KPI Cards: consistent z Home
- Advanced Filter Panel: collapsible sections z smooth animations
- Data Table: sortable headers, selectable rows, responsive columns
- Progress Bars: pokazują budget spent vs total
- Status Badges: color-coded (green/yellow/red/gray)
- Action Icons: hover states z tooltips
- Pagination: previous/next + page numbers
- Bulk Actions Bar: slides down when items selected
- Project Detail Panel: tabs lub sections

INTERAKCJE:
- Filters: real-time filtering bez page reload
- Search: debounced search z suggestions dropdown
- Table sorting: visual indicators, loading states
- Row selection: checkbox animations, bulk counter
- Progress bars: hover pokazuje exact values
- Status badges: hover tooltip z description
- Action icons: hover tooltips, confirmation dialogs dla destructive actions
- Pagination: smooth transitions
- Detail panel: slide up/down animations, lazy loading content

STYL: Table z zebra striping, hover row highlighting, sticky header podczas scroll, consistent spacing 16px, akcje zawsze visible on row hover.
```

## Instrukcja 4: Zakładka Klienci - CRM interface

```
Stwórz zakładkę Klienci jako CRM interface do zarządzania klientami.

KONTEKST: Zespół sprzedaży i project managerowie potrzebują centralnego miejsca do zarządzania informacjami o klientach, historią współpracy i nowymi leadami.

LAYOUT KLIENCI:
Header Section:
- Search input z placeholder "Szukaj klientów..." (40% width, left)
- 3 filter dropdowns: Segment (Mały/Średni/Duży), Region (wybrane miasta), Status (Aktywny/Nieaktywny/Lead)
- Button "Nowy klient" (primary, right aligned)

KPI Row:
- 4 karty: Aktywni klienci (liczba), Sprzedaż YTD (PLN), Średnia wartość zamówienia (PLN), Customer Lifetime Value (PLN średnia)

Main Layout (2 kolumny):
Left Column (60% width):
- Client cards grid (2 kolumny, scrollable):
  - Card structure: Logo/zdjęcie placeholder (top), Nazwa firmy (h3), Osoba kontaktowa + telefon + email, Ostatni projekt + status badge, Wartość współpracy YTD (highlighted), 3 action icons (call, email, edit)
  - Card spacing: 16px gap między kartami
  - Infinite scroll lub pagination

Right Column (40% width):
- Client Detail Panel (sticky):
  - Header: Logo + Nazwa klienta (editable)
  - Contact Info section (editable fields): Adres, Telefon, Email, NIP, Osoba kontaktowa
  - Project History: mini table (Projekt, Data, Wartość, Status) - last 10 projektów
  - Revenue Chart: line chart wartości zamówień w czasie (12 miesięcy)
  - Notes section: expandable textarea do notatek
  - Documents: file upload area + lista dokumentów/umów
  - Action buttons: Edit, Archive, Merge duplicate

Bottom Section (optional):
- Client Map: mapa z pinami lokalizacji klientów (jeśli geographic relevant)
- Segmentation Chart: scatter plot (wartość vs częstotliwość zamówień)

KOMPONENTY UI:
- Search Input: z autocomplete dropdown
- Filter Dropdowns: multi-select z search
- Client Cards: hover effects, consistent layout, responsive
- Editable Fields: inline editing z save/cancel
- Mini Table: compact, scrollable, sortable
- Line Chart: interactive z data points
- File Upload: drag&drop area + file list
- Action Buttons: różne style (primary/secondary/danger)
- Map Component: interactive pins z info popups
- Scatter Chart: tooltips on hover

INTERAKCJE:
- Search: real-time search z highlighting results
- Filters: instant filtering, pokazuje count results
- Client cards: hover shadow + scale, kliknięcie selectuje i pokazuje details
- Inline editing: kliknięcie w pole activates edit mode, ESC cancels, Enter/click outside saves
- Project history: kliknięcie w projekt linkuje do project details
- Chart interactions: hover tooltips, zoom/pan dla larger datasets
- File upload: progress bars, preview thumbnails
- Notes: auto-save podczas typing (debounced)

VALIDATION & STATES:
- Required fields marking z czerwoną gwiazdką
- Validation errors pod polami
- Loading states dla async operations
- Empty states z call-to-action
- Confirmation dialogs dla destructive actions
- Success notifications po zapisaniu

STYL: Cards z subtle shadow, 12px border-radius, white background. Detail panel z light gray background dla separation. Consistent typography hierarchy, action icons 20px, spacing 16px standard.
```

## Instrukcja 5: Zakładka Projektowanie - Design workflow

```
Stwórz zakładkę Projektowanie do zarządzania procesem projektowym i pracą projektantów.

KONTEKST: Zespół projektantów i managerowie potrzebują narzędzia do śledzenia statusu projektów projektowych, obciążenia zespołu i procesów akceptacji.

LAYOUT PROJEKTOWANIE:
Header Section:
- Status toggle switch: "Aktywne" | "Wszystkie" (left)
- 3 filters: Projektant (dropdown z avatarami), Typ produktu (multi-select), Priorytet (radio buttons)
- Alert badge: "Projekty oczekujące na akceptację" z czerwoną cyfrą

KPI Row (5 kart):
- Projekty w toku (liczba + trend)
- Średni czas projektowania (dni + target comparison)
- First-time approval rate (% bez poprawek)
- Team utilization (% average + individual breakdown na hover)
- Średnia liczba rewizji/projekt (liczba + trend)

Main Layout (3 kolumny):
Left Column (25% width):
- Team List:
  - Designer avatars (60px) + nazwa + status dot (green/yellow/red)
  - Active projects count pod każdym
  - Utilization progress bar (0-100%)
  - Availability indicator: Dostępny/Zajęty/Nieobecny
  - Quick assign button (+)

Center Column (50% width):
- Kanban Board z 5 kolumnami:
  - "Do rozpoczęcia" (gray header)
  - "W trakcie" (blue header)
  - "Do akceptacji" (orange header)  
  - "Zaakceptowane" (green header)
  - "Wymagają poprawek" (red header)
- Project cards (draggable):
  - Project thumbnail/icon
  - Nazwa projektu + numer
  - Assigned designer (avatar)
  - Priority indicator (color strip)
  - Due date + overdue warning
  - Client name (small text)
  - Progress indicator jeśli applicable

Right Column (25% width):
- Project Detail Panel:
  - Project header z nazwą i statusem
  - File preview area: thumbnails ostatnich plików (4-6) z lightbox
  - Version history: lista wersji z datami i komentarzami
  - Client feedback section: threaded comments z timestamps
  - Design requirements checklist: checkboxes z requirements
  - Action buttons: Upload new version, Request approval, Mark complete

Bottom Section:
- Calendar view: miesięczny kalendarz z deadline markers
- Performance metrics: bar chart produktywności projektantów (projects completed vs time)

KOMPONENTY UI:
- Toggle Switch: animated slide
- Multi-select Filters: z search i clear all
- Alert Badge: pulsing animation
- KPI Cards: z drill-down capability
- Avatar Components: status dots, tooltips z info
- Utilization Progress Bars: color-coded (green<80%, yellow 80-100%, red>100%)
- Kanban Columns: drag&drop zones, card counters
- Draggable Cards: smooth animations, snap zones
- File Thumbnails: hover zoom, click dla full view
- Version History: expandable timeline
- Comment Threads: nested replies, emoji reactions
- Checklist: strikethrough completed items
- Calendar: event markers, hover details

INTERAKCJE:
- Kanban drag&drop: smooth animations, auto-save position changes
- Card hover: pokazuje więcej detali w tooltip
- Designer assignment: drag card na avatar lub klik + menu
- File upload: drag&drop area z progress
- Version comparison: side-by-side view
- Comment submission: real-time updates
- Calendar events: hover popup z project details
- Bulk operations: select multiple cards, bulk actions menu

ADVANCED FEATURES:
- Auto-assignment algorithm na podstawie workload
- Time tracking integration dla accuracy metrics
- Client approval workflow z email notifications
- Design asset library integration
- Version control z branching
- Automated backup i archiving

STYL: Kanban cards z rounded corners, subtle shadows. Color coding dla priority i status. Clean typography hierarchy. Smooth animations (0.3s ease). Hover states dla wszystkich interactive elements.
```

## Instrukcja 6: Zakładka CNC - Production monitoring

```
Stwórz zakładkę CNC do monitorowania produkcji i statusu maszyn w czasie rzeczywistym.

KONTEKST: Mistrzowie produkcji, operatorzy i zarząd potrzebują real-time monitoring statusu maszyn CNC, kolejki produkcyjnej i wskaźników wydajności.

LAYOUT CNC:
Header Section:
- Real-time machine status indicators: seria LED-style indicators (6-8 maszyn) z nazwami (CNC-01, CNC-02, etc.)
- Status legend: Praca (green), Postój (yellow), Awaria (red), Setup (blue)
- Active alarms counter: czerwony badge z liczbą + pulsing animation
- Filters: Maszyna (all/specific), Zmiana (1/2/3), Operator, Materiał
- Shift timer: pozostały czas zmiany (countdown)

KPI Section (2 rzędy po 3 karty):
Top row:
- OEE średnie (% z weekly trend arrow)
- Availability (% z target line)
- Performance (% vs nominal speed)

Bottom row:
- Quality rate (% first pass)
- MTBF (mean time between failures, hours)
- Plan execution (% completed vs scheduled)

Machine Layout Section:
- Schematic factory floor view:
  - 6-8 machine boxes arranged jak na hali
  - Każda maszyna: color-coded status, machine name, current part number, progress % dla current job, ETA completion
  - Visual connections między maszynami jeśli flow line
  - Material flow indicators (arrows)

Production Queue Section (2 kolumny):
Left column (60%):
- Priority job queue table:
  - Kolumny: Job #, Part name, Qty remaining/total, Assigned machine, Planned start, Material status (ready/pending), Priority level
  - Sortowalne i draggable dla re-prioritization
  - Color coding: overdue (red), urgent (orange), normal (white)

Right column (40%):
- Machine Detail Panel:
  - Selected machine name + status
  - Current parameters: spindle speed, feed rate, temperature, tool wear %
  - Recent alarms: last 10 z timestamps i resolution status
  - Maintenance schedule: upcoming tasks z due dates
  - Utilization chart: 7-day usage pattern

KOMPONENTY UI:
- LED Status Indicators: animated, responsive z real-time updates
- Alarm Counter: pulsing red badge
- Countdown Timer: MM:SS format z progress ring
- Machine Status Boxes: large, visual, hover för details
- Sortable Table: drag handles, column sorting
- Real-time Parameter Display: gauges lub numeric displays
- Alarm History: expandable list z severity icons
- Utilization Chart: line chart z hover tooltips
- ETA Display: countdown z color coding

INTERAKCJE:
- Machine status boxes: kliknięcie selectuje i pokazuje details
- Job queue: drag&drop reordering, bulk selection
- Parameter monitoring: real-time updates co 5 sekund
- Alarm acknowledgment: kliknięcie dismisses z confirmation
- Machine detail: tabs för different views (current/history/maintenance)
- Auto-refresh: całą zawartość co 30 sekund
- Alert sounds: audio notifications för critical alarms (optional)

REAL-TIME FEATURES:
- WebSocket connection för live updates
- Status change animations
- Automatic alerts für threshold violations
- Live chat/messaging för operators
- Shift handover notes

MOBILE CONSIDERATIONS:
- Responsive machine layout
- Simplified tables för mobile
- Touch-friendly controls
- Quick action buttons
- Offline capability för basic monitoring

STYL: Industrial theme z dark backgrounds för machine area. High contrast för readability. Green/red/yellow color scheme för status. Monospace font för technical data. Large touch targets. Real-time animations subtle but noticeable.
```

## Instrukcja 7: Zakładka Magazyn - Inventory management

```
Stwórz zakładkę Magazyn do zarządzania zapasami, stanami magazynowymi i logistyką.

KONTEKST: Magazynierzy, plannerzy produkcji i purchasing potrzebują przeglądu stanów magazynowych, ruchów materiałów i alertów o brakach.

LAYOUT MAGAZYN:
Header Section:
- Search materials: autocomplete input z kodem/nazwą materiału
- Filters: Kategoria (dropdown z ikonami), Dostawca (multi-select), Status zapasów (Low/OK/Excess z color badges)
- Quick actions: "Przyjęcie towaru" i "Wydanie" buttons (primary style)
- Stock value indicator: total warehouse value (PLN)

KPI Row (4 karty):
- Warehouse value (PLN current + trend)
- Inventory turnover (ratio + benchmark comparison)
- Fill rate (% orders fulfilled from stock)
- Stockout events (count this month + vs last month)

Main Layout (3 sekcje):
Top Left Panel (40% width, 60% height):
- Critical Materials Table:
  - Kolumny: Material code, Name, Current qty, Minimum level, Status (progress bar), Last delivery, Supplier, Action
  - Status progress bar: red (<min), yellow (min-safe), green (>safe)
  - Action column: "Order now" button för items below minimum
  - Sortable by status, quantity, last delivery
  - Export button för procurement team

Top Right Panel (60% width, 60% height):
- Tabbed interface:
  Tab 1 "Overview":
  - Pie chart: material categories by value
  - Top 10 materials by value (horizontal bar chart)
  - ABC Analysis scatter plot (value vs turnover)
  
  Tab 2 "Movement":
  - Line chart: receipts/issues last 30 days
  - Recent transactions table (last 20 RW/PZ documents)
  - Incoming deliveries timeline (next 14 days)

Bottom Panel (100% width, 40% height):
- Warehouse Layout Visualization:
  - Schematic warehouse zones (A1, A2, B1, B2, etc.)
  - Color-coded utilization: green (<70%), yellow (70-90%), red (>90%)
  - Critical material locations highlighted
  - Picking routes för current orders (animated paths)
  - Emergency stock locations marked
  - Loading dock status indicators

KOMPONENTY UI:
- Autocomplete Search: z material codes i descriptions
- Filter Badges: removable, show active count
- Action Buttons: different styles för different urgency
- Progress Bars: in table cells z color coding
- Interactive Charts: hover tooltips, clickable segments
- Warehouse Map: zoomable, clickable zones
- Transaction History: expandable rows z details
- Delivery Timeline: horizontal scroll z status indicators

ADVANCED FEATURES:
Critical Stock Alerts:
- Pop-up notifications för new stockouts
- Email integration för automatic procurement
- Supplier lead time tracking
- Seasonal demand forecasting hints

Movement Tracking:
- Real-time location updates för materials
- Batch/lot tracking
- Expiry date monitoring
- Quality hold indicators

Optimization Tools:
- Reorder point suggestions
- Slow-moving inventory identification
- Space utilization optimization
- Pick path optimization

INTERAKCJE:
- Warehouse zones: kliknięcie shows zone details z material list
- Material search: real-time suggestions z fuzzy matching
- Chart interactions: drill-down capability
- Table sorting: multi-column sort z visual indicators
- Bulk operations: select multiple materials för bulk actions
- Export functions: CSV/PDF z custom date ranges
- Quick receipt: barcode scanning simulation
- Location assignment: drag&drop materials to zones

MOBILE FEATURES:
- Barcode scanning för receipts/issues
- Location lookup z QR codes
- Quick stock check
- Emergency ordering
- Photo documentation för damages

INTEGRATION HINTS:
- ERP system sync för financial data
- Supplier portals för delivery updates
- Production planning för material requirements
- Quality system för hold/release status

STYL: Clean, functional design z emphasis on data clarity. Color coding consistent throughout (red/yellow/green för status). Tables z zebra striping. Charts in brand colors. Mobile-first för operational features.
```

## Instrukcja 8: Zakładka Produkcja - Manufacturing execution

```
Stwórz ostatnią zakładkę Produkcja jako manufacturing execution system (MES) interface.

KONTEKST: Mistrzowie produkcji, operatorzy i zarząd potrzebują comprehensive overview całego procesu produkcyjnego, wydajności linii i quality control.

LAYOUT PRODUKCJA:
Header Section:
- Shift selector: buttons för zmiany 1/2/3 z aktywną zmianą highlighted
- Shift countdown timer: remaining time w obecnej zmianie (HH:MM format)
- Production line status: horizontal row LED indicators (Linia A, B, C, etc.) z color coding
- Active incidents counter: pulsing red badge z liczbą
- Generate shift report button (secondary style)

KPI Section (2 rzędy):
Top KPI row (4 karty):
- Plan vs Actual (pieces + % completion z progress bar)
- OLE - Overall Line Effectiveness (% z trend indicator)
- Scrap rate (% defects z target comparison)
- Labor productivity (pieces/hour z efficiency rating)

Bottom KPI row (4 karty):
- Downtime today (minutes z breakdown by reason)
- MTTR (mean time to repair, minutes)
- Energy efficiency (kWh/piece vs standard)
- Safety record (days since incident z achievement badge)

Production Schedule Section:
- Gantt Chart Interface:
  - Y-axis: production lines (A, B, C, D)
  - X-axis: time scale (current shift z hourly markers)
  - Job blocks: color-coded by product type, draggable för rescheduling
  - Current time indicator: red vertical line moving w real-time
  - Setup times: gray blocks between jobs
  - Planned maintenance: blue striped blocks
  - Downtime events: red blocks z reason codes

Live Production Floor (3 kolumny):
Left Column (30%):
- Operator Status Board:
  - List operatorów on current shift
  - Photo + name + assigned line
  - Status indicators: Working/Break/Absent
  - Performance vs target (% z color coding)
  - Quick message/alert buttons

Center Column (40%):
- Real-time Production Feed:
  - Live stream recent events (scrolling list):
  - Job starts/completions z timestamps
  - Quality checks (pass/fail z operator name)
  - Alarm acknowledgments
  - Material consumption updates
  - Shift handover notes
  - Equipment status changes

Right Column (30%):
- Quality Control Panel:
  - Current inspection in progress
  - Last 10 quality results (pass/fail icons w grid)
  - SPC charts för key parameters
  - Non-conformity log z severity levels
  - Corrective actions tracking
  - Customer complaint status

KOMPONENTY UI:
- Shift Selector: button group z active state
- Countdown Timer: circular progress z remaining time
- LED Status Row: animated indicators z legends
- Gantt Chart: interactive timeline z drag&drop
- Real-time Feed: auto-scrolling list z timestamps
- Operator Cards: avatar + status + metrics
- Quality Grid: pass/fail visual indicators
- SPC Charts: control limits z out-of-spec highlighting
- Event Log: filterable, searchable, exportable

REAL-TIME FEATURES:
- Live data updates co 10 sekund
- Automatic alerts för quality/safety/efficiency
- Push notifications för critical events
- Real-time chat mellom shifts
- Automatic report generation

ADVANCED FUNCTIONALITY:
Predictive Analytics:
- Equipment failure prediction
- Quality trend analysis
- Efficiency optimization suggestions
- Maintenance scheduling optimization

Digital Work Instructions:
- Step-by-step procedures z photos
- Video tutorials för complex operations
- Multilingual support
- Version control för procedures

Performance Analytics:
- Trend analysis för all KPIs
- Benchmark comparisons
- Root cause analysis tools
- Continuous improvement tracking

INTERAKCJE:
- Gantt jobs: drag för rescheduling z conflict warnings
- Operator cards: click för detailed performance view
- Quality results: click för full inspection details
- Alarms: acknowledge z digital signature
- Feed events: click för context i related data
- Charts: zoom, pan, historical comparison
- Export functions: custom date ranges, formats

EMERGENCY PROCEDURES:
- Emergency stop simulation
- Incident reporting workflow
- Safety checklist activation
- Management escalation paths
- Audit trail för all actions

MOBILE INTEGRATION:
- QR code scanning för job tracking
- Photo capture för quality issues
- Voice notes för shift handovers
- Offline mode för network issues
- Push notifications för critical alerts

STYL: Industrial-strength design z high contrast. Dark theme option för night shifts. Large fonts för readability from distance. Color coding consistent z industry standards (red=stop, green=go, yellow=caution). Responsive design för various screen sizes på production floor.
```

## Instrukcja 9: Responsive behavior i mobile optimization

```
Dodaj responsive behavior do wszystkich zakładek dla optimal viewing na różnych urządzeniach.

ZADANIE: Zaimplementuj responsive design patterns dla tablet i mobile views wszystkich stworzonych zakładek.

RESPONSIVE BREAKPOINTS:
- Desktop: 1200px+ (current designs)
- Tablet: 768px - 1199px
- Mobile: 320px - 767px

GLOBAL RESPONSIVE RULES:
Navigation:
- Desktop: horizontal nav bar jak designed
- Tablet: kompaktowa nav z smaller spacing, combined search/user menu
- Mobile: hamburger menu + bottom tab navigation för main sections

Layout Patterns:
- Desktop: Multi-column layouts jak specified
- Tablet: 2-column max, stack complex layouts
- Mobile: Single column, card-based layouts

ZAKŁADKA-SPECIFIC RESPONSIVE:
Home Dashboard:
- Desktop: 3-column main section
- Tablet: 2-column main (tasks+charts | notifications), stack KPI cards w 2x2
- Mobile: Single column stack wszystko, swipeable KPI cards, simplified charts

Projekty:
- Desktop: Left panel + main table
- Tablet: Collapsible left panel, horizontal scroll table
- Mobile: Full-width list view, filter drawer, simplified table columns

Klienci:
- Desktop: 60/40 split client list/details
- Tablet: 70/30 split, smaller client cards
- Mobile: Full list view, slide-up detail panel, stack contact info

Projektowanie:
- Desktop: 3-column z Kanban center
- Tablet: Hide left panel initially, 2-column main
- Mobile: Single column, tabs för team/kanban/details, simplified cards

CNC:
- Desktop: Machine layout + multi-panel
- Tablet: Simplified machine grid, stacked panels
- Mobile: List view machines, swipeable detail cards, essential KPIs only

Magazyn:
- Desktop: Complex 3-panel layout
- Tablet: 2-panel z tabs, smaller warehouse map
- Mobile: Single panel z navigation tabs, list views, touch-friendly charts

Produkcja:
- Desktop: Gantt + 3-column live view
- Tablet: Simplified Gantt, 2-column live
- Mobile: Tabs för schedule/live/quality, vertical timeline, essential metrics

MOBILE-SPECIFIC COMPONENTS:
- Bottom sheet panels för details
- Swipe gestures för navigation
- Pull-to-refresh dla real-time data
- Touch-friendly buttons (44px minimum)
- Collapsible sections för long content
- Floating action buttons för primary actions

TABLET ADAPTATIONS:
- Sidebar collapse/expand
- Horizontal scroll dla tables
- Simplified charts z key data only
- Touch-optimized controls
- Portrait/landscape orientation support

PERFORMANCE CONSIDERATIONS:
- Lazy loading för non-visible content
- Simplified animations na slower devices
- Reduced chart complexity
- Image optimization
- Minimal JavaScript na mobile

STYL RESPONSIVE:
- Font sizes scale appropriately
- Touch targets minimum 44px
- Spacing adjusts för smaller screens
- Simplified color schemes
- High contrast för outdoor viewing
- Reduced visual complexity

Zaimplementuj te responsive patterns z smooth transitions i maintain functionality across all device types.
```

Ten kompletny zestaw instrukcji pozwoli na utworzenie w Figma Make kompleksowego prototypu aplikacji zarządzania projektami dla Fabryki Dekoracji z wszystkimi zakładkami, funkcjonalnościami i responsive behavior.

# Zaktualizowany zestaw instrukcji dla Figma Make - Bazując na szablonie Materialize

Na podstawie analizy szablonu Materialize, oto zaktualizowane instrukcje wykorzystujące istniejące komponenty i wzorce projektowe z tego template'u.

## Instrukcja 1: Adaptuję szablon Materialize dla Fabryki Dekoracji

```
Użyj szablonu Materialize Dashboard UI Kit jako podstawy i dostosuj go dla aplikacji zarządzania projektami "Fabryka Dekoracji".

ZADANIE: Modyfikuj istniejący szablon Materialize zachowując jego system projektowy, komponenty atomowe i strukturę, ale dostosowując content i funkcjonalność do needs firmy produkcyjnej.

WYKORZYSTUJ Z TEMPLATE'U:
- Color system z Fundamentals/Color
- Typography hierarchy z Fundamentals/Typography
- Shadow system i spacing
- Wszystkie Atoms: Buttons, Text Fields, Select, Cards, etc.
- Navigation patterns z Components Display/Navigation
- Table components z Apps & Pages/Table
- Chart components z Misc/Chart
- Layout patterns z Layouts & Dashboards

MODYFIKUJ BRANDING:
- Logo: zmień na "Fabryka Dekoracji" z ikoną fabryki/narzędzi
- Primary color: adaptuj do industrial theme (keep blue ale darker shade)
- Add custom icons dla manufacturing (CNC, warehouse, production icons)
- Typography: zostaw Inter font ale dodaj industrial accent gdzie appropriate

STRUKTURA NAWIGACJI (używając Navigation atoms):
- Użyj horizontal top navigation pattern z template'u
- 7 main tabs: Home, Projekty, Klienci, Projektowanie, CNC, Magazyn, Produkcja
- Zastosuj existing Avatar component dla user profile
- Wykorzystaj Breadcrumbs component z Atoms
- Search używając Text Field z Atoms + Dropdown

LAYOUT FOUNDATION:
- Użyj Layout patterns z template'u jako base
- Sidebar navigation gdzie potrzebny
- Main content area z proper spacing system
- Wykorzystaj Card atoms jako primary content containers
- Grid system zgodny z template specifications

KOMPONENTY DO REUSE:
- KPI Cards: użyj Card atom + Progress atom + Badge atom
- Data Tables: zastosuj Table components z modifications dla project data  
- Forms: wszystkie Input atoms (Text Field, Select, Checkbox, Radio, Date/Time)
- Charts: Misc/Chart components adapted dla manufacturing metrics
- Notifications: Toast + Snackbar + Alert atoms
- Modals: Dialog atoms dla project details
- Timeline: Timeline atom dla project milestones

INDUSTRIAL CUSTOMIZATIONS:
- Status indicators: używając Badge + custom colors (green=running, red=stopped, yellow=maintenance)
- Machine status: Card atoms z custom icons i real-time data
- Progress tracking: Progress atoms dla project completion
- File management: List atoms + custom file type icons
- Quality control: Checkbox lists + Alert components dla non-conformities

Zachowaj all Materialize design principles, component behavior i accessibility features, tylko customize content i specific functionality dla manufacturing context.
```
