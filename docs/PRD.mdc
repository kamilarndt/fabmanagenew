### **Dokument Wymagań Produktu (PRD): FabrykaManage V 2.0**

**Wersja:** 1.0
**Data:** 31.08.2025
**Autor:** Kamil Arndt, UI/UX Designer & Project Lead
**Status:** Wersja do implementacji

---

### **1. Wprowadzenie i Wizja Produktu**

#### **1.1. Tło i Problem Biznesowy**
Fabryka Dekoracji jest liderem na polskim rynku produkcji scenografii, realizującym złożone projekty dla czołowych stacji telewizyjnych (TVP, TVN, Polsat), prestiżowych muzeów oraz na potrzeby międzynarodowych targów. Wraz ze wzrostem skali i złożoności projektów, firma napotyka na krytyczne problemy operacyjne, które hamują jej efektywność i rentowność:

* **Chaos Informacyjny:** Kluczowe dane projektowe są rozproszone pomiędzy e-mailami, telefonami a osobistymi notatkami. Prowadzi to do kosztownych błędów, nieporozumień między działem projektowym, produkcją (CNC, montaż) i zarządem oraz opóźnień.
* **Nietrafne Wyceny:** Brak scentralizowanej, historycznej bazy danych o kosztach materiałów i czasochłonności zadań sprawia, że wyceny są często niedokładne, co bezpośrednio wpływa na marżowość projektów.
* **Brak Przejrzystości Procesu:** Zarządzanie produkcją odbywa się w sposób manualny. Brak jest wglądu w czasie rzeczywistym w postęp prac, obłożenie maszyn czy realne zapotrzebowanie na materiały, co uniemożliwia proaktywne zarządzanie ryzykiem.

#### **1.2. Wizja Produktu**
**FabrykaManage V 2.0** ma stać się zintegrowanym, centralnym systemem operacyjnym dla Fabryki Dekoracji. Ma to być narzędzie, które przekształci chaos w uporządkowany, transparentny i mierzalny proces – od pierwszego zapytania klienta aż po finalny montaż scenografii.

#### **1.3. Kluczowa Koncepcja: System "Kafelkowania"**
Fundamentem całej aplikacji jest autorska metodologia **"kafelkowania"**. Każdy projekt, niezależnie od jego skali (np. wielostrefowe **Muzeum Smart Kids Planet** czy technicznie zaawansowane **Studio TV**), jest dekomponowany na najmniejsze, atomowe jednostki produkcyjne – **"kafelki"**.

* **Kafelek** to pojedynczy, śledzony obiekt w systemie (np. panel ściany, element mebla, konstrukcja nośna), który przechodzi przez 11-etapowy cykl życia, od "Przyjęty" do "Gotowe".

---

### **2. Persony Użytkowników**

* **Kamil, Kierownik Działu Projektowego (Użytkownik Główny):**
    * **Cel:** Efektywne zarządzanie złożonymi projektami i 6-osobowym zespołem. Potrzebuje narzędzia, które narzuci strukturę i porządek, minimalizując ryzyko przeoczenia detali, co jest kluczowe w kontekście jego zdiagnozowanego ADHD.
    * **Frustracje:** Perfekcjonizm prowadzący do paraliżu; trudności z szacowaniem czasu; stres związany z utrzymaniem kontroli nad wieloma zadaniami jednocześnie.
    * **Wymagania wobec aplikacji:** Musi być intuicyjna, wizualna i dzielić pracę na małe, zarządzalne kroki (kafelki). Musi automatyzować powtarzalne czynności (np. generowanie list materiałowych).

* **Operator Maszyny CNC (Pracownik Produkcyjny):**
    * **Cel:** Otrzymanie jasnej, priorytetyzowanej listy zadań do wykonania na swojej maszynie.
    * **Frustracje:** Otrzymywanie niekompletnych plików produkcyjnych; niejasne priorytety; przestoje spowodowane brakiem materiału.
    * **Wymagania wobec aplikacji:** Prosty, czytelny interfejs w formie tablicy Kanban z bezpośrednim dostępem do plików `.dxf` i specyfikacji materiałowej dla każdego zadania.

* **Marcin, Prezes (Zarząd):**
    * **Cel:** Uzyskanie szybkiego, wysokopoziomowego wglądu w kluczowe wskaźniki biznesowe.
    * **Frustracje:** Brak realnego wglądu w rentowność poszczególnych projektów i obłożenie produkcji.
    * **Wymagania wobec aplikacji:** Przejrzysty Dashboard z wizualizacją KPI: marżowość projektów, wykorzystanie zasobów, statusy kluczowych zleceń.

---

### **3. Wymagania Funkcjonalne (Features & User Stories)**

#### **3.1. Moduł: Zarządzanie Projektami i Klientami (CRM)**
* **F-1: Modułowe Tworzenie Projektu**
    * **Opis:** Użytkownik może stworzyć nowy projekt, podając jego nazwę, przypisując klienta i wybierając, które moduły (etapy) będą aktywne od początku (np. "Wycena", "Koncepcja", "Produkcja").
    * **User Story:** Jako Kierownik Projektu, chcę móc stworzyć projekt obejmujący na start tylko "Wycenę", a po akceptacji klienta dołożyć moduł "Produkcji", aby system odzwierciedlał realny cykl życia zlecenia.

