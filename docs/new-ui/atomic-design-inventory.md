# Atomic Design Inventory - FabManage Clean

## Wprowadzenie
Katalog komponentów oparty na metodologii **Atomic Design** Brada Frosta. Definiuje hierarchię: **Atoms → Molecules → Organisms → Templates → Pages** z jasnymi granicami odpowiedzialności.

---

## 🔬 ATOMS (Atomy)
**Definicja**: Najmniejsze, niepodzielne elementy UI. Nie mogą być rozbite na mniejsze komponenty funkcjonalne.

### Katalog Atomów

#### Kontrolki Formularzy
| Komponent | Lokalizacja | Odpowiedzialność | Przykład użycia |
|-----------|-------------|------------------|-----------------|
| **Button** | `atoms/Button/` | Akcje użytkownika, stany hover/focus/disabled | Submit, Cancel, Primary Actions |
| **Input** | `atoms/Input/` | Wprowadzanie tekstu, walidacja wizualna | Search, tekstowe pola formularzy |
| **Label** | `atoms/Label/` | Etykiety pól, accessibility | Opisy dla Input, Checkbox |
| **Checkbox** | `atoms/Checkbox/` | Wybór opcji boolean | Filtry, zgody, wielokrotny wybór |
| **RadioGroup** | `atoms/RadioGroup/` | Wybór jednej opcji z grupy | Status projektu, prioritet |
| **Switch** | `atoms/Switch/` | Toggle states | Tryb ciemny, aktywacja funkcji |
| **Select** | `atoms/Select/` | Wybór z listy rozwijanej | Kategorie, użytkownicy |

#### Elementy Wizualne  
| Komponent | Lokalizacja | Odpowiedzialność | Przykład użycia |
|-----------|-------------|------------------|-----------------|
| **Icon** | `atoms/Icon/` | Reprezentacja wizualna akcji/stanu | Lucide icons, statusy |
| **Avatar** | `atoms/Avatar/` | Reprezentacja użytkownika | Profile, assignees |
| **Badge** | `atoms/Badge/` | Statusy, etykiety, liczniki | Status tiles, priorities |
| **Progress** | `atoms/Progress/` | Wskaźnik postępu | Upload progress, project completion |
| **Separator** | `atoms/Separator/` | Wizualne oddzielenie treści | Dividers, sections |
| **Spinner** | `atoms/Spinner/` | Stany ładowania | Loading indicators |

#### Typografia
| Komponent | Lokalizacja | Odpowiedzialność | Przykład użycia |
|-----------|-------------|------------------|-----------------|
| **Heading** | `atoms/Heading/` | Hierarchia treści (h1-h6) | Page titles, section headers |
| **Text** | `atoms/Text/` | Tekst body, różne rozmiary | Descriptions, labels |
| **Link** | `atoms/Link/` | Nawigacja, linki zewnętrzne | Navigation, external references |

---

## 🧬 MOLECULES (Molekuły)  
**Definicja**: Grupa atomów tworzących funkcjonalną jednostkę. Ma jeden, jasny cel biznesowy.

### Katalog Molekuł

#### Formularze
| Komponent | Skład (Atomy) | Odpowiedzialność | Przykład użycia |
|-----------|---------------|------------------|-----------------|
| **FormField** | Label + Input + Text (error) | Pole formularza z walidacją | Nazwa projektu, email klienta |
| **SearchBox** | Input + Icon + Button | Wyszukiwanie z filtrami | Wyszukiwanie projektów, materiałów |
| **DatePicker** | Input + Icon + Calendar | Wybór daty/zakresu | Deadline, project timeline |
| **FileUpload** | Button + Progress + Text | Upload plików z feedbackiem | DXF files, dokumenty projektów |

#### Nawigacja
| Komponent | Skład (Atomy) | Odpowiedzialność | Przykład użycia |
|-----------|---------------|------------------|-----------------|
| **Breadcrumb** | Link + Separator + Text | Ścieżka nawigacji | Home > Projects > Project Details |
| **Pagination** | Button + Text + Select | Paginacja tabel/list | Materials list, tiles gallery |
| **TabsList** | Button (multiple) | Przełączanie widoków | Project tabs, settings sections |

