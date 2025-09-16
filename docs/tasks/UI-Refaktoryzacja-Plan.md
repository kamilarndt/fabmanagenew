# **Plan Refaktoryzacji UI - FabManage-Clean**

**Atomic Design + Domain-Driven Architecture**

---

## **🎯 CEL GŁÓWNY**

Przeprowadzenie kompleksowej restrukturyzacji kodu frontendowego aplikacji FabManage w oparciu o metodologię Atomic Design oraz architekturę zorientowaną na domeny biznesowe.

## **📋 PROBLEM DO ROZWIĄZANIA**

Obecna struktura UI miesza ze sobą komponenty o różnym poziomie abstrakcji i odpowiedzialności. Generyczne elementy UI są przemieszane z logiką biznesową, co utrudnia reużywalność, spójność wizualną i wprowadza chaos w miarę rozwoju projektu.

## **✅ OCZEKIWANE REZULTATY**

- **Klarowność i Porządek**: Każdy komponent będzie miał swoje precyzyjnie określone miejsce i odpowiedzialność
- **Maksymalna Reużywalność**: Stworzenie biblioteki generycznych, niezależnych od logiki biznesowej komponentów
- **Spójność Wizualna**: Ujednolicenie wyglądu i zachowania elementów UI w całej aplikacji
- **Skalowalność**: Łatwość dodawania nowych funkcjonalności bez naruszenia istniejącej struktury
- **Szybkość Rozwoju**: Deweloperzy będą mogli składać nowe widoki z gotowych, przetestowanych "klocków"

---

## **🏗️ DOCELOWA STRUKTURA KATALOGÓW**

```
src/
├── components/           # (1) BIBLIOTEKA REUŻYWALNYCH KOMPONENTÓW
│   ├── ui/              # Atomy: Podstawowe, czyste elementy UI
│   ├── layouts/         # Układy: Komponenty strukturalne
│   └── shared/          # Molekuły: Złożone, ale wciąż generyczne komponenty
│
├── modules/             # (2) MODUŁY BIZNESOWE (DOMENY)
│   ├── projects/        # Wszystko, co dotyczy TYLKO projektów
│   │   ├── components/  # Organizmy: Złożone komponenty specyficzne dla projektów
│   │   └── views/       # Widoki: Kompozycje organizmów
│   ├── materials/       # Wszystko, co dotyczy TYLKO materiałów
│   │   ├── components/  # (np. MaterialCard, CategorySidebar)
│   │   └── views/       # (np. WarehouseGrid)
│   └── ...              # (kolejne moduły: tiles, cnc, clients, etc.)
│
└── pages/               # (3) STRONY (WIDOKI POD ADRESAMI URL)
    ├── DashboardPage.tsx
    ├── ProjectsPage.tsx
    └── SingleProjectPage.tsx
```

---

## **📝 INSTRUKCJE WYKONANIA**

### **FAZA 1: Budowa Fundamentów – Atomy i Layouty**

#### **1.1. Tworzenie Atomów (src/components/ui/)**

**Zadanie 1.1.1: AppButton.tsx**

- **Lokalizacja**: `src/components/ui/AppButton.tsx`
- **Zadanie**: Stwórz wrapper na `<Button>` z antd, który będzie domyślnie korzystał z motywu aplikacji
- **Wymagania**:
  - Wszystkie warianty Ant Design (primary, default, dashed, text, link)
  - Wszystkie rozmiary (small, middle, large)
  - Wsparcie dla ikon i loading state
  - TypeScript interfaces

**Zadanie 1.1.2: AppInput.tsx**

- **Lokalizacja**: `src/components/ui/AppInput.tsx`
- **Zadanie**: Stwórz wrapper na `<Input>`, `<Input.Password>` i `<Input.TextArea>` z antd
- **Wymagania**:
  - Wszystkie warianty inputów
  - Wsparcie dla prefix/suffix
  - Wsparcie dla statusów (error, warning, success)
  - TypeScript interfaces

