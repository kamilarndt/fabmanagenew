# **📋 SZCZEGÓŁOWA MAPA STRUKTURY STRONY - FabManage-Clean**

## **🎯 PRZEGLĄD STRUKTURY**

Aplikacja FabManage-Clean składa się z **21 głównych stron** podzielonych na **8 głównych modułów biznesowych** plus **strony pomocnicze**. Każda strona ma przypisane komponenty, które należy zrefaktoryzować zgodnie z planem Atomic Design.

---

## **🏗️ STRUKTURA ROUTINGU**

### **Główny Layout: `BrandedLayout`**

- **Plik**: `src/layouts/BrandedLayout.tsx`
- **Komponenty**: `BrandedSidebar`, `ContextualHeader`, `ConnectionStatusIndicator`
- **Funkcje**: Nawigacja, sidebar, header kontekstowy

---

## **📄 SZCZEGÓŁOWA MAPA STRON**

### **1. 🏠 DASHBOARD**

**URL**: `/`  
**Plik**: `src/pages/Dashboard.tsx`  
**Status**: ✅ Używa App\* komponentów  
**Komponenty używane**:

- `AppCard` - karty statystyk
- `AppRow/AppCol` - układ siatki
- `AppButton` - przyciski akcji
- `AppSpace` - odstępy

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/dashboard/views/DashboardView.tsx`
- [ ] Stwórz `src/modules/dashboard/components/StatsCard.tsx`
- [ ] Stwórz `src/modules/dashboard/components/QuickActions.tsx`

---

### **2. 📁 PROJEKTY**

**URL**: `/projects`, `/projekty`  
**Plik**: `src/pages/Projects.tsx`  
**Status**: ✅ Używa App\* komponentów  
**Komponenty używane**:

- `AppCard` - karty projektów
- `AppButton` - przyciski akcji
- `AppSelect` - filtry
- `AppSpace` - odstępy
- `PageHeader` - nagłówek strony

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/projects/views/ProjectsView.tsx`
- [ ] Stwórz `src/modules/projects/components/ProjectCard.tsx`
- [ ] Stwórz `src/modules/projects/components/ProjectFilters.tsx`
- [ ] Stwórz `src/modules/projects/components/ProjectStats.tsx`

---

### **3. ➕ DODAJ PROJEKT**

**URL**: `/projects/new`, `/projekty/nowy`  
**Plik**: `src/pages/AddProject.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppForm` - formularz
- `AppInput` - pola tekstowe
- `AppSelect` - listy rozwijane
- `AppButton` - przyciski

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/projects/views/AddProjectView.tsx`
- [ ] Stwórz `src/modules/projects/components/ProjectForm.tsx`
- [ ] Stwórz `src/modules/projects/components/ProjectFormFields.tsx`

---

### **4. 📋 SZCZEGÓŁY PROJEKTU**

**URL**: `/project/:id`, `/projekt/:id`  
**Plik**: `src/pages/Projekt.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppTabs` - zakładki
- `AppCard` - karty
- `AppButton` - przyciski
- `AppSpace` - odstępy

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/projects/views/ProjectDetailsView.tsx`
- [ ] Stwórz `src/modules/projects/components/ProjectHeader.tsx`
- [ ] Stwórz `src/modules/projects/components/ProjectTabs.tsx`
- [ ] Stwórz `src/modules/projects/components/ProjectInfo.tsx`

---

### **5. 🎨 DZIAŁ PROJEKTOWY**

**URL**: `/projektowanie`  
**Plik**: `src/pages/Projektowanie.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppSelect` - filtry projektów
- `AppButton` - przyciski
- `AppCard` - karty zadań
- `AppSpace` - odstępy

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/design/views/DesignBoardView.tsx`
- [ ] Stwórz `src/modules/design/components/DesignBoard.tsx`
- [ ] Stwórz `src/modules/design/components/DesignTaskCard.tsx`
- [ ] Stwórz `src/modules/design/components/DesignFilters.tsx`

---

### **6. 🔧 CNC**

**URL**: `/cnc`  
**Plik**: `src/pages/CNC.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppCard` - karty zadań
- `AppButton` - przyciski
- `AppSelect` - filtry
- `AppSpace` - odstępy

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/cnc/views/CNCView.tsx`
- [ ] Stwórz `src/modules/cnc/components/CNCQueue.tsx`
- [ ] Stwórz `src/modules/cnc/components/CNCTaskCard.tsx`
- [ ] Stwórz `src/modules/cnc/components/CNCStats.tsx`

---

### **7. 🏭 PRODUKCJA**

