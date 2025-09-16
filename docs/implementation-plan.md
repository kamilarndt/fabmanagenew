# FabManage UI Migration - Implementation Plan
## Strangler Fig Strategy: Ant Design → Shadcn/UI + TailwindCSS

### 📋 Project Overview
- **Nazwa**: FabManage UI Migration - Strangler Fig Strategy
- **Czas trwania**: 12-16 tygodni  
- **Zespół**: 2-3 frontend developers + 1 designer
- **Strategia**: Gradual migration using Strangler Fig Pattern
- **Tech Stack**: Shadcn/UI + Tailwind CSS + TalkToFigma MCP + Cursor AI

### 🎯 Cele Projektu
1. **Performance**: Redukcja bundle size o 85% (850KB → 127KB)
2. **Developer Experience**: 40% szybsze tworzenie komponentów
3. **User Experience**: Lepsze performance + accessibility
4. **Maintainability**: Modern, future-proof codebase
5. **Zero Downtime**: Bezpieczna migracja bez breaking changes

### 📋 Prerequisites

#### Tools Setup
- ✅ Cursor IDE z MCP support
- ✅ TalkToFigma MCP plugin zainstalowany
- ✅ WebSocket server dla Figma integration  
- ✅ shadcn/ui: The Ultimate UI Kit for Figma
- ✅ Figma plugin 'Cursor Talk To Figma MCP' aktywny

#### Environment
- ✅ Node.js 18+ z npm/bun
- ✅ Tailwind CSS 3.4+ skonfigurowany
- ✅ ESLint rules dla import restrictions
- ✅ Husky pre-commit hooks
- ✅ Playwright E2E tests setup

#### Team Knowledge
- ✅ Znajomość Tailwind CSS
- ✅ Podstawy Atomic Design  
- ✅ Radix UI primitives concepts
- ✅ React 18 + TypeScript patterns
- ✅ Testing strategies (RTL + Playwright)

---

## 📅 Implementation Phases

### Phase 0: Setup & Preparation (1 tydzień)
**Goal**: Przygotowanie środowiska i infrastruktury

**Tasks**:
1. Konfiguracja Cursor + MCP + Figma integration
2. Setup Tailwind CSS z custom design tokens
3. Inicjalizacja struktury katalogów new-ui/
4. Konfiguracja ESLint rules (no direct antd imports)
5. Setup bridge-ui/ layer z pierwszymi wrapperami
6. Konfiguracja CI/CD z UI audit checks
7. Przygotowanie dokumentacji i guidelines

**MCP Commands**:
```bash
join_channel <figma_channel>
test_connection --verify-figma-access
setup_workspace --project=fabmanage-clean
```

**Deliverables**:
- 📦 Działający MCP server + Figma plugin
- 📦 Struktura new-ui/ z podstawowymi utils
- 📦 Bridge layer setup
- 📦 ESLint rules preventing direct antd imports
- 📦 CI pipeline z UI migration checks

**Success Criteria**:
- ✅ MCP successfully connects to Figma
- ✅ Bridge layer blocks direct antd imports
- ✅ All existing functionality still works
- ✅ Team can generate code from Figma designs

---

### Phase 1: Design Tokens & Atoms Foundation (2 tygodnie)
**Goal**: Ekstraktowanie design tokenów i podstawowych atomów

**Tasks**:
1. Ekstraktowanie wszystkich design tokens z Figma
2. Generowanie Tailwind config z tokens
3. Implementacja podstawowych atomów (Button, Input, Label)
4. Setup dark/light mode theming
5. Implementacja icon system
6. Testy accessibility dla atomów
7. Dokumentacja w Storybook/Ladle

**MCP Commands**:
```bash
get_figma_data --file-key=<figma_key>
extract_design_tokens --output=src/new-ui/tokens/
get_color_styles --format=tailwind-css
get_typography_styles --output=tokens/typography.ts
get_component_variants --component='Button' --output=src/new-ui/atoms/Button/
extract_input_styles --output=src/new-ui/atoms/Input/
export_icon_components --path=src/new-ui/atoms/Icon/
```

**Deliverables**:
- 📦 Kompletny zestaw design tokens
- 📦 12+ komponentów atomów (Button, Input, Badge, etc.)
- 📦 Dark/light mode support
- 📦 Icon system z Lucide React
- 📦 Accessibility tests passing
- 📦 Documentation dla każdego atomu

**Success Criteria**:
- ✅ All design tokens exported and working
- ✅ Button component matches Figma designs exactly
- ✅ Dark mode toggle works correctly
- ✅ All atoms pass accessibility audit
- ✅ Bundle size impact < 50KB

