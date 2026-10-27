# Adliens — Client Universe

React/Vite marketing-agency portfolio with a standalone cinematic entrance,
interactive client planets, flight-deck search, and campaign worlds.

## Production backend

The frontend and a Node.js Vercel Function deploy together. PostgreSQL is provided
by the dedicated `adliens-database` Neon integration. Better Auth manages passwords,
HttpOnly cookie sessions, sign-out, password changes, and database-backed login
rate limits. There is no public registration endpoint.

- `/` — isolated cinematic entrance; `/universe` and `/work` — published portfolio.
- `/admin/login` — administrator sign-in.
- `/admin/companies` — represented clients; deactivation hides their public work.
- `/admin/work` — drafts, published campaigns, and media uploads.
- `/admin/inquiries` — persisted contact submissions; mark read or archive.
- `/admin/settings` — introduction film and password changes.
- `/api/health` — database connectivity check.

Admin mutations are authorized on the server, validated, and use parameterized
queries. Contact submissions use a honeypot and persistent per-source rate limits.
Inquiries are saved in the inbox; email notifications are not configured.

Media is held in the private `adliens-media` Blob store. Only authenticated admins
can upload. A `/api/media/:id` route checks publication or the admin session before
issuing short-lived, object-scoped access. Draft images/video are not anonymous
assets. Uploaded media used by a published campaign or saved as the agency film
is intentionally visible to website visitors. No permanent public bucket is used.

The production database currently includes 12 demo clients and 24 sample campaigns,
clearly marked as concepts. They are central database records, not browser-local
fallbacks. Real work can be added through admin; preserve or clear its demo flag
as appropriate. Local browser demo edits are not automatically uploaded to production.

## Deployment

Vercel project: `km-93ea/adliens`. Production is configured with
`VITE_USE_MOCK_DATA=false` and `VITE_API_BASE_URL=/api`. Neon and Blob secrets are
server-only project environment variables. Never use `VITE_` for secrets.

`vercel.json` routes API requests to the backend and keeps SPA deep links working.
The GitHub repository is not automatically connected to Vercel; current releases
are direct source deployments. A Git push alone does not publish a new release.

After project linking and environment provisioning, use Vercel CLI to deploy:

```bash
vercel link --project adliens --scope km-93ea
vercel --prod
```

## Local visual preview with Docker Desktop

From the project folder, with Docker Desktop running Linux containers:

```powershell
$env:ADLIENS_PORT = "8081"
docker compose up --build -d
```

Open http://localhost:8081. The default Docker configuration serves a static,
local mock-data preview; it does not run the PostgreSQL backend. Demo admin accepts
any email/nonempty password only in this local mock mode. Browser demo edits persist
in localStorage for that origin. Rebuild after source changes; no hot reload.

```powershell
docker compose logs -f web
docker compose down
```

## Full backend development

Use Node.js 22.9+ or 24 and a separate development PostgreSQL database. Copy
`.env.example` to `.env.local`, supply its server-only values, configure
`VITE_USE_MOCK_DATA=false`, and set `APP_ORIGIN` to the actual local server origin.
Use a separate development Blob store, not production secrets.

```bash
npm ci
npm run db:setup
vercel dev
```

`db:setup` is an explicit, one-time owner command. Provide a password of at least
12 characters through the private environment file; optionally set `SEED_DEMO=true`.
The production database is already initialized. No public HTTP setup endpoint is
included in the finished deployment. For future Better Auth schema upgrades run
`npm run db:migrate` against the intended environment before releasing that upgrade.
Never run setup or migrations against an unrelated project database.

## Film and media

The introduction film can be uploaded or linked from `/admin/settings`; saving
it publishes it to the entrance. Native playback controls support pause and sound;
reduced-motion visitors start playback manually. Without a film, the entrance
shows atmospheric artwork. The enter link always remains available.

## Verification

```bash
npm test
npm run lint
npm run build
npx playwright install chromium
npm run test:browser
```

The browser suite exercises the local demo. Production verification additionally
covers real sign-in, blocked registration/anonymous admin access, CRUD, draft/public
visibility, inquiries, settings, and private-versus-published media access.

All credentials, session cookies, and `.vercel` state must remain outside Git.
