# Vitalize Health — Enterprise Full-Stack Application

A production-grade health media platform with a React 18 + Vite + TypeScript frontend
and a Node.js + Express backend that provides JWT-based authentication, role-based
access control, and CRUD APIs for all content types.

## Project layout

    /
    ├── backend/      # Express + TypeScript API (auth, RBAC, content, admin CRUD)
    └── src/          # React frontend (Vite + TS + Tailwind + TanStack Query + Zustand)

## Quick start (development)

Open two terminals — one for the backend, one for the frontend.

### Backend

    cd backend
    npm install
    cp .env.example .env       # then fill in real secrets — see backend/.env.example
    npm run migrate            # create the SQLite schema (db/vitalize.sqlite)
    npm run seed               # load initial articles, podcasts, experts, tips, plans, default users
    npm run dev                # http://localhost:3005

For local convenience, an `.env` file with valid bcrypt hashes for the
default credentials is generated automatically when you copy from `.env.example`
and edit the placeholders. The defaults are:

| Username | Password       | Role  |
|----------|----------------|-------|
| `admin`  | `vitalize2026` | admin |
| `reader` | `reader2026`   | user  |

> **Important**: never commit your `.env` file. Generate fresh `JWT_SECRET` /
> `JWT_REFRESH_SECRET` (64+ random chars) and bcrypt hashes for production.

### Frontend

    cd <repo root>
    npm install
    cp .env.example .env
    npm run dev                # http://localhost:5173

The frontend talks to the backend via `VITE_API_BASE_URL`, sending and
receiving httpOnly cookies for auth (no JWTs in `localStorage`).

## Architecture highlights

### Authentication & RBAC

- JWT access token (15 min) + refresh token (30 day) issued as `httpOnly`,
  `Secure` (in production), `SameSite=Strict` cookies.
- `requireAuth` middleware validates the access cookie and populates `req.user`.
- `requireAdmin` middleware blocks non-admin users with a 403 response.
- Login is rate-limited to 10 requests/minute per IP.
- Passwords are stored as bcrypt hashes only — plaintext is never logged.
- Refresh-token flow: on a 401 from any non-auth endpoint, the axios client
  silently calls `POST /api/auth/refresh` and retries the request once.

### Frontend routing

- `react-router-dom` v7 with `createBrowserRouter` and lazy-loaded pages.
- `<UserLayout>` wraps the public site (`/`, `/articles`, `/podcasts`, …).
- `<AdminLayout>` wraps the admin shell at `/admin/*` — completely separate
  navigation, sidebar, and top bar.
- Two route guards:
  - `ProtectedRoute` — redirects unauthenticated users to `/`.
  - `AdminRoute` — redirects non-admin users to `/`.
- `*` route falls through to the `404` page.

### Data flow

- Every page fetches via a TanStack Query hook (`useArticles`, `usePodcasts`,
  `useWellnessTips`, `usePlans`, `useUserStats`, plus admin CRUD hooks).
- Each hook validates the response shape with a Zod schema and converts
  errors into user-friendly messages via `lib/errors.ts`.
- Mutations call `useMutation` with `onSuccess` cache invalidation and toast
  notifications.

## Scripts

### Frontend

    npm run dev          # Start Vite dev server
    npm run build        # TypeScript check + Vite production build
    npm test             # Vitest run (auth.store, ProtectedRoute, AdminRoute)
    npm run type-check   # TS check only
    npm run lint         # ESLint

### Backend

    npm run dev              # tsx watch mode (autoreload)
    npm run start            # tsx (no watch)
    npm run type-check       # TS check only
    npm run migrate          # apply pending DB migrations
    npm run migrate:rollback # revert the most recently applied migration
    npm run migrate:status   # show applied / pending migrations
    npm run seed             # idempotently seed initial content + default users
    npm run db:reset         # delete the SQLite file, re-migrate, and re-seed

## Endpoints (high-level)

### Public auth

- `POST /api/auth/login`    — sign in (10/min rate-limited)
- `POST /api/auth/logout`   — clear cookies
- `POST /api/auth/refresh`  — exchange refresh cookie for new access cookie
- `GET  /api/auth/me`       — read current session (requires access cookie)

### Authenticated content

All require the access cookie:

- `GET /api/articles` `/podcasts` `/experts` `/tips` `/plans`
- `GET /api/user/stats`
- `GET /api/config/features`

### Admin (auth + admin role)

- `GET /api/admin/stats`
- `GET POST PUT DELETE /api/admin/articles[/:id]`
- `GET POST PUT DELETE /api/admin/podcasts[/:id]`
- `GET POST PUT DELETE /api/admin/experts[/:id]`
- `GET POST PUT DELETE /api/admin/tips[/:id]`

## Hardening already in place

- `helmet()` security headers
- Strict CORS origin allow-list with `credentials: true`
- `cookie-parser` for httpOnly cookies
- Zod validation on every POST/PUT body and on every API response on the
  frontend
- No secrets in any committed file (`.env` is gitignored, `.env.example`
  contains only placeholders)
- `express-rate-limit` on `/api/auth/login`
- Structured logging via `loglevel` — passwords are never logged

## Production checklist before going live

- [ ] Replace JWT secrets (`openssl rand -hex 64`)
- [ ] Replace bcrypt admin hash with a real production hash
- [ ] Configure HTTPS + HSTS, set `NODE_ENV=production` (enables `Secure` cookies)
- [ ] Send error events to Sentry / Datadog
- [ ] Configure a Content Security Policy in `helmet`
- [ ] Replace the demo admin/reader users with a real user table

## Persistence (SQLite or PostgreSQL)

The backend stores **all admin- and user-facing data** in a SQL database.
Two drivers are supported and selected via `DATABASE_CLIENT` in
`backend/.env`:

| `DATABASE_CLIENT` | Driver           | Connection                              |
|-------------------|------------------|-----------------------------------------|
| `sqlite` (default) | `better-sqlite3` | local file at `DATABASE_PATH`           |
| `postgres`        | `pg`             | `DATABASE_URL` (e.g. from docker-compose) |

The same migrations and seeds work on both — only the SQL dialect inside
the migration is branched on `db.dialect`. Switching is just an env var.

### Local Postgres via Docker

A `backend/docker-compose.yml` is included. From `backend/`:

    docker compose up -d              # start postgres on :5432
    # set DATABASE_CLIENT=postgres in backend/.env
    npm run migrate
    npm run seed
    npm run dev

Schema is managed through versioned migrations and seed data lives in
`backend/db/seed.ts`.

Tables:

| Table       | Holds                                                          |
|-------------|----------------------------------------------------------------|
| `users`     | admin & user accounts (bcrypt password hash, role)             |
| `articles`  | content shown on `/articles` and `/admin/articles`             |
| `podcasts`  | content shown on `/podcasts` and `/admin/podcasts`             |
| `experts`   | content shown on `/experts` and `/admin/experts`               |
| `tips`      | wellness tips shown across the user app and `/admin/tips`      |
| `plans`     | subscription plans shown on `/subscription`                    |
| `app_meta`  | key/value pairs (e.g. `subscriberCount` for the admin dashboard) |

All admin CRUD endpoints (`POST/PUT/DELETE /api/admin/articles|podcasts|experts|tips`)
write directly to these tables, so any change in `/admin/*` is durable across
server restarts and immediately visible to the user-facing endpoints.
