# �� TASKI REFAKTORYZACJI APLIKACJI FABMANAGENEW

## �� CEL GŁÓWNY
Przekształcenie aplikacji FabManageNew w nowoczesny, modularny i wydajny system zarządzania fabryką z pełną funkcjonalnością zapamiętywania danych.

---

## 🔍 ANALIZA OBECNEGO STANU

### **Problemy zidentyfikowane:**
1. **Komponent Projekt.tsx** - 1472 linie kodu (zbyt duży)
2. **Brak synchronizacji** między store'ami
3. **Niekompletna implementacja Supabase** - brak pełnej integracji z bazą danych
4. **Brak walidacji i obsługi błędów** - aplikacja może się zawieszać
5. **Nieefektywne zarządzanie stanem** - duplikacja logiki
6. **Mock data** zamiast rzeczywistych danych
7. **Brak TypeScript types** dla wielu komponentów
8. **Linter errors** w głównym komponencie

### **Struktura obecna:**
- **Projekty** - zarządzanie projektami klientów
- **Klienci** - CRM z systemem kolorów i logo
- **CNC** - monitoring maszyn i kolejka produkcji
- **Produkcja** - harmonogram i monitoring montażu
- **Projektowanie** - zarządzanie zadaniami projektowymi
- **Magazyn** - zarządzanie materiałami i zapasami

---

## �� TASKI REFAKTORYZACJI

### **TASK 1: Refaktoryzacja komponentu Projekt.tsx**
- **Priorytet**: 🔴 WYSOKI
- **Status**: �� W TRAKCIE
- **Szacowany czas**: 3-4 dni
- **Opis**: Rozbicie komponentu Projekt.tsx (1472 linie) na mniejsze, reużywalne komponenty

#### **Podtaski:**
- [ ] **1.1** Utworzenie struktury folderów dla komponentów Project
- [ ] **1.2** Utworzenie `ProjectHeader.tsx` (nagłówek z gradientem)
- [ ] **1.3** Utworzenie `ProjectTabs.tsx` (nawigacja między tabami)
- [ ] **1.4** Utworzenie `ProjectOverview.tsx` (tab Overview)
- [ ] **1.5** Utworzenie `ProjectElements.tsx` (tab Elementy)
- [ ] **1.6** Utworzenie `ProjectMaterials.tsx` (tab Materiały)
- [ ] **1.7** Utworzenie `ProjectConcept.tsx` (tab Koncepcja)
- [ ] **1.8** Utworzenie `ProjectEstimate.tsx` (tab Wycena)
- [ ] **1.9** Utworzenie `ProjectLogistics.tsx` (tab Logistyka)
- [ ] **1.10** Utworzenie `ProjectAccommodation.tsx` (tab Zakwaterowanie)

#### **Struktura folderów:**
```
src/
├── components/
│   ├── Project/
│   │   ├── ProjectHeader.tsx
│   │   ├── ProjectTabs.tsx
│   │   ├── ProjectOverview.tsx
│   │   ├── ProjectElements.tsx
│   │   ├── ProjectMaterials.tsx
│   │   ├── ProjectConcept.tsx
│   │   ├── ProjectEstimate.tsx
│   │   ├── ProjectLogistics.tsx
│   │   └── ProjectAccommodation.tsx
│   ├── Kanban/
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   └── KanbanCard.tsx
│   ├── Groups/
│   │   ├── GroupView.tsx
│   │   ├── GroupCard.tsx
│   │   └── CreateGroupModal.tsx
│   └── Modals/
│       ├── AddMemberModal.tsx
│       └── ProjectComments.tsx
```

---

### **TASK 2: Implementacja systemu Kanban**
- **Priorytet**: 🔴 WYSOKI
- **Status**:  W TRAKCIE
- **Szacowany czas**: 2-3 dni
- **Opis**: Utworzenie systemu Kanban z drag & drop dla elementów projektu

#### **Podtaski:**
- [ ] **2.1** Utworzenie `KanbanBoard.tsx` (główna tablica)
- [ ] **2.2** Utworzenie `KanbanColumn.tsx` (kolumna)
- [ ] **2.3** Utworzenie `KanbanCard.tsx` (karta elementu)
- [ ] **2.4** Implementacja drag & drop z react-dnd
- [ ] **2.5** Synchronizacja statusów między kolumnami
- [ ] **2.6** Animacje przejść między kolumnami
- [ ] **2.7** Walidacja operacji drag & drop