**Zadanie 1.1.3: Typography.tsx**

- **Lokalizacja**: `src/components/ui/Typography.tsx`
- **Zadanie**: Stwórz komponenty typograficzne (H1, H2, P, Caption etc.) bazujące na design-tokens.json
- **Wymagania**:
  - Wszystkie poziomy nagłówków
  - Różne wagi czcionek
  - Wsparcie dla kolorów i statusów
  - Responsive typography

**Zadanie 1.1.4: Icon.tsx**

- **Lokalizacja**: `src/components/ui/Icon.tsx`
- **Zadanie**: Stwórz generyczny komponent do renderowania ikon
- **Wymagania**:
  - Wsparcie dla Ant Design icons
  - Wsparcie dla custom icons
  - Wsparcie dla rozmiarów i kolorów
  - TypeScript interfaces

**Zadanie 1.1.5: AppDivider.tsx**

- **Lokalizacja**: `src/components/ui/AppDivider.tsx`
- **Zadanie**: Stwórz wrapper na `<Divider>` z antd dla spójnych separatorów
- **Wymagania**:
  - Wszystkie warianty dividerów
  - Wsparcie dla tekstu w środku
  - Wsparcie dla orientacji (horizontal, vertical)

**Zadanie 1.1.6: Migracja istniejących Atomów**

- Przenieś `src/components/Ui/StatusBadge.tsx` → `src/components/ui/StatusBadge.tsx`
- Przenieś `src/components/Ui/LoadingSpinner.tsx` → `src/components/ui/LoadingSpinner.tsx`
- Przenieś `src/components/Ui/ErrorMessage.tsx` → `src/components/ui/ErrorMessage.tsx`
- Zaktualizuj wszystkie importy w aplikacji

#### **1.2. Tworzenie Layoutów (src/components/layouts/)**

**Zadanie 1.2.1: PageLayout.tsx**

- **Lokalizacja**: `src/components/layouts/PageLayout.tsx`
- **Zadanie**: Stwórz komponent oparty na `<Layout>` i `<Layout.Content>` z antd
- **Wymagania**:
  - Główny kontener dla treści strony
  - Zarządzanie paddingiem i marginesami
  - Wsparcie dla różnych wariantów layoutu
  - TypeScript interfaces

**Zadanie 1.2.2: ResizableLayout.tsx**

- **Lokalizacja**: `src/components/layouts/ResizableLayout.tsx`
- **Zadanie**: Stwórz komponent z użyciem `<Splitter>` z antd
- **Wymagania**:
  - Przyjmuje leftPanel i rightPanel jako propsy
  - Umożliwia dynamiczną zmianę szerokości paneli
  - Wsparcie dla różnych orientacji
  - TypeScript interfaces

**Zadanie 1.2.3: Migracja BrandedSidebar**

- Przenieś `src/components/Layout/BrandedSidebar.tsx` → `src/components/layouts/BrandedSidebar.tsx`
- Zrefaktoryzuj komponent, aby głównym elementem był `<Layout.Sider>` z antd
- Zaktualizuj wszystkie importy

### **FAZA 2: Budowa Komponentów Współdzielonych**

#### **2.1. Tworzenie i Migracja Molekuł (src/components/shared/)**

**Zadanie 2.1.1: PageHeader.tsx**

- **Lokalizacja**: `src/components/shared/PageHeader.tsx`
- **Zadanie**: Stwórz komponent składający się z atomów Typography i Space z antd
- **Wymagania**:
  - Tytuł strony
  - Grupa przycisków akcji
  - Wsparcie dla breadcrumbs
  - TypeScript interfaces

**Zadanie 2.1.2: SearchInput.tsx**

- **Lokalizacja**: `src/components/shared/SearchInput.tsx`
- **Zadanie**: Stwórz komponent łączący AppInput oraz Icon
- **Wymagania**:
  - Pole wyszukiwania z ikoną
  - Wsparcie dla debounce
  - Wsparcie dla różnych wariantów
  - TypeScript interfaces

