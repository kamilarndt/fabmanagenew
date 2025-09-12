## Bezpieczeństwo i prywatność

### Nagłówki i polityki (Nginx)
- X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
- Content-Security-Policy: restrykcyjny default, style/script inline ograniczone

### CORS
- Obsługa preflight `OPTIONS` z nagłówkami dopuszczającymi typowe metody i nagłówki

### Dane i persystencja
- Persist lokalny (IndexedDB/localStorage) — tylko niekrytyczne dane operacyjne
- Zewnętrzne systemy (np. Supabase) — przez klucze środowiskowe Vite

### Dostępność i role (przyszłość)
- Rozszerzenie autoryzacji i ról użytkowników
- Audyty dostępu do modułów i danych

### Dobre praktyki
- Brak sekretów w repo; tylko przez `.env`/sekrety CI
- Walidacja wejścia po obu stronach (frontend/backend)