#### Feedback
| Komponent | Skład (Atomy) | Odpowiedzialność | Przykład użycia |
|-----------|---------------|------------------|-----------------|
| **Toast** | Icon + Text + Button | Notyfikacje systemowe | Success/error messages |
| **AlertDialog** | Heading + Text + Button (2) | Potwierdzenia akcji | Delete confirmation |
| **Tooltip** | Text + positioning | Dodatkowe informacje | Help text, shortcuts |
| **StatusBadge** | Badge + Icon + Text | Status z kolorem | Tile status, project phase |

#### Dane
| Komponent | Skład (Atomy) | Odpowiedzialność | Przykład użycia |
|-----------|---------------|------------------|-----------------|
| **KeyValue** | Label + Text | Para klucz-wartość | Project details, specifications |
| **Metric** | Heading + Text + Badge | Metryka z wartością | Budget, completion percentage |
| **Card** | Layout container | Grupowanie powiązanej treści | Project card, material item |

---

## 🏗️ ORGANISMS (Organizmy)
**Definicja**: Złożone komponenty składające się z molekuł i atomów. Implementują kompletne sekcje interfejsu.

### Katalog Organizmów

#### Nawigacja i Layout
| Komponent | Skład (Molecules/Atoms) | Odpowiedzialność | Przykład użycia |
|-----------|-------------------------|------------------|-----------------|
| **Header** | Logo + SearchBox + Avatar + DropdownMenu | Główna nawigacja aplikacji | App header z user menu |
| **Sidebar** | NavigationMenu + Avatar + StatusBadge | Nawigacja sekcji | Main navigation menu |
| **Breadcrumb** | Breadcrumb + Button | Kontekstowa nawigacja | Page context + actions |

#### Tabele i Listy  
| Komponent | Skład (Molecules/Atoms) | Odpowiedzialność | Przykład użycia |
|-----------|-------------------------|------------------|-----------------|
| **DataTable** | SearchBox + Table + Pagination | Wyświetlanie i zarządzanie danymi | Materials inventory, projects list |
| **KanbanBoard** | Card + StatusBadge + DragDrop | Workflow management | Tiles production pipeline |
| **GanttChart** | Timeline + Card + Progress | Harmonogram projektów | Project timeline, dependencies |

#### Formularze i Dialogi
| Komponent | Skład (Molecules/Atoms) | Odpowiedzialność | Przykład użycia |
|-----------|-------------------------|------------------|-----------------|
| **Sheet** | Header + FormField + Button | Edycja w panelu bocznym | Edit tile, project details |
| **Dialog** | Header + FormField + Button | Modalne formularze | Create project, confirm delete |
| **FilterPanel** | SearchBox + Checkbox + Button | Filtrowanie danych | Materials filter, project search |

#### Domeny Biznesowe FabManage
| Komponent | Skład (Molecules/Atoms) | Odpowiedzialność | Przykład użycia |
|-----------|-------------------------|------------------|-----------------|
| **ProjectCard** | Card + StatusBadge + Progress + Button | Prezentacja projektu | Projects dashboard |
| **TileEditor** | FormField + FileUpload + Preview | Edycja płytki CNC | Tile details editor |
| **MaterialsInventory** | DataTable + StatusBadge + Metric | Zarządzanie materiałami | Stock levels, ordering |
| **CNCQueue** | KanbanBoard + Priority + DatePicker | Kolejka produkcji CNC | Production planning |

---

## 📄 TEMPLATES (Szablony)
**Definicja**: Layouts stron składające się z organizmów. Definiują strukturę bez treści.

### Katalog Templates