---

### Phase 2: Molecules & Core Patterns (2-3 tygodnie)
**Goal**: Implementacja złożonych molekuł i form patterns

**Tasks**:
1. Implementacja FormField molecules
2. SearchBox z autocomplete
3. Dropdown/Select components
4. Toast notification system (sonner)
5. Modal/Dialog patterns
6. Date/Time picker components
7. Pagination komponenty
8. Loading states i skeletons

**MCP Commands**:
```bash
extract_form_patterns --output=src/new-ui/molecules/FormField/
get_dropdown_components --output=src/new-ui/molecules/DropdownMenu/
get_feedback_components --output=src/new-ui/molecules/
generate_search_patterns --output=src/new-ui/molecules/SearchBox/
extract_date_components --output=src/new-ui/molecules/DatePicker/
get_modal_patterns --output=src/new-ui/molecules/Dialog/
```

**Deliverables**:
- 📦 15+ komponenty molecules
- 📦 Form validation system
- 📦 Notification system (replacement dla antd message)
- 📦 Date picker (replacement dla antd DatePicker)
- 📦 Modal system (base dla Sheet)
- 📦 Comprehensive testing suite

**Success Criteria**:
- ✅ FormField components handle all validation cases
- ✅ Toast system replaces antd notifications
- ✅ Date picker has feature parity with antd
- ✅ All molecules integrate seamlessly with atoms
- ✅ Performance benchmarks met

---

### Phase 3: Critical Organisms & First Migration (3-4 tygodnie)
**Goal**: Implementacja kluczowych organizmów i pierwsza migracja route

**Tasks**:
1. DataTable z @tanstack/react-table (replacement antd Table)
2. Sheet/Drawer system (replacement antd Drawer)
3. Sidebar navigation component
4. Header/Navigation organism
5. Command palette implementation
6. Dashboard widgets base
7. Pierwsza migracja: /materials → /materials/v2
8. A/B testing setup dla migracji

**MCP Commands**:
```bash
extract_table_layouts --output=src/new-ui/organisms/DataTable/
extract_sheet_patterns --output=src/new-ui/organisms/Sheet/
extract_sidebar_patterns --output=src/new-ui/organisms/Sidebar/
get_dashboard_components --output=src/new-ui/organisms/Dashboard/
get_command_patterns --output=src/new-ui/organisms/CommandPalette/
extract_page_layouts --page='MaterialsPage' --output=src/new-ui/templates/
```

**Deliverables**:
- 📦 DataTable z pełną funkcjonalnością (sort, filter, pagination)
- 📦 Sheet system z accessibility support
- 📦 Navigation organisms
- 📦 First migrated route: /materials/v2
- 📦 A/B testing infrastructure
- 📦 Performance comparison data

**Success Criteria**:
- ✅ DataTable performance > antd Table
- ✅ Sheet accessibility score 100%
- ✅ /materials/v2 fully functional
- ✅ User feedback positive (>80% satisfaction)
- ✅ Bundle size reduction visible
- ✅ No regression in existing functionality

---

### Phase 4: Domain-Specific Organisms (3-4 tygodnie)
**Goal**: Implementacja organizmów specyficznych dla FabManage

**Tasks**:
1. KanbanBoard implementation (replacement ComponentsKanban)
2. GanttChart modernization
3. Materials inventory components
4. Project workflow organisms
5. File upload organisms
6. Chart/visualization components
7. Calendar organism
8. Migracja drugiej route: /projects → /projects/v2

**MCP Commands**:
```bash
get_kanban_layouts --output=src/new-ui/organisms/KanbanBoard/
extract_gantt_patterns --output=src/new-ui/organisms/GanttChart/
get_inventory_components --output=src/new-ui/organisms/Materials/
extract_file_upload --output=src/new-ui/organisms/FileUpload/
get_chart_components --output=src/new-ui/organisms/Chart/
extract_calendar_layouts --output=src/new-ui/organisms/Calendar/
```

**Deliverables**:
- 📦 KanbanBoard z drag-and-drop
- 📦 Modernizowany GanttChart
- 📦 Materials management UI
- 📦 Second migrated route: /projects/v2
- 📦 Advanced visualization components
- 📦 Calendar integration

**Success Criteria**:
- ✅ KanbanBoard performance better than legacy
- ✅ GanttChart maintains all functionality
- ✅ /projects/v2 matches feature parity
- ✅ User adoption rate >60% for new routes
- ✅ Performance metrics improved across board

---

