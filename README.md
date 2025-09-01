# FabManage - System Zarządzania Produkcją Fabryki Dekoracji

## 🏭 O Projekcie

FabManage to zaawansowany system zarządzania produkcją dla fabryki dekoracji, umożliwiający kompleksowe zarządzanie projektami od fazy koncepcyjnej do finalnej produkcji CNC i montażu.

## ✨ Funkcjonalności

### 📋 Zarządzanie Projektami
- **Modułowe zarządzanie cyklem życia projektu**
  - Wycena i kalkulacja kosztów
  - Koncepcja (prace kreatywne, szkice, moodboardy)
  - Projektowanie Techniczne (precyzyjne modelowanie 3D)
  - Produkcja (system kafelków, CNC)
  - Zarządzanie Materiałami (planowanie i zamawianie)
  - Logistyka i Montaż (transport i prace u klienta)

### 🎯 System Kafelków
- Dekompozycja projektów na elementy produkcyjne
- Zarządzanie statusami: Projektowanie → Do akceptacji → Zaakceptowane → W kolejce CNC → W produkcji CNC → Gotowy do montażu
- BOM (Bill of Materials) dla każdego kafelka
- Pliki techniczne (.dxf, .pdf) per element

### 🔧 CNC i Produkcja
- Tablica Kanban dla działu CNC
- Monitoring maszyn w czasie rzeczywistym
- Kolejka priorytetowa zadań
- Automatyczne przejścia statusów

### 📊 Dashboard i Raporty
- KPI produkcji
- Śledzenie postępów projektów
- Analiza kosztów i rentowności
- Eksport list zakupowych (CSV)

## 🚀 Technologie

- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand z persystencją
- **Styling**: Bootstrap 5 + Custom CSS
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Deployment**: Docker

## 📦 Struktura Projektu

```
FabManageNew/
├── src/
│   ├── components/          # Komponenty UI
│   ├── pages/              # Strony aplikacji
│   ├── stores/             # Zustand stores
│   ├── state/              # React Context (legacy)
│   ├── services/           # API services
│   ├── lib/                # Utilities
│   └── types/              # TypeScript types
├── docs/                   # Dokumentacja
└── docker/                 # Konfiguracja Docker
```

## 🛠️ Instalacja i Uruchomienie

### Wymagania
- Node.js 18+
- npm lub yarn
- Git

### Kroki instalacji

1. **Klonowanie repozytorium**
   ```bash
   git clone https://github.com/kamilarndt/fabmanagenew.git
   cd fabmanagenew
   ```

2. **Instalacja zależności**
   ```bash
   cd FabManageNew
   npm install
   ```

3. **Konfiguracja środowiska**
   ```bash
   cp .env.example .env.local
   # Edytuj .env.local i dodaj klucze Supabase
   ```

4. **Uruchomienie w trybie deweloperskim**
   ```bash
   npm run dev
   ```

5. **Otwórz przeglądarkę**
   ```
   http://localhost:3000
   ```

## 🔧 Konfiguracja Supabase

1. Utwórz projekt w [Supabase](https://supabase.com)
2. Skopiuj URL i klucz API
3. Dodaj do `.env.local`:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## 📋 Workflow Produkcyjny

### 1. Faza Koncepcyjna
- Tworzenie projektu z modułami: Wycena + Koncepcja
- Prace kreatywne, szkice, moodboardy
- Akceptacja klienta

### 2. Projektowanie Techniczne
- Włączenie modułu "Projektowanie Techniczne"
- Dekompozycja na kafelki w systemie
- Modelowanie 3D (Rhino), pliki .dxf/.pdf
- Definicja BOM dla każdego elementu

### 3. Produkcja
- Włączenie modułu "Produkcja"
- Automatyczne przesłanie zaakceptowanych kafelków do CNC
- Monitoring produkcji na tablicy Kanban
- Śledzenie postępów maszyn

### 4. Zarządzanie Materiałami
- Włączenie modułu "Zarządzanie Materiałami"
- Konsolidacja BOM z wszystkich kafelków
- Generowanie list zakupowych
- Eksport CSV dla działu zaopatrzenia

### 5. Logistyka i Montaż
- Włączenie modułu "Logistyka i Montaż"
- Planowanie transportu
- Koordynacja prac montażowych u klienta

## 🧪 Testy

```bash
# Uruchomienie testów
npm run test

# Testy z coverage
npm run test:coverage

# Testy e2e
npm run test:e2e
```

## 🐳 Docker

```bash
# Budowanie obrazu
docker build -t fabmanage .

# Uruchomienie kontenera
docker run -p 3000:3000 fabmanage
```

## 📝 Skrypty NPM

- `npm run dev` - Serwer deweloperski
- `npm run build` - Budowanie produkcyjne
- `npm run preview` - Podgląd builda
- `npm run lint` - Linting kodu
- `npm run type-check` - Sprawdzanie typów TypeScript

## 🤝 Współpraca

### Struktura Commits
- `feat:` - Nowe funkcjonalności
- `fix:` - Poprawki błędów
- `docs:` - Dokumentacja
- `style:` - Zmiany formatowania
- `refactor:` - Refaktoryzacja kodu
- `test:` - Dodanie testów
- `chore:` - Zmiany konfiguracyjne

### Pull Request
1. Utwórz branch z `main`
2. Wprowadź zmiany
3. Dodaj testy jeśli potrzebne
4. Uruchom `npm run lint` i `npm run type-check`
5. Utwórz Pull Request

## 📄 Licencja

MIT License - zobacz [LICENSE](LICENSE) dla szczegółów.

## 👥 Autorzy

- **Kamil Arndt** - Project Manager & Lead Developer
- **Zespół Fabryki Dekoracji** - Specjaliści branżowi

## 📞 Kontakt

- Email: kamil@fabrykadekracji.pl
- Strona: https://fabrykadekracji.pl
- GitHub: [@fabrykadekracji](https://github.com/fabrykadekracji)

---

**FabManage** - Nowoczesne zarządzanie produkcją w erze cyfrowej 🚀
