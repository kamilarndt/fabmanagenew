# Struktura Nowego UI - FabManage Clean
## Strangler Fig Pattern z Shadcn/UI + TalkToFigma MCP

### Architektura Katalogów

```
src/
├── new-ui/                     # Nowy system komponentów
│   ├── tokens/                 # Design tokens z Figma
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── shadows.ts
│   │   ├── borders.ts
│   │   └── animations.ts
│   ├── atoms/                  # Komponenty niepodzielne
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Label/
│   │   ├── Badge/
│   │   ├── Avatar/
│   │   ├── Icon/
│   │   ├── Spinner/
│   │   ├── Separator/
│   │   ├── Switch/
│   │   ├── Checkbox/
│   │   ├── RadioGroup/
│   │   └── Progress/
│   ├── molecules/              # Funkcjonalne grupy atomów
│   │   ├── FormField/
│   │   ├── SearchBox/
│   │   ├── Pagination/
│   │   ├── Breadcrumb/
│   │   ├── AlertDialog/
│   │   ├── Toast/
│   │   ├── DropdownMenu/
│   │   ├── Select/
│   │   ├── DatePicker/
│   │   ├── ComboBox/
│   │   ├── Tooltip/
│   │   └── Popover/
│   ├── organisms/              # Złożone komponenty biznesowe
│   │   ├── DataTable/
│   │   ├── Sheet/
│   │   ├── CommandPalette/
│   │   ├── NavigationMenu/
│   │   ├── Sidebar/
│   │   ├── Header/
│   │   ├── Dashboard/
│   │   ├── KanbanBoard/
│   │   ├── GanttChart/
│   │   ├── Calendar/
│   │   ├── FileUpload/
│   │   └── Chart/
│   ├── templates/              # Kompletne layouts
│   │   ├── AppShell/
│   │   ├── ProjectPage/
│   │   ├── MaterialsPage/
│   │   ├── TilesPage/
│   │   ├── DashboardPage/
│   │   ├── LoginPage/
│   │   └── SettingsPage/
│   └── utils/                  # Utilities
│       ├── cn.ts
│       ├── variants.ts
│       ├── animations.ts
│       ├── responsive.ts
│       └── theme.ts
├── bridge-ui/                  # Warstwa przejściowa Strangler Fig
│   ├── antd-wrappers/         # Adaptery Ant Design
│   │   ├── LegacyButton.tsx
│   │   ├── LegacyTable.tsx
│   │   ├── LegacyDrawer.tsx
│   │   ├── LegacyForm.tsx
│   │   └── LegacyModal.tsx
│   └── migration-helpers/      # Utility migracji
│       ├── ComponentBridge.tsx
│       ├── ThemeBridge.tsx
│       └── StyleBridge.tsx
└── figma-integration/          # MCP Integration
    ├── mcp-config.json
    ├── figma-tokens-sync.ts
    ├── component-generator.ts
    └── design-sync.ts
```

### Workflow z TalkToFigma MCP

#### Faza 1: Setup & Design Tokens
```bash
# Połączenie z Figma
join_channel <channel_id>

# Ekstraktowanie design tokens
get_figma_data --file-key=<figma_file_key>
extract_design_tokens --output=src/new-ui/tokens/
get_color_styles --format=tailwind-css
get_typography_styles --output=tokens/typography.ts
download_figma_images --path=src/assets/figma/
```

#### Faza 2: Atomy
```bash
# Generowanie podstawowych komponentów
get_component_variants --component='Button' --output=src/new-ui/atoms/Button/
extract_input_styles --output=src/new-ui/atoms/Input/
get_form_controls --output=src/new-ui/atoms/
export_icon_components --path=src/new-ui/atoms/Icon/
generate_badge_variants --output=src/new-ui/atoms/Badge/
```

#### Faza 3: Molekuły
```bash
# Tworzenie złożonych komponentów
extract_form_patterns --output=src/new-ui/molecules/FormField/
get_dropdown_components --output=src/new-ui/molecules/DropdownMenu/
extract_navigation_elements --output=src/new-ui/molecules/
get_feedback_components --output=src/new-ui/molecules/
generate_search_patterns --output=src/new-ui/molecules/SearchBox/
```

#### Faza 4: Organizmy
```bash
# Budowanie złożonych komponentów
extract_table_layouts --output=src/new-ui/organisms/DataTable/
get_dashboard_components --output=src/new-ui/organisms/Dashboard/
extract_sidebar_patterns --output=src/new-ui/organisms/Sidebar/
get_kanban_layouts --output=src/new-ui/organisms/KanbanBoard/
extract_sheet_patterns --output=src/new-ui/organisms/Sheet/
```

#### Faza 5: Templates
```bash
# Generowanie pełnych layoutów
extract_page_layouts --page='ProjectPage' --output=src/new-ui/templates/
get_app_shell --output=src/new-ui/templates/AppShell/
extract_responsive_layouts --breakpoints='mobile,tablet,desktop'
get_login_page_layout --output=src/new-ui/templates/LoginPage/
extract_dashboard_layout --output=src/new-ui/templates/DashboardPage/
```

### Zasady Strangler Fig Pattern

1. **Nowe komponenty** - zawsze w `new-ui/`
2. **Bridge layer** - adaptery w `bridge-ui/antd-wrappers/`
3. **Stopniowa migracja** - route po route
4. **No direct imports** - tylko przez bridge layer
5. **Usuwanie legacy** - po 100% migracji