### Phase 5: Templates & Mass Migration (2-3 tygodnie)
**Goal**: Kompletne templates i masowa migracja pozostałych routes

**Tasks**:
1. AppShell template (main app layout)
2. All page templates (Dashboard, Settings, etc.)
3. Responsive design optimization
4. Mass migration remaining routes
5. Performance optimization pass
6. Accessibility final audit
7. User training materials

**MCP Commands**:
```bash
get_app_shell --output=src/new-ui/templates/AppShell/
extract_responsive_layouts --breakpoints='mobile,tablet,desktop'
get_dashboard_layout --output=src/new-ui/templates/DashboardPage/
get_settings_layout --output=src/new-ui/templates/SettingsPage/
optimize_bundle_size --analyze-dependencies
audit_responsive_design --test-all-breakpoints
```

**Deliverables**:
- 📦 Complete AppShell template
- 📦 All page templates responsive
- 📦 95%+ routes migrated to new UI
- 📦 Performance optimizations applied
- 📦 Accessibility compliance achieved
- 📦 User documentation updated

**Success Criteria**:
- ✅ All routes migrated successfully
- ✅ Mobile experience excellent
- ✅ Bundle size reduced by 80%+
- ✅ Core Web Vitals improved
- ✅ Zero accessibility violations

---

### Phase 6: Legacy Cleanup & Optimization (1-2 tygodnie)
**Goal**: Usunięcie legacy kodu i finalna optymalizacja

**Tasks**:
1. Removal wszystkich antd dependencies
2. Cleanup bridge-ui/ layer
3. Final bundle optimization
4. Documentation update
5. Team training sessions
6. Go-live preparation
7. Monitoring setup

**MCP Commands**:
```bash
audit_legacy_dependencies --remove-unused
cleanup_bridge_layer --verify-safe-removal
optimize_final_bundle --tree-shake-aggressive
generate_migration_report --success-metrics
```

**Deliverables**:
- 📦 Zero antd dependencies
- 📦 Clean codebase without bridge layer
- 📦 Optimized production build
- 📦 Updated documentation
- 📦 Trained team
- 📦 Production deployment

**Success Criteria**:
- ✅ Bundle size reduced by 85%+
- ✅ Build time improved by 50%+
- ✅ Developer experience improved
- ✅ Zero legacy code remaining
- ✅ Production stable and performant

---

## 🚨 Risk Management

### High Risks
- **Breaking changes w production**: Mitigation przez Strangler Fig + A/B testing
- **Performance regression**: Continuous monitoring + rollback procedures
- **Team adoption**: Training + pair programming + dokumentacja

### Medium Risks  
- **MCP integration issues**: Manual fallback + backup design tokens
- **Accessibility regressions**: Automated testing + manual audits

---

## 📊 Success Metrics

### Performance KPIs
- Bundle size reduction: **Target 85%** (from 850KB to ~127KB)
- Initial load time: **Target 70% improvement**
- Runtime performance: **Target 95% improvement**
- Memory usage: **Target 80% reduction**

### Development KPIs
- Component development time: **Target 40% reduction**
- Design-to-code time: **Target 60% reduction** (dzięki MCP)
- Developer satisfaction: **Target >85%**

### Business KPIs
- User satisfaction: **Target >90%**
- Feature delivery velocity: **Target 25% increase**
- Production incidents: **Target 0** related to UI

---

## 🔄 Rollback Plan

### Immediate Rollback
- Feature flags toggle → antd components
- Bridge layer activation
- CI/CD pipeline revert

### Partial Rollback
- Component-specific rollback przez bridge layer
- Route-specific rollback (np. tylko /materials/v2)
- User-group specific rollback

---

## 📅 Key Milestones

- **Week 1**: ✅ Environment setup + MCP integration working
- **Week 3**: ✅ Design tokens + Atoms complete
- **Week 6**: ✅ Molecules + Core patterns ready  
- **Week 10**: ✅ First route migration (/materials/v2) successful
- **Week 14**: ✅ All critical organisms implemented
- **Week 17**: ✅ Mass migration complete (95%+ routes)
- **Week 19**: ✅ Legacy cleanup + production optimization
- **Week 20**: 🚀 Go-live + monitoring

---

## 💡 Next Steps

1. **Get team approval** for implementation plan
2. **Setup Figma workspace** with shadcn/ui kit
3. **Configure Cursor IDE** with MCP plugin
4. **Initialize Phase 0**: Setup & Preparation
5. **Begin design token extraction** from Figma

---

*Implementation Plan v1.0 - FabManage UI Migration Team*