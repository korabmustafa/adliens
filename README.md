# Adliens Agency Website

A multi-page React + Tailwind website for Adliens with:
- Modern neon/dark + light mode UI
- Lamp-style theme toggle
- Mobile-first responsive layout
- Multilingual-ready text provider scaffold
- NestJS-ready API layer for lead capture
- Fast MVP admin dashboard with mock data mode

## Setup

```bash
npm install
npm run dev
```

## Env configuration

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK_DATA=true
```

- `VITE_USE_MOCK_DATA=true` uses a localStorage-backed admin data store.
- Set `VITE_USE_MOCK_DATA=false` when NestJS admin APIs are live.

## Admin MVP routes

- `/admin/login` (mock login; any email/password)
- `/admin/companies` (CRUD company profiles)
- `/admin/work` (CRUD case studies)

Published case studies from admin are shown in public `/work`.

## Backend integration (NestJS target endpoints)

- `POST /auth/login`
- `GET/POST/PATCH/DELETE /admin/companies`
- `GET/POST/PATCH/DELETE /admin/case-studies`
- `GET /case-studies?status=published`