**Zadanie 2.1.3: StatCard.tsx**

- **Lokalizacja**: `src/components/shared/StatCard.tsx`
- **Zadanie**: Stwórz małą kartę do wyświetlania statystyk
- **Wymagania**:
  - Składa się z Icon i Typography
  - Wsparcie dla różnych wariantów
  - Wsparcie dla animacji
  - TypeScript interfaces

**Zadanie 2.1.4: Migracja istniejących komponentów**

- Przenieś `src/components/Ui/EntityTable.tsx` → `src/components/shared/EntityTable.tsx`
- Przenieś `src/components/Ui/KanbanBoardGeneric.tsx` → `src/components/shared/KanbanBoardGeneric.tsx`
- Przenieś `src/components/Ui/SlideOver.tsx` → `src/components/shared/SlideOver.tsx`
- Refaktoryzuj powyższe komponenty, aby korzystały z nowo utworzonych Atomów

### **FAZA 3: Refaktoryzacja Modułów Domenowych**

#### **3.1. Moduł: Projekty (src/modules/projects/)**

**Zadanie 3.1.1: Migracja plików**

- Przenieś zawartość `src/components/Project/` → `src/modules/projects/components/`
- Przenieś `src/components/Gantt/ProjectGanttChart.tsx` → `src/modules/projects/views/ProjectGanttView.tsx`
- Przenieś `src/components/EditProjectModal.tsx` → `src/modules/projects/components/EditProjectModal.tsx`

**Zadanie 3.1.2: Refaktoryzacja ProjectCard.tsx**

- Otwórz `src/modules/projects/components/ProjectCard.tsx`
- Użyj `<Flex>` do rozmieszczenia elementów wewnątrz karty
- Zastąp wszystkie elementy tekstowe odpowiednimi komponentami z Typography
- Użyj `<StatusBadge>` z `src/components/ui/`
- Użyj `<Space>` do zarządzania odstępami między przyciskami

**Zadanie 3.1.3: Refaktoryzacja pozostałych komponentów modułu**

- Postępuj analogicznie z ProjectHeader.tsx, ProjectTabs.tsx itd.
- Konsekwentnie zastępuj stary kod nowymi Atomami i Molekułami

#### **3.2. Moduł: Materiały (src/modules/materials/)**

**Zadanie 3.2.1: Migracja plików**

- Przenieś zawartość `src/components/Magazyn/` → `src/modules/materials/components/`
- Przenieś `src/components/MaterialAssignmentModal.tsx` → `src/modules/materials/components/MaterialAssignmentModal.tsx`

**Zadanie 3.2.2: Refaktoryzacja MaterialCard.tsx**

- Otwórz `src/modules/materials/components/MaterialCard.tsx`
- Zastosuj Flex i Space do pozycjonowania
- Użyj atomów Typography i AppButton

**Zadanie 3.2.3: Stworzenie widoku WarehouseView.tsx**

- Utwórz plik `src/modules/materials/views/WarehouseView.tsx`
- Przenieś logikę z obecnej strony MagazynV3.tsx
- Składa się z CategorySidebar i siatki materiałów

#### **3.3. Pozostałe moduły**

Postępuj według tego samego wzorca dla pozostałych domen:

- **Tiles**: Przenieś komponenty z `src/components/Tiles/`
- **Production**: Przenieś `src/components/Kanban/`
- **Clients, Subcontractors**: Analogicznie

### **FAZA 4: Kompozycja Stron**

#### **4.1. Refaktoryzacja ProjectsPage.tsx**

- Zmień nazwę pliku `src/pages/Projects.tsx` → `ProjectsPage.tsx`
- Zastąp zawartość: importuj PageLayout, BrandedSidebar oraz widok ProjectsList z modułu projects
- Zadaniem strony jest pobranie danych i przekazanie ich do widoku

#### **4.2. Refaktoryzacja SingleProjectPage.tsx**

