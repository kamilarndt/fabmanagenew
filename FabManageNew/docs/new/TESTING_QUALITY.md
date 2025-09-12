## Testy i jakość

### Lint
- ESLint (`eslint.config.js`): TS, React Hooks, Refresh
- Uruchomienie: `npm run lint`

### Testy
- Smoke: `npm run test:smoke` (skrypt e2e/light)
- Vitest:
  - Jednorazowo: `npx vitest --run`
  - Watch/UI: `npx vitest`

### Kontrola jakości PR
- Lint → Testy → Build (lokalnie lub w CI)
- Brak ostrzeżeń krytycznych (`no-console` ograniczone do warn/error)

### Zakresy testów (rekomendacja)
- Stores (Zustand): logika modyfikacji stanu
- Komponenty krytyczne: Kanban, Modale, DXF viewer init
- Funkcje `lib/`: kalkulator czasu produkcji, mapowanie statusów


