Plan Refaktoryzacji UI Aplikacji FabManage

1. Podsumowanie i Cele
   Cel nadrzędny: Przeprowadzenie kompleksowej restrukturyzacji kodu frontendowego aplikacji FabManage w oparciu o metodologię Atomic Design oraz architekturę zorientowaną na domeny biznesowe.

Aktualny problem: Obecna struktura UI, choć funkcjonalna, miesza ze sobą komponenty o różnym poziomie abstrakcji i odpowiedzialności. Generyczne elementy UI są przemieszane z logiką biznesową, co utrudnia reużywalność, spójność wizualną i wprowadza chaos w miarę rozwoju projektu.

Oczekiwane rezultaty:

Klarowność i Porządek: Każdy komponent będzie miał swoje precyzyjnie określone miejsce i odpowiedzialność.

Maksymalna Reużywalność: Stworzenie biblioteki generycznych, niezależnych od logiki biznesowej komponentów (Atomów i Molekuł).

Spójność Wizualna (Consistency): Ujednolicenie wyglądu i zachowania elementów UI w całej aplikacji poprzez centralizację stylów w Atomach.

Skalowalność: Łatwość dodawania nowych funkcjonalności bez obawy o naruszenie istniejącej struktury.

Szybkość Rozwoju: Deweloperzy będą mogli składać nowe widoki z gotowych, przetestowanych "klocków", co znacząco przyspieszy pracę.

2. Docelowa Struktura Katalogów UI
   Wprowadzamy trójwarstwową strukturę w katalogu src/:

src/
├── components/ # (1) BIBLIOTEKA REUŻYWALNYCH KOMPONENTÓW
│ ├── ui/ # Atomy: Podstawowe, czyste elementy UI (np. AppButton, AppInput, Divider).
│ ├── layouts/ # Układy: Komponenty strukturalne (np. PageLayout, ResizableLayout).
│ └── shared/ # Molekuły: Złożone, ale wciąż generyczne komponenty (np. SearchInput, EntityTable).
│
├── modules/ # (2) MODUŁY BIZNESOWE (DOMENY)
│ ├── projects/ # Wszystko, co dotyczy TYLKO projektów.
│ │ ├── components/ # Organizmy: Złożone komponenty specyficzne dla projektów (np. ProjectCard).
│ │ └── views/ # Widoki: Kompozycje organizmów (np. ProjectsList).
│ ├── materials/ # Wszystko, co dotyczy TYLKO materiałów.
│ │ ├── components/ # (np. MaterialCard, CategorySidebar)
│ │ └── views/ # (np. WarehouseGrid)
│ └── ... # (kolejne moduły: tiles, cnc, clients, etc.)
│
└── pages/ # (3) STRONY (WIDOKI POD ADRESAMI URL)
├── DashboardPage.tsx
├── ProjectsPage.tsx
└── SingleProjectPage.tsx
└── ...

3. Strategia Budowania Layoutu
   Aby zapewnić spójność i elastyczność, przyjmujemy następujące zasady korzystania z komponentów layoutowych Ant Design:

<Layout>, <Sider>, <Content>: Będą używane jako podstawa dla naszych głównych komponentów w src/components/layouts/. To fundament struktury całej strony.

<Grid> (<Row>, <Col>): Używany do makro-layoutu – rozmieszczania głównych bloków (organizmów i widoków) na stronie. Jest to podstawowe narzędzie do tworzenia responsywnych układów kolumnowych, które poprawnie adaptują się do różnych rozmiarów ekranu.

<Flex>: Używany do mikro-layoutu – pozycjonowania elementów wewnątrz komponentów (np. w nagłówku karty, w pasku narzędzi). Idealny do wyrównywania i dystrybucji mniejszych elementów w jednej osi.

<Space>: Preferowane narzędzie do tworzenia odstępów między elementami w rzędzie lub kolumnie (np. między przyciskami w Toolbarze). Zastępuje ręczne dodawanie marginesów, zapewniając spójne odstępy.

<Divider>: Używany jako Atom do wizualnego oddzielania treści.

<Splitter>: Używany do tworzenia interaktywnych, dynamicznych layoutów, gdzie użytkownik może samodzielnie zmieniać rozmiar paneli (np. widok master-detail).