**URL**: `/produkcja`  
**Plik**: `src/pages/Produkcja.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppCard` - karty zadań
- `AppButton` - przyciski
- `AppSelect` - filtry
- `AppSpace` - odstępy

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/production/views/ProductionView.tsx`
- [ ] Stwórz `src/modules/production/components/ProductionBoard.tsx`
- [ ] Stwórz `src/modules/production/components/ProductionTaskCard.tsx`
- [ ] Stwórz `src/modules/production/components/ProductionStats.tsx`

---

### **8. 📦 MAGAZYN**

**URL**: `/magazyn`  
**Plik**: `src/pages/MagazynUmms.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppCard` - karty materiałów
- `AppButton` - przyciski
- `AppSelect` - filtry
- `AppSpace` - odstępy

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/materials/views/WarehouseView.tsx`
- [ ] Stwórz `src/modules/materials/components/MaterialCard.tsx`
- [ ] Stwórz `src/modules/materials/components/CategorySidebar.tsx`
- [ ] Stwórz `src/modules/materials/components/MaterialFilters.tsx`

---

### **9. 📊 DASHBOARD MAGAZYNU**

**URL**: `/magazyn` (index)  
**Plik**: `src/pages/MagazynDashboard.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppCard` - karty statystyk
- `AppButton` - przyciski
- `AppSpace` - odstępy

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/materials/views/MaterialsDashboardView.tsx`
- [ ] Stwórz `src/modules/materials/components/MaterialStats.tsx`
- [ ] Stwórz `src/modules/materials/components/MaterialQuickActions.tsx`

---

### **10. 🧩 KAFELKI/ELEMENTY**

**URL**: `/kafelki`, `/tiles`  
**Plik**: `src/pages/Tiles.tsx`  
**Status**: ✅ Używa App\* komponentów  
**Komponenty używane**:

- `AppCard` - karty kafelków
- `AppButton` - przyciski
- `AppSelect` - filtry
- `AppSpace` - odstępy
- `PageHeader` - nagłówek

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/tiles/views/TilesView.tsx`
- [ ] Stwórz `src/modules/tiles/components/TileCard.tsx`
- [ ] Stwórz `src/modules/tiles/components/TileFilters.tsx`
- [ ] Stwórz `src/modules/tiles/components/TileStats.tsx`

---

### **11. 👥 KLIENCI**

**URL**: `/klienci`  
**Plik**: `src/pages/Klienci.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppCard` - karty klientów
- `AppButton` - przyciski
- `AppSelect` - filtry
- `AppSpace` - odstępy

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/clients/views/ClientsView.tsx`
- [ ] Stwórz `src/modules/clients/components/ClientCard.tsx`
- [ ] Stwórz `src/modules/clients/components/ClientFilters.tsx`
- [ ] Stwórz `src/modules/clients/components/ClientStats.tsx`

---

### **12. 👤 SZCZEGÓŁY KLIENTA**

**URL**: `/klienci/:id`  
**Plik**: `src/pages/ClientDetails.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppCard` - karty informacji
- `AppButton` - przyciski
- `AppTabs` - zakładki
- `AppSpace` - odstępy

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/clients/views/ClientDetailsView.tsx`
- [ ] Stwórz `src/modules/clients/components/ClientHeader.tsx`
- [ ] Stwórz `src/modules/clients/components/ClientTabs.tsx`
- [ ] Stwórz `src/modules/clients/components/ClientInfo.tsx`

---

### **13. 📅 KALENDARZ**

**URL**: `/calendar`  
**Plik**: `src/pages/CalendarPage.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppCard` - karty wydarzeń
- `AppButton` - przyciski
- `AppSelect` - filtry
- `AppSpace` - odstępy

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/calendar/views/CalendarView.tsx`
- [ ] Stwórz `src/modules/calendar/components/CalendarGrid.tsx`
- [ ] Stwórz `src/modules/calendar/components/EventCard.tsx`
- [ ] Stwórz `src/modules/calendar/components/CalendarFilters.tsx`

---

### **14. 📅 KALENDARZ PROJEKTÓW**

**URL**: `/calendar/projects`  
**Plik**: `src/pages/CalendarProjects.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppCard` - karty projektów
- `AppButton` - przyciski
- `AppSelect` - filtry

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/calendar/views/CalendarProjectsView.tsx`
- [ ] Stwórz `src/modules/calendar/components/ProjectCalendarGrid.tsx`
- [ ] Stwórz `src/modules/calendar/components/ProjectEventCard.tsx`

---

### **15. 📅 KALENDARZ PROJEKTANTÓW**