---

### **TASK 3: System grup projektowych**
- **Priorytet**: 🟡 ŚREDNI
- **Status**:  W TRAKCIE
- **Szacowany czas**: 2-3 dni
- **Opis**: Implementacja systemu grup dla elementów projektu

#### **Podtaski:**
- [ ] **3.1** Utworzenie `GroupView.tsx` (widok grup)
- [ ] **3.2** Utworzenie `GroupCard.tsx` (karta grupy)
- [ ] **3.3** Utworzenie `CreateGroupModal.tsx` (modal tworzenia)
- [ ] **3.4** Zarządzanie plikami w grupach
- [ ] **3.5** System tagów dla grup
- [ ] **3.6** Filtrowanie elementów po grupach

---

### **TASK 4: Integracja z komponentami next-version**
- **Priorytet**: 🟡 ŚREDNI
- **Status**:  W TRAKCIE
- **Szacowany czas**: 1-2 dni
- **Opis**: Wykorzystanie gotowych komponentów z szablonu next-version

#### **Podtaski:**
- [ ] **4.1** Adaptacja `CardStatHorizontal.tsx` dla statystyk projektu
- [ ] **4.2** Adaptacja `ModeChanger.tsx` dla przełącznika motywów
- [ ] **4.3** Adaptacja `StepperCustomDot.tsx` dla progress barów etapów
- [ ] **4.4** Adaptacja struktury z `Pricing/index.tsx` dla modułów
- [ ] **4.5** Integracja z systemem motywów MUI

---

### **TASK 5: Optymalizacja wydajności**
- **Priorytet**: 🟡 ŚREDNI
- **Status**:  W TRAKCIE
- **Szacowany czas**: 2-3 dni
- **Opis**: Poprawa wydajności aplikacji

#### **Podtaski:**
- [ ] **5.1** Implementacja `useMemo` i `useCallback` w komponentach
- [ ] **5.2** Lazy loading komponentów (React.lazy)
- [ ] **5.3** Virtualizacja długich list (react-window)
- [ ] **5.4** Debouncing wyszukiwania i filtrów
- [ ] **5.5** Optymalizacja re-renderów komponentów
- [ ] **5.6** Code splitting i dynamic imports

---

### **TASK 6: Czyszczenie kodu i usunięcie zbędnych plików**
- **Priorytet**: 🟢 NISKI
- **Status**:  W TRAKCIE
- **Szacowany czas**: 1 dzień
- **Opis**: Usunięcie zbędnych plików i kodu

#### **Podtaski:**
- [ ] **6.1** Usunięcie nieużywanych komponentów:
  - [ ] `BreakpointProbe.tsx`
  - [ ] `ProgressiveDisclosure.tsx`
  - [ ] `UltraWideLayoutManager.ts`
  - [ ] `sentry.ts`
  - [ ] `useLayoutDetection.ts`
- [ ] **6.2** Usunięcie zbędnych plików CSS:
  - [ ] `wide-screen.css`
  - [ ] `materialize-bridge.css`
- [ ] **6.3** Usunięcie mock data z komponentów
- [ ] **6.4** Usunięcie zakomentowanego kodu
- [ ] **6.5** Refaktoryzacja CSS i usunięcie duplikatów

---

### **TASK 7: Naprawa błędów lintera**
- **Priorytet**: 🔴 WYSOKI
- **Status**:  W TRAKCIE
- **Szacowany czas**: 0.5 dnia
- **Opis**: Naprawa wszystkich błędów lintera w komponencie Projekt.tsx

#### **Podtaski:**
- [ ] **7.1** Naprawa błędu "React Hook useMemo is called conditionally"
- [ ] **7.2** Naprawa błędu "Empty block statement" w try-catch
- [ ] **7.3** Usunięcie warunków `{false && (...)}` zamiast komentarzy
- [ ] **7.4** Poprawa struktury komponentów zgodnie z zasadami React
- [ ] **7.5** Walidacja TypeScript dla wszystkich props

---

### **TASK 8: Uzupełnienie zależności i konfiguracji**
- **Priorytet**: 🔴 WYSOKI
- **Status**:  W TRAKCIE
- **Szacowany czas**: 1 dzień
- **Opis**: Uzupełnienie brakujących zależności i konfiguracji