Faza 1: Budowa Fundamentów – Atomy i Layouty
Cel: Stworzenie biblioteki podstawowych, w pełni reużywalnych komponentów UI.

1.1. Tworzenie Atomów (src/components/ui/)
Dla każdego poniższego komponentu: utwórz plik, wklej kod bazowy i dodaj eksport do src/components/ui/index.ts.

AppButton.tsx:

Zadanie: Stwórz wrapper na <Button> z antd, który będzie domyślnie korzystał z motywu aplikacji.

Lokalizacja: src/components/ui/AppButton.tsx

AppInput.tsx:

Zadanie: Stwórz wrapper na <Input>, <Input.Password> i <Input.TextArea> z antd dla spójnego wyglądu.

Lokalizacja: src/components/ui/AppInput.tsx

Typography.tsx:

Zadanie: Stwórz komponenty typograficzne (H1, H2, P, Caption etc.) bazujące na design-tokens.json.

Lokalizacja: src/components/ui/Typography.tsx

Icon.tsx:

Zadanie: Stwórz generyczny komponent do renderowania ikon (np. z biblioteki lucide-react).

Lokalizacja: src/components/ui/Icon.tsx

AppDivider.tsx:

Zadanie: Stwórz wrapper na <Divider> z antd dla spójnych separatorów.

Lokalizacja: src/components/ui/AppDivider.tsx

Migracja istniejących Atomów:

Przenieś src/components/Ui/StatusBadge.tsx do src/components/ui/StatusBadge.tsx. Zaktualizuj importy.

Przenieś src/components/Ui/LoadingSpinner.tsx do src/components/ui/LoadingSpinner.tsx. Zaktualizuj importy.

Przenieś src/components/Ui/ErrorMessage.tsx do src/components/ui/ErrorMessage.tsx. Zaktualizuj importy.

1.2. Tworzenie Layoutów (src/components/layouts/)
PageLayout.tsx:

Zadanie: Stwórz komponent oparty na <Layout> i <Layout.Content> z antd, który będzie głównym kontenerem dla treści strony, zarządzającym paddingiem.

Lokalizacja: src/components/layouts/PageLayout.tsx

ResizableLayout.tsx:

Zadanie: Stwórz komponent z użyciem <Splitter> z antd, który przyjmuje leftPanel i rightPanel jako propsy, umożliwiając dynamiczną zmianę ich szerokości.

Lokalizacja: src/components/layouts/ResizableLayout.tsx

Migracja BrandedSidebar:

Przenieś src/components/Layout/BrandedSidebar.tsx do src/components/layouts/BrandedSidebar.tsx.

Zrefaktoryzuj ten komponent, aby jego głównym elementem był <Layout.Sider> z antd.

Faza 2: Budowa Komponentów Współdzielonych
Cel: Stworzenie bardziej złożonych, ale wciąż generycznych komponentów, które będą używane w wielu modułach.

2.1. Tworzenie i Migracja Molekuł (src/components/shared/)
PageHeader.tsx:

Zadanie: Stwórz komponent, który będzie składał się z atomów Typography (dla tytułu) oraz Space z antd (dla grupy przycisków akcji).

Lokalizacja: src/components/shared/PageHeader.tsx

SearchInput.tsx:

Zadanie: Stwórz komponent łączący AppInput oraz Icon.

Lokalizacja: src/components/shared/SearchInput.tsx

StatCard.tsx:

Zadanie: Stwórz małą kartę do wyświetlania statystyk. Powinna składać się z Icon i Typography.

Lokalizacja: src/components/shared/StatCard.tsx

Migracja istniejących komponentów:

Przenieś src/components/Ui/EntityTable.tsx do src/components/shared/EntityTable.tsx.

Przenieś src/components/Ui/KanbanBoardGeneric.tsx do src/components/shared/KanbanBoardGeneric.tsx.

Przenieś src/components/Ui/SlideOver.tsx do src/components/shared/SlideOver.tsx.

Refaktoryzuj powyższe komponenty, aby korzystały z nowo utworzonych Atomów (np. AppButton zamiast Button).

