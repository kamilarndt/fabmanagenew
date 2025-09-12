## Docker i wdrożenie

### Obrazy
- `Dockerfile.dev` — dev server (Vite) na porcie 3002
- `Dockerfile` — build produkcyjny + `serve` na porcie 3000

### Compose (`docker-compose.yml`)
- `fabmanage-dev` (profil `dev`): mount kodu, env, `npm run dev`
- `fabmanage-prod` (profil `prod`): build i serwowanie statyczne
- `nginx` (profil `prod`): reverse proxy + CSP + CORS

### Uruchomienie
- Dev: `npm run docker:dev` → http://localhost:3002
- Prod: `npm run docker:prod` → http://localhost:3000 (przez Nginx: :80)

### Konfiguracja Nginx
- Fallback SPA dla tras: `/dashboard|projekty|klienci|projektowanie|cnc|magazyn|produkcja|projekt`
- Nagłówki bezpieczeństwa (CSP, XFO, Referrer-Policy, Permissions-Policy)

### Backend URL w kontenerach
- `VITE_API_BASE_URL=http://fabmanage:3001` (wewnętrzna sieć docker)

### Dobre praktyki
- Małe warstwy obrazów; używać `npm ci` w prod
- Konfiguracje przez env, nie w kodzie


