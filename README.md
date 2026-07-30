# Marketing Agency Website 

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

Published case studies from admin are shown in public `/work`.

## Backend integration (NestJS target endpoints)

- `POST /auth/login`
- `GET/POST/PATCH/DELETE /admin/companies`
- `GET/POST/PATCH/DELETE /admin/case-studies`
- `GET /case-studies?status=published`