- Zmień nazwę pliku `src/pages/Projekt.tsx` → `SingleProjectPage.tsx`
- Strona składa się z PageLayout, BrandedSidebar, a w treści z ProjectHeader i ProjectTabs z modułu projects
- Logika przełączania zakładek pozostaje tutaj

#### **4.3. Refaktoryzacja WarehousePage.tsx**

- Zmień nazwę `src/pages/MagazynV3.tsx` → `WarehousePage.tsx`
- Zastąp zawartość: używa ResizableLayout z `src/components/layouts`
- leftPanel to CategorySidebar, rightPanel to WarehouseView z modułu materials

#### **4.4. Kontynuacja dla wszystkich pozostałych stron**

Mapuj je na odpowiednie widoki z nowej struktury modułowej

### **FAZA 5: Oczyszczanie i Weryfikacja**

#### **5.1. Usunięcie starych katalogów**

Po upewnieniu się, że wszystkie komponenty zostały przeniesione i zrefaktoryzowane:

- Usuń stare, puste foldery z `src/components/` (np. Ui, Layout, Project, Magazyn, Gantt itd.)

#### **5.2. Weryfikacja statyczna**

- Uruchom `npm run lint -- --fix`
- Uruchom `npm run type-check`

#### **5.3. Weryfikacja funkcjonalna**

- Uruchom aplikację (`npm run dev`) i manualnie przeklikaj wszystkie strony
- Uruchom wszystkie testy za pomocą `npm run test`
- Uruchom testy wizualne Playwright

---

## **🎯 KRYTERIA SUKCESU**

### **Faza 1 - Fundamenty**

- [ ] Wszystkie atomy utworzone i działają poprawnie
- [ ] Layouty działają i są responsywne
- [ ] Brak błędów TypeScript
- [ ] Wszystkie importy zaktualizowane

### **Faza 2 - Komponenty współdzielone**

- [ ] Molekuły utworzone i działają poprawnie
- [ ] Migracja istniejących komponentów zakończona
- [ ] Wszystkie komponenty używają nowych atomów

### **Faza 3 - Moduły domenowe**

- [ ] Wszystkie moduły zrefaktoryzowane
- [ ] Komponenty używają nowej struktury
- [ ] Brak duplikacji kodu

### **Faza 4 - Strony**

- [ ] Wszystkie strony zrefaktoryzowane
- [ ] Strony używają nowych layoutów i widoków
- [ ] Routing działa poprawnie

### **Faza 5 - Finalizacja**

- [ ] Stare katalogi usunięte
- [ ] Wszystkie testy przechodzą
- [ ] Aplikacja działa bez błędów
- [ ] Performance nie uległ pogorszeniu

---

## **📚 DODATKOWE ZASOBY**

### **Design Tokens**

- Użyj `src/styles/design-tokens.json` jako źródła prawdy dla stylów
- Wszystkie komponenty muszą być zgodne z tokenami

### **Ant Design Components**

- Wszystkie komponenty muszą być wrapperami na Ant Design
- Zachowaj pełną kompatybilność z API Ant Design
- Dodaj własne enhancements i business logic

### **TypeScript**

- Wszystkie komponenty muszą mieć pełne type definitions
- Użyj strict mode TypeScript
- Unikaj `any` i `unknown`

### **Testing**

- Każdy komponent musi mieć testy jednostkowe
- Użyj React Testing Library
- Testuj accessibility i user interactions

---

## **🚀 NASTĘPNE KROKI PO REFAKTORYZACJI**

1. **Backend i Dane**: Finalizacja logiki biznesowej w Supabase
2. **Rozwój Modułów**: Implementacja kluczowych funkcjonalności
3. **Jakość**: Zwiększenie pokrycia testami
4. **Dokumentacja**: Stworzenie dokumentacji użytkownika

---

**Ten plan zapewnia structured approach do budowy scalable i maintainable UI foundation dla aplikacji FabManage.**