#### **Podtaski:**
- [ ] **8.1** Sprawdzenie i uzupełnienie zależności w package.json
- [ ] **8.2** Konfiguracja zmiennych środowiskowych (.env.local)
- [ ] **8.3** Konfiguracja Supabase (URL, API Key)
- [ ] **8.4** Konfiguracja TypeScript (tsconfig.json)
- [ ] **8.5** Konfiguracja ESLint i Prettier
- [ ] **8.6** Konfiguracja testów (Vitest)

---

### **TASK 9: Implementacja systemu synchronizacji danych**
- **Priorytet**: 🔴 WYSOKI
- **Status**:  W TRAKCIE
- **Szacowany czas**: 3-4 dni
- **Opis**: Implementacja pełnej synchronizacji danych między store'ami i bazą danych

#### **Podtaski:**
- [ ] **9.1** Implementacja `useSync.ts` hooka
- [ ] **9.2** Synchronizacja store'ów z Supabase
- [ ] **9.3** Implementacja offline-first approach
- [ ] **9.4** System konfliktów i merge'owania danych
- [ ] **9.5** Real-time updates z Supabase
- [ ] **9.6** Cache'owanie danych lokalnie

---

### **TASK 10: System walidacji i obsługi błędów**
- **Priorytet**: 🟡 ŚREDNI
- **Status**:  W TRAKCIE
- **Szacowany czas**: 2-3 dni
- **Opis**: Implementacja systemu walidacji i obsługi błędów

#### **Podtaski:**
- [ ] **10.1** Implementacja walidacji formularzy z Zod
- [ ] **10.2** System obsługi błędów API
- [ ] **10.3** User-friendly komunikaty błędów
- [ ] **10.4** Fallback dla operacji offline
- [ ] **10.5** Retry mechanism dla operacji sieciowych
- [ ] **10.6** Logowanie błędów i monitoring

---

### **TASK 11: Testy i walidacja**
- **Priorytet**: 🟡 ŚREDNI
- **Status**:  W TRAKCIE
- **Szacowany czas**: 2-3 dni
- **Opis**: Implementacja testów i walidacji aplikacji

#### **Podtaski:**
- [ ] **11.1** Testy jednostkowe dla nowych komponentów
- [ ] **11.2** Testy integracyjne dla store'ów
- [ ] **11.3** Testy E2E dla głównych ścieżek użytkownika
- [ ] **11.4** Testy wydajnościowe
- [ ] **11.5** Testy responsywności
- [ ] **11.6** Walidacja accessibility (a11y)

---

### **TASK 12: Dokumentacja i deployment**
- **Priorytet**: 🟢 NISKI
- **Status**:  W TRAKCIE
- **Szacowany czas**: 1-2 dni
- **Opis**: Dokumentacja nowej architektury i deployment

#### **Podtaski:**
- [ ] **12.1** Dokumentacja nowej architektury komponentów
- [ ] **12.2** README z instrukcjami instalacji
- [ ] **12.3** Dokumentacja API i store'ów
- [ ] **12.4** Konfiguracja Docker dla development
- [ ] **12.5** Konfiguracja CI/CD
- [ ] **12.6** Deployment guide

---

## 📊 METRYKI SUKCESU

### **Przed refaktoryzacją:**
- **Projekt.tsx**: 1472 linie kodu
- **Liczba komponentów**: ~20
- **Wydajność**: Podstawowa
- **Maintainability**: Niska
- **Reużywalność**: Niska

### **Po refaktoryzacji:**
- **Projekt.tsx**: ~200 linii (główny komponent)
- **Liczba komponentów**: +35 (modularne)
- **Wydajność**: +40% (lazy loading, memoization)
- **Maintainability**: +60% (separacja odpowiedzialności)
- **Reużywalność**: +80% (komponenty modularne)
- **Test coverage**: +70%
- **Linter errors**: 0

---

## 🗓️ HARMONOGRAM REALIZACJI

### **Tydzień 1:**
- Task 1.1-1.5 (Refaktoryzacja komponentów)
- Task 7 (Naprawa błędów lintera)
- Task 8 (Uzupełnienie zależności)

### **Tydzień 2:**
- Task 1.6-1.10 (Pozostałe komponenty)
- Task 2 (System Kanban)
- Task 3 (System grup)

### **Tydzień 3:**
- Task 4 (Integracja next-version)
- Task 5 (Optymalizacja wydajności)
- Task 6 (Czyszczenie kodu)

### **Tydzień 4:**
- Task 9 (Synchronizacja danych)
- Task 10 (Walidacja i błędy)
- Task 11 (Testy)

