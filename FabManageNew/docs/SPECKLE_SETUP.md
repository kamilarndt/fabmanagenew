# Konfiguracja Speckle 3D Integration

## 1. Konfiguracja serwera Speckle

### Opcja A: Publiczny serwer Speckle (zalecane dla testów)
```bash
# W pliku .env.local lub .env
VITE_SPECKLE_SERVER=https://speckle.xyz
VITE_SPECKLE_TOKEN=TWÓJ_PERSONAL_ACCESS_TOKEN
```

### Opcja B: Własny serwer Speckle (self-hosted)
```bash
# W pliku .env.local lub .env
VITE_SPECKLE_SERVER=https://speckle.firma.pl
VITE_SPECKLE_TOKEN=TWÓJ_PERSONAL_ACCESS_TOKEN
```

## 2. Generowanie Personal Access Token

1. **Zaloguj się do Speckle** (https://speckle.xyz lub Twój serwer)
2. **Przejdź do ustawień konta**: Account → Tokens
3. **Utwórz nowy token**: Kliknij "+ New Token"
4. **Nadaj nazwę**: np. "FabManage Integration"
5. **Wybierz uprawnienia**: 
   - `streams:read` - do odczytu strumieni
   - `objects:read` - do odczytu obiektów 3D
   - `users:read` - do odczytu informacji o użytkownikach
6. **Skopiuj token** i wklej do zmiennej `VITE_SPECKLE_TOKEN`

## 3. Test połączenia

### Test API Speckle
```bash
# Test podstawowego połączenia
curl -H "Authorization: Bearer TWÓJ_TOKEN" https://speckle.xyz/api/streams?limit=5

# Test GraphQL (dla geometrii)
curl -X POST https://speckle.xyz/graphql \
  -H "Authorization: Bearer TWÓJ_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { user { name } }"}'
```

### Test w aplikacji
1. Uruchom aplikację: `npm run dev`
2. Przejdź do projektu z modułem "projektowanie"
3. W zakładce "Model 3D" wklej link do strumienia Speckle
4. Sprawdź czy model się ładuje

## 4. Struktura URL-i Speckle

### Format URL strumienia
```
https://speckle.xyz/streams/STREAM_ID/commits/COMMIT_ID
```

### Przykłady
```
# Strumień publiczny
https://speckle.xyz/streams/abc123/commits/def456

# Strumień prywatny (wymaga tokena)
https://speckle.xyz/streams/private-stream-123/commits/latest-commit-456
```

## 5. Funkcje integracji

### ✅ Zaimplementowane
- [x] Ładowanie modeli 3D z Speckle
- [x] Podstawowa nawigacja (zoom, pan, rotate)
- [x] Zaznaczanie obiektów w modelu
- [x] Tworzenie kafelków z zaznaczonych obiektów
- [x] Przypisywanie materiałów do obiektów
- [x] Automatyczne obliczanie objętości i powierzchni
- [x] Szacowanie ilości płyt z marginesem na odpad
- [x] Generowanie screenshotów 3D
- [x] Picker strumieni Speckle

### 🚧 W trakcie rozwoju
- [ ] Automatyczne generowanie BOM
- [ ] Integracja z systemem kosztów
- [ ] Optymalizacja wydajności dla dużych modeli
- [ ] Eksport do formatów produkcyjnych

## 6. Rozwiązywanie problemów

### Problem: Model się nie ładuje
**Rozwiązanie:**
1. Sprawdź czy URL jest poprawny
2. Sprawdź czy token ma odpowiednie uprawnienia
3. Sprawdź czy strumień jest publiczny lub masz dostęp

### Problem: Błąd "Unauthorized"
**Rozwiązanie:**
1. Sprawdź czy token jest poprawny
2. Sprawdź czy token nie wygasł
3. Sprawdź uprawnienia tokena

### Problem: Wolne ładowanie modeli
**Rozwiązanie:**
1. Sprawdź rozmiar modelu (zalecane <50MB)
2. Użyj kompresji w Rhino przed eksportem
3. Rozważ podział na mniejsze strumienie

### Problem: Brak obiektów w selekcji
**Rozwiązanie:**
1. Sprawdź czy obiekty są solidami (nie liniami/punktami)
2. Sprawdź czy model ma odpowiednie metadane
3. Użyj najnowszej wersji Speckle Connector

## 7. Najlepsze praktyki

### Przygotowanie modeli w Rhino
1. **Grupuj podobne obiekty** - ułatwi to selekcję
2. **Nadaj nazwy warstwom** - pomoże w organizacji
3. **Użyj solidów** - linie i punkty nie są obsługiwane
4. **Optymalizuj geometrię** - usuń niepotrzebne detale

### Organizacja strumieni
1. **Jeden strumień na projekt** - łatwiejsze zarządzanie
2. **Nazwij commity opisowo** - np. "Wersja 1.0 - Główna struktura"
3. **Używaj tagów** - do oznaczania wersji produkcyjnych

### Bezpieczeństwo
1. **Nie udostępniaj tokenów** - przechowuj w zmiennych środowiskowych
2. **Używaj tokenów z ograniczonymi uprawnieniami**
3. **Regularnie odświeżaj tokeny** - co 90 dni

## 8. API Reference

### Zmienne środowiskowe
```bash
VITE_SPECKLE_SERVER=https://speckle.xyz    # URL serwera Speckle
VITE_SPECKLE_TOKEN=abc123...               # Personal Access Token
```

### Komponenty React
```tsx
// Podstawowy viewer
<SpeckleViewer
  initialStreamUrl="https://speckle.xyz/streams/..."
  height={400}
  enableSelection
  onSelectionChange={(ids) => console.log(ids)}
/>

// Modal wyboru modelu
<SelectSpeckleModelModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onSelect={(url) => console.log(url)}
/>

// Modal przypisywania materiałów
<MaterialAssignmentModal
  open={isOpen}
  selectedObjectIds={['obj1', 'obj2']}
  streamUrl="https://speckle.xyz/streams/..."
  onSuccess={(assignments) => console.log(assignments)}
/>
```

### Serwisy
```typescript
// Lista strumieni
const streams = await listStreams()

// Lista commitów
const commits = await listCommits(streamId)

// Przypisanie materiału
const result = await assignMaterialToObjects(tileId, objectIds, materialId)

// Generowanie BOM
const bom = await generateBOMFromAssignments(tileId, assignments)
```

## 9. Wsparcie

W przypadku problemów:
1. Sprawdź logi w konsoli przeglądarki
2. Sprawdź logi serwera Speckle
3. Skontaktuj się z zespołem deweloperskim
4. Sprawdź dokumentację Speckle: https://speckle.guide/