#### Layouts Główne
| Template | Struktura | Odpowiedzialność | Przykład użycia |
|----------|-----------|------------------|-----------------|
| **AppShell** | Header + Sidebar + Main + Footer | Główny layout aplikacji | Wszystkie strony po zalogowaniu |
| **AuthLayout** | Centered Card + Logo | Layout dla autentyfikacji | Login, register, forgot password |
| **DashboardLayout** | AppShell + Metrics Grid | Layout dashboardu | Main dashboard, project overview |

#### Layouts Stron  
| Template | Struktura | Odpowiedzialność | Przykład użycia |
|----------|-----------|------------------|-----------------|
| **ListPageLayout** | Header + FilterPanel + DataTable | Strony z listami | Projects list, materials inventory |
| **DetailPageLayout** | Breadcrumb + Header + Tabs + Content | Strony szczegółów | Project details, tile editor |
| **FormPageLayout** | Breadcrumb + Card + FormFields | Strony formularzy | Create project, settings |

---

## 📱 PAGES (Strony)
**Definicja**: Konkretne instancje templates z rzeczywistą treścią i danymi.

### Katalog Pages

#### Główne Strony
| Page | Template | Komponenty | Funkcjonalność |
|------|----------|------------|----------------|
| **DashboardPage** | DashboardLayout | ProjectCard + Metrics + Charts | Przegląd projektów i metryk |
| **ProjectsPage** | ListPageLayout | DataTable + FilterPanel | Lista wszystkich projektów |
| **ProjectDetailPage** | DetailPageLayout | ProjectCard + TileEditor + Timeline | Szczegóły pojedynczego projektu |

#### Zarządzanie Produkcją
| Page | Template | Komponenty | Funkcjonalność |
|------|----------|------------|----------------|
| **TilesPage** | ListPageLayout | KanbanBoard + TileEditor | Zarządzanie płytkami produkcyjnymi |
| **MaterialsPage** | ListPageLayout | MaterialsInventory + FilterPanel | Inwentarz materiałów |
| **CNCQueuePage** | DashboardLayout | CNCQueue + GanttChart | Kolejka i harmonogram CNC |

#### Konfiguracja
| Page | Template | Komponenty | Funkcjonalność |
|------|----------|------------|----------------|
| **SettingsPage** | FormPageLayout | FormField + Switch + Button | Ustawienia aplikacji |
| **UsersPage** | ListPageLayout | DataTable + UserCard | Zarządzanie użytkownikami |

---

## 🔗 Granice Odpowiedzialności

### Zasady Kompozycji
1. **Atoms**: Tylko props, brak logiki biznesowej, brak external dependencies
2. **Molecules**: Kombinują atomy, jeden cel funkcjonalny, mogą mieć lokalny state
3. **Organisms**: Zawierają logikę biznesową, external API calls, complex state management
4. **Templates**: Layout i structure, brak treści, props dla organizmów
5. **Pages**: Dane i content, routing, page-level state

### Zależności (Import Rules)
- **Atoms**: mogą importować tylko utilities i tokens
- **Molecules**: mogą importować atoms i utilities  
- **Organisms**: mogą importować molecules, atoms, services
- **Templates**: mogą importować organisms, molecules, atoms
- **Pages**: mogą importować wszystko

### Zakazy
- ❌ Atoms nie mogą importować molecules/organisms
- ❌ Molecules nie mogą importować organisms  
- ❌ Bezpośrednie importy z `antd` (tylko przez bridge layer)
- ❌ Business logic w atoms/molecules
- ❌ API calls w atoms/molecules

---

## 📁 Struktura Katalogów

```
src/new-ui/
├── atoms/
│   ├── Button/
│   ├── Input/
│   ├── Icon/
│   └── ...
├── molecules/
│   ├── FormField/
│   ├── SearchBox/
│   ├── DataTable/
│   └── ...
├── organisms/
│   ├── Header/
│   ├── DataTable/
│   ├── KanbanBoard/
│   └── ...
├── templates/
│   ├── AppShell/
│   ├── DashboardLayout/
│   └── ...
└── pages/
    ├── DashboardPage/
    ├── ProjectsPage/
    └── ...
```

---

*Atomic Design Inventory v1.0 - FabManage Clean UI Team*