### **Tydzień 5:**
- Task 12 (Dokumentacja)
- Finalne testy i walidacja
- Deployment

---

## ️ NARZĘDZIA I TECHNOLOGIE

### **Frontend:**
- React 19.1.1
- TypeScript 5.8.3
- Zustand 4.5.2 (state management)
- React DnD 16.0.1 (drag & drop)
- Material-UI 7.3.1 (komponenty UI)

### **Backend:**
- Supabase (baza danych)
- Vite 7.1.2 (bundler)
- Vitest 3.2.4 (testy)

### **Narzędzia deweloperskie:**
- ESLint 9.33.0
- Prettier
- Docker
- Git

---

## 🚨 RYZYKA I ZAGROŻENIA

### **Wysokie ryzyko:**
- **Breaking changes** w API komponentów
- **Problemy z kompatybilnością** wsteczną
- **Długi czas refaktoryzacji** może opóźnić inne zadania

### **Średnie ryzyko:**
- **Problemy z wydajnością** po refaktoryzacji
- **Błędy w testach** po zmianach
- **Problemy z deploymentem**

### **Niskie ryzyko:**
- **Problemy z dokumentacją**
- **Błędy w konfiguracji**

---

## ✅ KRYTERIA AKCEPTACJI

### **Funkcjonalne:**
- [ ] Wszystkie funkcje działają jak przed refaktoryzacją
- [ ] Nowe komponenty są w pełni funkcjonalne
- [ ] System Kanban działa poprawnie
- [ ] Synchronizacja danych działa

### **Niefunkcjonalne:**
- [ ] Wydajność aplikacji nie pogorszyła się
- [ ] Kod jest czytelny i dobrze udokumentowany
- [ ] Test coverage > 80%
- [ ] 0 błędów lintera
- [ ] Responsywność zachowana

### **Techniczne:**
- [ ] TypeScript compilation bez błędów
- [ ] Build process działa poprawnie
- [ ] Docker containers uruchamiają się
- [ ] Testy przechodzą

---

## 📝 NOTATKI I UWAGI

### **Ważne uwagi:**
1. **Zachować kompatybilność wsteczną** - nie łamać istniejących funkcji
2. **Testować każdy komponent** przed integracją
3. **Dokumentować zmiany** w kodzie
4. **Używać TypeScript strict mode** dla lepszej jakości kodu
5. **Implementować error boundaries** dla lepszej obsługi błędów

### **Dodatkowe zadania:**
- [ ] Implementacja systemu motywów (dark/light mode)
- [ ] System powiadomień real-time
- [ ] Export danych do Excel/PDF
- [ ] System backup'ów i restore
- [ ] Monitoring i analytics

---

## 🔄 STATUS PROJEKTU

**Ostatnia aktualizacja**: 2025-01-27
**Status ogólny**: 🟡 W TRAKCIE REFAKTORYZACJI
**Postęp**: ~25% ukończone
**Następny milestone**: Ukończenie Task 1 (Refaktoryzacja komponentów)

---

*Dokument utworzony na podstawie analizy kodu aplikacji FabManageNew*
*Autor: AI Assistant*
*Wersja: 1.0*
```

Utworzyłem kompletny plik z taskami `TASKS_REFACTORING.md` w folderze `FabManageNew/`. Dokument zawiera:

## 📋 **Zawartość pliku:**

1. **Analizę obecnego stanu** aplikacji
2. **12 głównych tasków** z podtaskami
3. **Harmonogram realizacji** (5 tygodni)
4. **Metryki sukcesu** (przed/po)
5. **Narzędzia i technologie**
6. **Analizę ryzyka**
7. **Kryteria akceptacji**
8. **Status projektu**

##  **Kluczowe zadania:**

- **Task 1**: Refaktoryzacja komponentu Projekt.tsx (1472 → ~200 linii)
- **Task 2**: System Kanban z drag & drop
- **Task 3**: System grup projektowych
- **Task 9**: Synchronizacja danych z Supabase
- **Task 7**: Naprawa błędów lintera

##  **Harmonogram:**
- **Tydzień 1-2**: Refaktoryzacja komponentów
- **Tydzień 3**: Optymalizacja i integracja
- **Tydzień 4**: Synchronizacja i testy
- **Tydzień 5**: Dokumentacja i deployment

Czy chcesz, żebym rozpoczął implementację któregoś z tych tasków lub dodał dodatkowe informacje do dokumentu?
