# Adliens — Client Universe

A React + Vite marketing agency portfolio centered on client work:

- Animated client folders and dedicated client worlds
- Campaign artwork and video viewers
- Explore/list views and service filters
- Dark lime theme, light mode, and mobile navigation
- Case study admin with local demo data and API integration scaffold

## Try locally with Docker (Windows / macOS / Linux)

Start Docker Desktop with Linux containers enabled. From this project folder:

```powershell
docker compose up --build -d
```

Open **http://localhost:8080**. No local Node.js installation, database, or `.env`
file is needed. The first build downloads dependencies; later builds reuse layers.
The port is bound to your own computer only.

Useful commands:

```powershell
# Show startup / health status
docker compose ps
# Follow web server logs (Ctrl+C stops following, not the container)
docker compose logs -f web
# Rebuild after changing the frontend
docker compose up --build -d
# Stop and remove the local container
docker compose down
```

Test the homepage, `/work`, and a direct client URL such as
http://localhost:8080/work/cmp-1. Refreshing a client URL should still work.
The `/healthz` endpoint returns `ok` and is used by the container health check.

### Optional configuration

If port 8080 is occupied, create the optional `.env` in PowerShell:

```powershell
Copy-Item .env.example .env
notepad .env
```

Set `ADLIENS_PORT=8081`, then run `docker compose up --build -d` and open
http://localhost:8081. Keep `.env` local. `VITE_*` settings are build-time values;
always rebuild after changing them. They are public browser configuration, not secrets.

### Demo data and contact form

Client folders and admin use sample data saved in **your browser's localStorage**.
Try `/admin/login` with any email and nonempty password in this mock mode. This is
only a frontend demo, not production authentication. Publish a case study in
`/admin/work` to see it in the public workspace in the same browser.

There is no backend in this repository or Docker setup. The contact form displays
an error until a real backend is connected; Docker does not enable email delivery.
`VITE_API_BASE_URL` must be an address reachable by your browser. Stopping Docker
does not erase browser data; changing the port creates a separate browser origin
and therefore a separate demo collection. Clear site data to reset the samples.

Docker serves the built site without hot reload. For live frontend editing use
Node.js 22 and the development commands below instead.

## Develop without Docker

```bash
npm ci
npm run dev -- --host 127.0.0.1
```

Published case studies from admin are shown in public `/work`.

## Backend integration (NestJS target endpoints)

- `POST /auth/login`
- `GET/POST/PATCH/DELETE /admin/companies`
- `GET/POST/PATCH/DELETE /admin/case-studies`
- `GET /case-studies?status=published`

## Client universe redesign

The public site now centers on published client work: animated folders, service filters,
Explore / All Projects views, client worlds at `/work/:companyId`, and campaign links
at `/work/:companyId?campaign=:caseStudyId`. Opening and closing a world preserves the
workspace view and filters; the close link also restores its scroll position.

Case studies can include `challenge`, `approach`, `imageUrl` (HTTPS image), and
`videoUrl` (HTTPS MP4). These fields are editable in the case study admin. Images
appear on folder covers and in the campaign viewer; videos use native playback
controls with no autoplay. Without an image, the site shows concept artwork.
The existing mock collection is explicitly labeled as demo content.

The default remains mock data stored in the visitor's browser. An actual API must
support the new optional fields when `VITE_USE_MOCK_DATA=false`. Contact submissions
still require the configured `POST /leads` backend; the frontend reports failures
and does not pretend to send messages locally. No backend is included in this repo.

### Hosting

Configure the host to serve `index.html` for application routes so client-world
links work when opened directly. Static assets should retain their normal handling.

### Accessibility and motion

Keyboard-accessible links and controls, native modal focus management and Escape
handling, a mobile menu, light/dark themes, and reduced-motion CSS are included.
The redesign uses CSS artwork and animations rather than adding a 3D runtime.

### Verification

Run `npm run lint` and `npm run build`. For the browser smoke suite, run
`npx playwright install chromium`, then `npm run test:browser`. It starts a local
Vite server and covers folder navigation, direct campaign URLs, viewer dismissal,
filters, view switching, all public routes at three widths, mobile navigation,
theme switching, and reduced motion. Screenshots go to ignored `test-results/`.