Faza 3: Refaktoryzacja Modułów Domenowych
Cel: Przebudowa istniejącego UI na nową, modularną strukturę. Wykonuj operacje moduł po module.

3.1. Moduł: Projekty (src/modules/projects/)
Migracja plików:

Przenieś zawartość src/components/Project/ do src/modules/projects/components/.

Przenieś src/components/Gantt/ProjectGanttChart.tsx do src/modules/projects/views/ProjectGanttView.tsx.

Przenieś src/components/EditProjectModal.tsx do src/modules/projects/components/EditProjectModal.tsx.

Refaktoryzacja ProjectCard.tsx:

Otwórz src/modules/projects/components/ProjectCard.tsx.

Użyj <Flex> do rozmieszczenia elementów wewnątrz karty.

Zastąp wszystkie elementy tekstowe odpowiednimi komponentami z Typography.

Użyj <StatusBadge> z src/components/ui/.

Użyj <Space> do zarządzania odstępami między przyciskami lub innymi elementami.

Refaktoryzacja pozostałych komponentów modułu: Postępuj analogicznie z ProjectHeader.tsx, ProjectTabs.tsx itd., konsekwentnie zastępując stary kod nowymi Atomami i Molekułami.

3.2. Moduł: Materiały (src/modules/materials/)
Migracja plików:

Przenieś zawartość src/components/Magazyn/ do src/modules/materials/components/.

Przenieś src/components/MaterialAssignmentModal.tsx do src/modules/materials/components/MaterialAssignmentModal.tsx.

Refaktoryzacja MaterialCard.tsx:

Otwórz src/modules/materials/components/MaterialCard.tsx.

Zastosuj Flex i Space do pozycjonowania.

Użyj atomów Typography i AppButton.

Stworzenie widoku WarehouseView.tsx:

Utwórz plik src/modules/materials/views/WarehouseView.tsx.

Przenieś do niego logikę z obecnej strony MagazynV3.tsx, która jest odpowiedzialna za składanie CategorySidebar i siatki materiałów.

3.3. Pozostałe moduły
Postępuj według tego samego wzorca dla pozostałych domen:

Tiles: Przenieś komponenty z src/components/Tiles/.

Production: Przenieś src/components/Kanban/.

... i tak dalej dla Clients, Subcontractors etc.

Faza 4: Kompozycja Stron
Cel: Uproszczenie komponentów w src/pages/, aby pełniły jedynie rolę "składaczy" layoutu i widoków z modułów.

Refaktoryzacja ProjectsPage.tsx:

Zmień nazwę pliku src/pages/Projects.tsx na ProjectsPage.tsx.

Zastąp jego zawartość. Strona ma importować PageLayout, BrandedSidebar oraz widok ProjectsList z modułu projects. Jej zadaniem jest pobranie danych i przekazanie ich do widoku.

Refaktoryzacja SingleProjectPage.tsx:

Zmień nazwę pliku src/pages/Projekt.tsx na SingleProjectPage.tsx.

Strona ma składać się z PageLayout, BrandedSidebar, a w treści z ProjectHeader i ProjectTabs z modułu projects. Logika przełączania zakładek pozostaje tutaj.

Refaktoryzacja WarehousePage.tsx:

Zmień nazwę src/pages/MagazynV3.tsx na WarehousePage.tsx.

Zastąp jej zawartość. Powinna używać ResizableLayout z src/components/layouts, w którym leftPanel to CategorySidebar, a rightPanel to WarehouseView z modułu materials.

Kontynuuj ten proces dla wszystkich pozostałych stron, mapując je na odpowiednie widoki z nowej struktury modułowej.

Faza 5: Oczyszczanie i Weryfikacja
Cel: Finalizacja procesu i upewnienie się, że aplikacja działa poprawnie.

Usunięcie starych katalogów: Po upewnieniu się, że wszystkie komponenty zostały przeniesione i zrefaktoryzowane, usuń stare, puste foldery z src/components/ (np. Ui, Layout, Project, Magazyn, Gantt itd.).

Weryfikacja statyczna:

Uruchom w terminalu npm run lint -- --fix.

Uruchom npm run type-check.

