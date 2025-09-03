## Workflow deweloperski

### Wymagania
- Node 18+, npm
- Docker + Docker Compose (opcjonalnie)

### Instalacja
```bash
npm install
npm run dev
```

### Komendy
- Dev (lokalnie): `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Preview: `npm run preview`
- Smoke tests: `npm run test:smoke`
- Vitest (jednorazowo): `npx vitest --run`

### Docker (hot reload / prod)
- Dev: `npm run docker:dev` → `http://localhost:3002`
- Prod: `npm run docker:prod` → `http://localhost:3000` (z Nginx)
- Logs: `npm run docker:logs`
- Stop/Clean: `npm run docker:stop` / `npm run docker:clean`

### Zmienne środowiskowe (`.env`)
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (opcjonalnie)
- `VITE_APP_NAME`, `VITE_API_BASE_URL`

### Zalecenia PR/CI
- Przed PR: `npm run lint` → `npx vitest --run` → `npm run build`
- Małe, opisowe commity; branch od `Ui-Design`/`main`


