# SVG Export - Wyniki

## ✅ Sukces! System eksportu SVG działa poprawnie

### Wygenerowane pliki:

- `export/svg/pages/ProjectsPage.svg` - Strona projektów (4 komponenty)
- `export/svg/pages/DashboardPage.svg` - Dashboard (2 komponenty)
- `export/svg/pages/TilesPage.svg` - Strona kafelków (1 komponent)
- `export/svg/pages/MagazynPage.svg` - Strona magazynu (1 komponent)
- `export/svg/pages/CNCPage.svg` - Strona CNC (1 komponent)
- `export/svg/pages/ProjektowaniePage.svg` - Strona projektowania (1 komponent)

### Struktura SVG zachowuje:

#### 1. Metadane komponentów

```xml
<title>ProjectsPage</title>
<desc>Generated from FabManage component: ProjectsPage</desc>
```

#### 2. Grupy z klasami CSS

```xml
<g class="prefix__variant-main prefix__state-active">
  <!-- Elementy komponentu -->
</g>
```

#### 3. Geometrię i style

```xml
<rect x="304" y="88" width="1112" height="605.25" rx="0"
      fill="#f5f5f5" stroke="rgba(235, 241, 245, 0.96)" stroke-width="0"/>
<text x="312" y="395.63" fill="rgba(235, 241, 245, 0.96)"
      font-family="Inter, -apple-system, BlinkMacSystemFont..." font-size="14">
```

## Import do Figmy

### Krok 1: Przygotowanie

1. Otwórz Figmę
2. Utwórz nowy projekt lub otwórz istniejący
3. Przygotuj strukturę warstw (opcjonalnie)

### Krok 2: Import SVG

1. Przeciągnij pliki SVG z folderu `export/svg/pages/` do Figmy
2. Lub użyj **File → Import** i wybierz pliki SVG

### Krok 3: Weryfikacja struktury

Po imporcie sprawdź:

- ✅ Warstwy zachowują nazwy z `data-component`
- ✅ Klasy CSS są widoczne w properties
- ✅ Geometria odpowiada oryginalnym komponentom
- ✅ Kolory i style są zachowane

### Krok 4: Konwersja na komponenty Figmy

1. Wybierz zaimportowane elementy
2. Kliknij prawym przyciskiem → **Create Component**
3. Ustaw Auto Layout jeśli potrzeba
4. Dodaj warianty bazując na klasach CSS (variant-_, state-_, size-\*)

## Rozszerzenia systemu

### Dodawanie nowych komponentów

1. Dodaj `data-component`, `data-variant`, `data-state`, `data-size` do komponentu
2. Dodaj wpis do `scripts/export-manifest.json`
3. Uruchom `npm run export:svg`

### Dodawanie Storybook stories

1. Skonfiguruj Storybook (obecnie pomijane z powodu konfliktów wersji)
2. Utwórz stories z `data-*` atrybutami
3. Dodaj URL stories do manifestu

### Custom styling

Rozszerz funkcje `toRectShape()` i `toTextShape()` w `scripts/export-to-svg.ts` dla:

- Gradientów
- Cieni
- Zaawansowanych kształtów
- Ikon SVG

## Komendy

```bash
# Uruchom dev server
npm run dev

# Eksportuj SVG (wymaga działającego dev servera)
npm run export:svg

# Kompilacja (sprawdź błędy przed eksportem)
npm run build
```

## Rozwiązywanie problemów

### Brak komponentów w SVG

- Sprawdź czy komponenty mają `data-component`
- Upewnij się, że dev server działa na localhost:5173
- Sprawdź console logi w przeglądarce

### Błędne style

- Sprawdź czy CSS jest w pełni załadowany
- Zwiększ timeout w skrypcie (obecnie 2s)
- Sprawdź czy Ant Design theme jest aplikowany

### Problemy z SVGO

- Konfiguracja SVGO zachowuje ID (`cleanupIds: false`)
- Prefiksy można wyłączyć w konfiguracji
- Optymalizacja usuwa puste elementy

## Następne kroki

1. **Storybook integration** - Po rozwiązaniu konfliktów wersji Vite
2. **Component variants** - Automatyczne generowanie wariantów z props
3. **Icon extraction** - Eksport ikon jako osobne SVG
4. **Batch processing** - Eksport wszystkich komponentów jednocześnie
5. **Figma plugin** - Automatyczny import i konwersja na komponenty

---

🎉 **System SVG Export jest gotowy do użycia!**

Wszystkie wygenerowane pliki SVG są kompatybilne z Figmą i zachowują strukturę warstw oraz nazewnictwo z repozytorium kodu.