Weryfikacja funkcjonalna:

Uruchom aplikację (npm run dev) i manualnie przeklikaj wszystkie strony, aby upewnić się, że UI renderuje się poprawnie.

Uruchom wszystkie testy za pomocą npm run test, ze szczególnym uwzględnieniem testów wizualnych Playwright, aby wychwycić ewentualne regresje w wyglądzie.

Faza 6: Dalsze Kroki i Nowe Zadania (Post-Refactoring)
Cel: Po zakończeniu refaktoryzacji, ta sekcja definiuje priorytetowe zadania deweloperskie, które należy podjąć, aby wykorzystać nową, czystą architekturę do budowy kluczowych funkcjonalności.

6.1. Backend i Dane
[ ] Task: Finalizacja Logiki Biznesowej w Supabase

Opis: Zaimplementuj brakujące funkcje PostgreSQL (RPC), triggery (np. do aktualizacji stanów magazynowych) oraz polityki Row Level Security (RLS) dla wszystkich tabel. Zapewnij, że dostęp do danych jest ściśle kontrolowany na poziomie bazy danych.

Kryteria akceptacji: Wszystkie operacje CRUD na danych są zabezpieczone przez RLS. Kluczowe procesy (jak rezerwacja materiału) są obsługiwane przez funkcje RPC.

[ ] Task: Pełna Implementacja Usług Frontendowych

Opis: Przejrzyj wszystkie pliki w src/services/. Upewnij się, że każda funkcja komunikuje się z odpowiednim endpointem Supabase (lub lokalnym API) i poprawnie obsługuje dane oraz błędy.

Kryteria akceptacji: Aplikacja w trybie deweloperskim jest w pełni funkcjonalna, a wszystkie operacje na danych działają zgodnie z oczekiwaniami.

6.2. Rozwój Kluczowych Modułów
[ ] Task: Implementacja Modułu CNC

Opis: W module src/modules/cnc/ stwórz logikę do parsowania plików .dxf w celu estymacji czasu cięcia i zużycia materiału. Zbuduj widok kolejki produkcyjnej dla maszyn CNC z możliwością zarządzania priorytetami.

Kryteria akceptacji: Użytkownik może wgrać plik DXF, system poprawnie analizuje go i dodaje zadanie do kolejki produkcyjnej.

[ ] Task: Rozbudowa Modułu Logistyki

Opis: W src/modules/logistics/ zaprojektuj i zaimplementuj interfejs do tworzenia list przewozowych (packing lists), planowania tras oraz przydzielania zadań montażowych.

Kryteria akceptacji: Manager logistyki może stworzyć listę przewozową dla danego projektu i przypisać ją do konkretnego transportu.

[ ] Task: Budowa Dashboardu Analitycznego

Opis: W src/modules/dashboard/ stwórz widoki prezentujące kluczowe wskaźniki wydajności (KPI), takie jak: rentowność projektów, wykorzystanie zasobów, statusy materiałowe.

Kryteria akceptacji: Strona główna (DashboardPage) wyświetla interaktywne wykresy i statystyki podsumowujące stan firmy.

6.3. Jakość i Dokumentacja
[ ] Task: Zwiększenie Pokrycia Testami

Opis: Napisz testy jednostkowe dla kluczowej logiki biznesowej w stores i services. Rozszerz istniejące testy E2E (Playwright) o nowe scenariusze, takie jak pełny cykl życia projektu od A do Z.

Kryteria akceptacji: Pokrycie kodu testami dla kluczowych modułów wynosi co najmniej 70%.

[ ] Task: Stworzenie Dokumentacji Użytkownika

Opis: Przygotuj zestaw prostych poradników (np. w formie plików Markdown w katalogu /docs/user-guides/) wyjaśniających, jak korzystać z podstawowych funkcji aplikacji.

Kryteria akceptacji: Powstają co najmniej trzy poradniki: "Jak dodać nowy projekt?", "Jak zarządzać magazynem?", "Jak śledzić postęp produkcji?".

Po zakończeniu tych kroków, aplikacja będzie nie tylko miała solidną architekturę, ale również będzie w pełni funkcjonalna i gotowa na wdrożenie produkcyjne.