**URL**: `/calendar/designers`  
**Plik**: `src/pages/CalendarDesigners.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppCard` - karty projektantów
- `AppButton` - przyciski
- `AppSelect` - filtry

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/calendar/views/CalendarDesignersView.tsx`
- [ ] Stwórz `src/modules/calendar/components/DesignerCalendarGrid.tsx`
- [ ] Stwórz `src/modules/calendar/components/DesignerEventCard.tsx`

---

### **16. 📅 KALENDARZ ZESPOŁÓW**

**URL**: `/calendar/teams`  
**Plik**: `src/pages/CalendarTeams.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppCard` - karty zespołów
- `AppButton` - przyciski
- `AppSelect` - filtry

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/calendar/views/CalendarTeamsView.tsx`
- [ ] Stwórz `src/modules/calendar/components/TeamCalendarGrid.tsx`
- [ ] Stwórz `src/modules/calendar/components/TeamEventCard.tsx`

---

### **17. 🚚 PODWYKONAWCY**

**URL**: `/subcontractors`  
**Plik**: `src/pages/Subcontractors.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppCard` - karty podwykonawców
- `AppButton` - przyciski
- `AppSelect` - filtry
- `AppSpace` - odstępy

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/subcontractors/views/SubcontractorsView.tsx`
- [ ] Stwórz `src/modules/subcontractors/components/SubcontractorCard.tsx`
- [ ] Stwórz `src/modules/subcontractors/components/SubcontractorFilters.tsx`
- [ ] Stwórz `src/modules/subcontractors/components/SubcontractorStats.tsx`

---

### **18. 🛒 ZAPOTRZEBOWANIA**

**URL**: `/demands`  
**Plik**: `src/pages/Demands.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppCard` - karty zapotrzebowań
- `AppButton` - przyciski
- `AppSelect` - filtry
- `AppSpace` - odstępy

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/demands/views/DemandsView.tsx`
- [ ] Stwórz `src/modules/demands/components/DemandCard.tsx`
- [ ] Stwórz `src/modules/demands/components/DemandFilters.tsx`
- [ ] Stwórz `src/modules/demands/components/DemandStats.tsx`

---

### **19. ⚙️ USTAWIENIA**

**URL**: `/settings`  
**Plik**: `src/pages/Settings.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppCard` - karty ustawień
- `AppButton` - przyciski
- `AppForm` - formularze
- `AppSpace` - odstępy

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/settings/views/SettingsView.tsx`
- [ ] Stwórz `src/modules/settings/components/SettingsCard.tsx`
- [ ] Stwórz `src/modules/settings/components/SettingsForm.tsx`
- [ ] Stwórz `src/modules/settings/components/SettingsTabs.tsx`

---

### **20. 🎨 DASHBOARD PROJEKTANTA**

**URL**: `/designer`  
**Plik**: `src/pages/DesignerDashboard.tsx`  
**Status**: ❌ Używa starych komponentów  
**Komponenty używane**:

- `AppCard` - karty zadań
- `AppButton` - przyciski
- `AppSelect` - filtry
- `AppSpace` - odstępy

**Do refaktoryzacji**:

- [ ] Przenieś do `src/modules/design/views/DesignerDashboardView.tsx`
- [ ] Stwórz `src/modules/design/components/DesignerStats.tsx`
- [ ] Stwórz `src/modules/design/components/DesignerQuickActions.tsx`
- [ ] Stwórz `src/modules/design/components/DesignerTaskList.tsx`

---

## **📊 PODSUMOWANIE REFAKTORYZACJI**

### **Status komponentów App\***:

- ✅ **Używają App\* komponentów**: 3 strony (Dashboard, Projects, Tiles)
- ❌ **Używają starych komponentów**: 18 stron

### **Priorytet refaktoryzacji**:

1. **Wysoki**: Strony używające starych komponentów (18 stron)
2. **Średni**: Migracja do modułów domenowych
3. **Niski**: Optymalizacja już działających stron

### **Liczba komponentów do utworzenia**:

- **Atomy**: 15+ komponentów
- **Molekuły**: 25+ komponentów
- **Organizmy**: 60+ komponentów
- **Widoki**: 20+ komponentów

### **Szacowany czas refaktoryzacji**:

- **Faza 1** (Atomy + Layouty): 2-3 dni
- **Faza 2** (Molekuły): 2-3 dni
- **Faza 3** (Moduły domenowe): 5-7 dni
- **Faza 4** (Strony): 3-4 dni
- **Faza 5** (Finalizacja): 1-2 dni

**Łączny czas**: 13-19 dni roboczych

---

## **🎯 NASTĘPNE KROKI**

1. **Rozpocznij od Fazy 1**: Stwórz wszystkie atomy i layouty
2. **Przetestuj atomy**: Upewnij się, że działają poprawnie
3. **Przejdź do Fazy 2**: Stwórz molekuły
4. **Rozpocznij migrację**: Zacznij od modułu Projects (najbardziej używany)
5. **Iteracyjnie refaktoryzuj**: Jedna strona na raz

**Ten plan zapewnia structured approach do uporządkowania całej struktury UI aplikacji FabManage-Clean.**
