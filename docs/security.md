## Security and Compliance

### Principles
- Least privilege across services and roles
- Validate all external inputs (Zod) before processing
- Sanitize all user-provided HTML with DOMPurify before rendering

### Supabase
- Enforce Row Level Security (RLS) on all tables in non-local environments
- Use service role only in trusted backend; never expose in frontend
- Ensure policies align to user ownership and project membership

### Authentication
- Supabase Auth session forwarded via `httpClient` Authorization header when present
- Avoid storing tokens outside secure storage; rely on Supabase client session

### API surface
- Wrap network calls in `src/lib/httpClient.ts` to centralize headers, auth, retries, and error mapping
- Never call Supabase or fetch directly from UI components

### Secrets and environment
- No secrets committed to the repository; use `.env*` files (see `.gitignore`)
- Document required variables in deployment guide

### Data protection
- Prefer server-side filtering; avoid overfetching sensitive fields
- Log minimal PII; use `logger` redact/omit patterns if remote logging is enabled

### Dependencies
- Keep dependencies up to date; address high vulnerabilities promptly
- Lock file committed; CI should run `npm audit` (future)

### Incident handling
- Bubble errors to ErrorBoundary; show user-friendly messages
- Record error IDs in logs for traceability; avoid leaking stack traces to users