* **F-2: Repozytorium Projektów**
    * **Opis:** Główny widok aplikacji z listą wszystkich projektów, przedstawionych w formie interaktywnych kart. Widok musi umożliwiać wyszukiwanie i zaawansowane filtrowanie (po statusie, kliencie, dacie).

#### **3.2. Moduł: Widok Pojedynczego Projektu**
* **F-3: Zakładka "Kafelki / Produkcja"**
    * **Opis:** Serce aplikacji. Musi wyświetlać wszystkie kafelki danego projektu w formie siatki. Użytkownik może dodawać nowe i edytować istniejące kafelki.
    * **User Story:** Jako Projektant, po zaimportowaniu modelu 3D, chcę móc podzielić go na kafelki, a następnie do każdego kafelka dołączyć plik `.dxf` i przypisać materiał z bazy.

* **F-4: Edycja Kafelka**
    * **Opis:** Modal `TileEditModal.tsx` musi pozwalać na pełną edycję atrybutów kafelka: nazwy, strefy, statusu, przypisanej osoby, plików produkcyjnych oraz listy materiałów.

#### **3.3. Moduł: Produkcja i CNC**
* **F-5: Tablica Kanban dla CNC**
    * **Opis:** Dedykowany widok dla operatorów CNC z trzema kolumnami: `W KOLEJCE`, `W TRAKCIE CIĘCIA`, `WYCIĘTE`.
    * **User Story:** Jako Operator CNC, chcę widzieć na swojej tablicy Kanban wszystkie zadania gotowe do produkcji, a po rozpoczęciu pracy móc przeciągnąć kartę zadania do kolumny "W TRAKCIE CIĘCIA".

* **F-6: Dwukierunkowa Synchronizacja Danych (Kluczowa Funkcjonalność)**
    * **Opis:** Zmiana statusu kafelka w jednym miejscu musi natychmiast aktualizować jego stan w całej aplikacji, co będzie realizowane przez `TileStatusProvider`.
    * **User Story:** Jako Prezes, patrząc na podsumowanie projektu, chcę widzieć realny postęp prac, który jest automatycznie aktualizowany, gdy operator CNC kończy kolejne elementy.

#### **3.4. Moduł: Magazyn**
* **F-7: Baza Materiałowa**
    * **Opis:** Pełna, przeszukiwalna baza wszystkich materiałów używanych w produkcji. Każdy materiał ma swoją cenę, jednostkę i kategorię. Musi być dostępna z poziomu edycji kafelka.
    * **User Story:** Jako osoba odpowiedzialna za wyceny, chcę móc przypisać do kafelka "MDF 18mm", a system powinien automatycznie znać jego cenę za arkusz i uwzględnić ją w kalkulacji.

---

### **4. Wymagania Niefunkcjonalne**

* **Użyteczność:** Interfejs musi być wysoce intuicyjny i wizualny (kanban, karty, dashboardy). Musi wspierać użytkowników z ADHD poprzez jasny podział zadań i wizualizację postępu.
* **Wydajność:** Aplikacja musi działać płynnie, nawet przy projektach składających się z setek kafelków. Czas ładowania kluczowych widoków nie powinien przekraczać 2 sekund.
* **Responsywność:** Aplikacja musi być w pełni używalna na urządzeniach stacjonarnych (dla projektantów) oraz tabletach (dla pracowników produkcji).
* **Spójność:** Wszystkie elementy UI muszą być zgodne z systemem projektowym opartym na `shadcn/ui`.

---

### **5. Roadmapa Implementacji**

Prototyp posiada solidne fundamenty wizualne. Dalsze prace powinny skupić się na ożywieniu logiki biznesowej.

1.  **Sprint 1: Ożywienie Podstawowego Przepływu**
    * **Cel:** Umożliwienie pełnego cyklu: stworzenie projektu -> nawigacja do jego widoku -> dynamiczne wyświetlenie danych.
    * **Zadania:** Połączenie przycisku `[+ Stwórz Nowy Projekt]` z modalem; implementacja logiki dodawania projektu; dynamiczne ładowanie danych w `PojjedynczyProjektComplete.tsx` na podstawie ID.

2.  **Sprint 2: Implementacja Głównego Workflow Produkcyjnego**
    * **Cel:** Stworzenie w pełni funkcjonalnej synchronizacji między widokiem projektu a Kanbanem CNC.
    * **Zadania:** Pełne wdrożenie `TileStatusProvider`; implementacja logiki `drag-and-drop` na tablicy Kanban; zapewnienie dwukierunkowej aktualizacji statusów kafelków.

3.  **Sprint 3 (MVP Candidate): Integracja Modułów Wspierających**
    * **Cel:** Dokończenie kluczowych funkcji, aby aplikacja była użyteczna w podstawowym zakresie.
    * **Zadania:** Pełna integracja `MaterialsModal` z `TileEditModal`; implementacja filtrowania i grupowania kafelków; stworzenie podstawowych tablic Kanban dla działu projektowego i produkcji.

### **6. Kryteria Sukcesu (KPIs)**

Produkt odniesie sukces, jeśli osiągnie następujące mierzalne cele w ciągu 6 miesięcy od wdrożenia:
* **Redukcja błędów w wycenach o 30%**.
* **Skrócenie czasu planowania produkcji o 40%**.
* **Poprawa wykorzystania maszyn CNC o 25%**.
* Pozytywny wynik ankiety satysfakcji wśród kluczowych użytkowników (>4.0/5.0).
