# Artemis Education

Artemis Education is a pnpm workspace with:

- a Vite frontend in `artifacts/artemis-education`
- an Express API in `artifacts/api-server`
- shared workspace libraries in `lib/*`

## Local development

Install dependencies:

```bash
pnpm install
```

Run the frontend:

```bash
pnpm --filter @workspace/artemis-education dev
```

Run the API:

```bash
pnpm --filter @workspace/api-server dev
```

## Vercel

This repository is prepared for a single Vercel project:

- static frontend output is built from `artifacts/artemis-education`
- API requests are served by `api/[...route].ts`
- client-side routes fall back to `index.html`

### Recommended environment variables

- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_CLERK_PROXY_URL`
- `VITE_API_BASE_URL` (optional; leave unset when frontend and API share the same Vercel deployment)

If the database or auth keys are missing, the app falls back to local demo/mock mode instead of crashing.
