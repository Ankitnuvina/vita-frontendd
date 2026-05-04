# Vitalize Health — Complete User Guide

> Everything you need to install, run, sign in, and use Vitalize Health as either
> a regular user or an administrator.

---

## Table of contents

1. [System overview](#1-system-overview)
2. [Prerequisites](#2-prerequisites)
3. [Installation](#3-installation)
4. [Running the stack](#4-running-the-stack)
5. [Built-in test accounts](#5-built-in-test-accounts)
6. [Signing up and signing in (users)](#6-signing-up-and-signing-in-users)
7. [Admin login & registration (hidden URLs)](#7-admin-login--registration-hidden-urls)
8. [User journey — what every signed-in user can do](#8-user-journey)
9. [Admin journey — full CMS walkthrough](#9-admin-journey)
10. [Public anonymous experience](#10-public-anonymous-experience)
11. [How authentication and security work](#11-how-authentication-and-security-work)
12. [Troubleshooting](#12-troubleshooting)
13. [Postman collection](#13-postman-collection)

---

## 1. System overview

Vitalize Health is a two-tier full-stack application:

```
┌──────────────────────────┐         httpOnly cookies          ┌──────────────────────────┐
│   Frontend (Vite + React)│  ◄──────────────────────────────► │ Backend (Express + JWT)  │
│   http://localhost:5173  │  /api/auth/*  /api/articles  ...  │ http://localhost:3005    │
└──────────────────────────┘                                   └──────────────────────────┘
```

- **Frontend** — React 18 + TypeScript + Tailwind, with React Router, TanStack Query, Zustand, Zod-validated responses, and a route-guarded admin shell.
- **Backend** — Node.js + Express + TypeScript with JWT (access + refresh tokens) stored in `httpOnly` cookies, RBAC middleware, rate-limited login, and Zod-validated request bodies.
- **Two roles** — `admin` and `user`. Both can read content; only `admin` can mutate it.

---

## 2. Prerequisites

| Tool      | Version              |
|-----------|----------------------|
| Node.js   | 20 LTS or newer      |
| npm       | 10+                  |
| (Browser) | Chrome / Edge / Firefox / Safari |

No database is required for local development — the backend ships with an in-memory store seeded from `backend/data/seed.ts`.

---

## 3. Installation

The repository contains two packages that must be installed independently:

```bash
# 1) Frontend
cd vitalize-enterprise
npm install

# 2) Backend
cd backend
npm install
```

### Environment files

Both apps need a `.env` file. The repo includes an `.env.example` for each.

**Frontend** — `vitalize-enterprise/.env`:

```env
VITE_APP_NAME=Vitalize Health
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:3005
```

**Backend** — `vitalize-enterprise/backend/.env` (an example file with valid bcrypt hashes for the demo accounts is committed as `backend/.env`; in production replace every value):

```env
PORT=3005
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
COOKIE_DOMAIN=localhost

# Generate with: openssl rand -hex 64
JWT_SECRET=<64+ random chars>
JWT_REFRESH_SECRET=<different 64+ random chars>
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d

# Generate with: node -e "import('bcryptjs').then(b=>b.default.hash('your_password',12).then(console.log))"
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<bcrypt hash>
USER_USERNAME=reader
USER_PASSWORD_HASH=<bcrypt hash>

# Operator-only secret. Required to register a new admin via /admin/register.
# Anyone with this code can self-register as admin, so treat it like a password.
# Generate with: openssl rand -hex 24
ADMIN_INVITE_CODE=<long random string>
```

> Never commit a `.env` file. Both apps' `.gitignore` already exclude it.

---

## 4. Running the stack

You need two terminals, one per service.

### Terminal A — backend

```bash
cd vitalize-enterprise/backend
npm run dev          # auto-reloads on file changes
# OR
npm run start        # one-shot
```

You should see:

```
[server] Listening on http://localhost:3005 (development)
[server] CORS origins: http://localhost:5173
```

### Terminal B — frontend

```bash
cd vitalize-enterprise
npm run dev
```

Vite will print:

```
  ➜  Local:   http://localhost:5173/
```

Open `http://localhost:5173` in your browser.

### Other useful scripts

| Where     | Command              | Purpose                                    |
|-----------|----------------------|--------------------------------------------|
| frontend  | `npm run lint`       | ESLint                                     |
| frontend  | `npm run type-check` | TypeScript only                            |
| frontend  | `npm test`           | Vitest run (auth, route guards)            |
| frontend  | `npm run build`      | Production build → `dist/`                 |
| backend   | `npm run type-check` | TypeScript only                            |

---

## 5. Built-in test accounts

The backend ships with two pre-seeded credentials so you can test both roles immediately:

| Username | Password       | Role  | What they can do                          |
|----------|----------------|-------|-------------------------------------------|
| `admin`  | `vitalize2026` | admin | Everything a user can + the entire CMS    |
| `reader` | `reader2026`   | user  | Read all content, view their own dashboard |

You can also self-register new accounts at runtime:

| Account type | Where to register | What you need |
|---|---|---|
| Regular user | The "Sign Up" tab in the navbar **Sign In** dialog | Username + password |
| Admin       | Direct URL `/admin/register` (no UI link anywhere) | Username + password + the operator's `ADMIN_INVITE_CODE` |

> **Production**: replace seeded creds by editing `backend/.env` and re-generating bcrypt hashes. Rotate `ADMIN_INVITE_CODE` to revoke the ability to self-register new admins.

---

## 6. Signing up and signing in (users)

### Sign up (new user)

1. Open `http://localhost:5173`.
2. Click **Sign In** in the top-right of the navbar.
3. Switch to the **Sign Up** tab inside the dialog.
4. Pick a username (3–32 chars: letters, numbers, `_`, `.`, `-`) and a password (8+ chars).
5. Submit. The backend creates the account with role `user`, signs you in, and the dialog closes automatically.

> Endpoint: `POST /api/auth/register`. The response is just `{ userId, role }`; the JWT is set as `httpOnly` cookies. New accounts are stored in the in-memory user store and survive until backend restart (swap to a real DB in production — see §11).

### Sign in (existing user)

1. Same dialog → **Sign In** tab.
2. Enter username + password.
3. The dialog closes on success.

> Endpoint: `POST /api/auth/login`. Rate-limited to 10 requests/min/IP.

### Stay signed in across reloads

When you reload, the app calls `GET /api/auth/me` once on mount. If your
access cookie is still valid, your session is restored automatically.

When the access token expires (15 min), the next API call gets a 401, the axios
interceptor silently calls `POST /api/auth/refresh`, retries the request once,
and you stay signed in. The refresh cookie is valid for 30 days.

### Sign out

Click **Sign Out** in the navbar (or the **Logout** button in the admin shell).
The backend clears both cookies, the frontend clears the in-memory user, and
TanStack Query disables all authenticated queries.

---

## 7. Admin login & registration (hidden URLs)

The admin entry points are deliberately **not linked anywhere** in the public
UI. There is no "Admin Login" button on the navbar — you must know the URL.

### Admin login

- **URL**: `http://localhost:5173/admin/login`
- **API**: `POST /api/auth/admin/login`
- A separate dark-themed page with username + password fields.
- The backend handler verifies the password **and** rejects the request with
  `403 Forbidden` if the account's role is not `admin` — so even if a regular
  user enters their valid credentials here, they cannot impersonate admin.
- On success, you're redirected straight to `/admin`.
- Rate-limited to 5 attempts/min/IP.

### Admin registration (invite-code gated)

- **URL**: `http://localhost:5173/admin/register`
- **API**: `POST /api/auth/admin/register`
- A page with **username**, **password**, **confirm password**, and an
  **invite code** field.
- The invite code must match the server's `ADMIN_INVITE_CODE` env var.
- Without the correct code, the backend returns `403 Forbidden — Invalid admin
  invite code`. URL discovery alone is **not** enough to create an admin.
- On success, the new admin account is created, you're auto-signed-in, and
  redirected to `/admin`.

> **Why this design?** Admin login and signup are URL-only because they should
> never be advertised. The registration is *also* gated by a server-side
> shared secret so that even if someone discovers the URL, they cannot escalate
> to admin without operator cooperation. Rotate `ADMIN_INVITE_CODE` whenever
> someone with the code leaves the team.

### What happens if a user types `/admin` directly?

- Not authenticated → redirected to `/admin/login`.
- Authenticated as a regular user → redirected to `/admin/login` (they can
  then log in with admin credentials, or follow the page's link to register
  with an invite code).
- Authenticated as admin → admin dashboard renders normally.

---

## 8. User journey

What a signed-in user (admin **or** reader) can do on the public site.

### 8.1 Home (`/`)

The hero, articles, AI assistant teaser, daily wellness tips, expert grid, and a
subscription preview. While each section loads, you'll see animated skeletons;
on error, an inline error card with a Retry button.

### 8.2 Articles library (`/articles`)

- Sticky category pills filter by topic (Mental Health, Nutrition, Fitness, Mindfulness, Longevity, Biohacking).
- Search bar filters by title or author in real time.
- Premium articles get a **Premium** badge.
- "Clear Filters" button when nothing matches.

### 8.3 Podcasts (`/podcasts`)

- Hero with subscribe-on-X CTAs.
- Grid of episodes with category, guest, duration, date.
- Episode card play / save buttons (UI only — wire up to your audio backend).

### 8.4 Videos (`/videos`)

- Static video grid. (Video CMS not yet wired to the backend; ready to plug in.)

### 8.5 AI assistant (`/ai`)

- Sample-topic chips that pre-fill questions.
- Live chat with the **Vita** AI persona via `POST /chat` (requires a chat
  service — see `src/features/ai/services/chat.service.ts`).
- "New conversation" resets the message history.
- Compliance disclaimer is always shown.

### 8.6 Dashboard (`/dashboard`) — protected

- Visible only to signed-in users (the `ProtectedRoute` guard).
- Stats cards from `GET /api/user/stats`: streak count, articles read, podcasts
  listened, AI queries.
- Weekly wellness chart, 28-day streak heatmap, four health metric bars.
- Reading list pulled from `GET /api/articles`.
- Welcome line uses your real `userId`.

### 8.7 Subscription (`/subscription`)

- Three plans (Free, Wellness+, Pro) loaded from `GET /api/plans`.
- Monthly/Annual toggle, FAQ accordion, trust badges.

### 8.8 Streak badge in the navbar

When `streakCount > 0`, the navbar shows a `🔥 N days` chip linked to the
dashboard. Hidden for anonymous users and zero-streak users.

---

## 9. Admin journey

Available only to users whose role is `admin` (in our case the `admin` account).

### 9.1 Entering the admin shell

There are two ways to reach `/admin`:

1. **Via the dedicated admin login page** — type `/admin/login` directly. After
   signing in with admin credentials you're redirected to `/admin`.
2. **From the public site as an already-signed-in admin** — once your role is
   `admin`, the navbar reveals an **Admin** link that takes you straight in.

`/admin` itself is wrapped in two guards:

1. `AdminRoute` — redirects to `/admin/login` if not signed in or if role
   isn't `admin`.
2. `AdminLayout` — switches to a full-screen two-column shell (sidebar + main).

> Tip: if you visit `/admin` while signed in as `reader`, you're bounced to
> `/admin/login` (where you could sign in as a different account if you have
> admin credentials).

### 9.2 Admin shell layout

```
┌──────────────┬───────────────────────────────────────────────┐
│ Vitalize     │  Page Title                       [✕ Exit]    │
│  Admin CMS   │ ┌────────────────────────────────────────────┐│
│              │ │                                            ││
│ 📊 Dashboard │ │            (page content)                  ││
│ 📝 Articles  │ │                                            ││
│ 🎧 Podcasts  │ │                                            ││
│ 👩‍⚕️ Experts  │ │                                            ││
│ 💡 Tips      │ │                                            ││
│ ⚙️ Settings  │ │                                            ││
│              │ │                                            ││
│ ─────────    │ │                                            ││
│ Signed in    │ │                                            ││
│ admin-1      │ │                                            ││
│ [admin]      │ │                                            ││
│ 🚪 Logout    │ │                                            ││
└──────────────┴───────────────────────────────────────────────┘
```

The sidebar shows the active page, the current admin's `userId` and `role`
badge, and a logout button. Click **Exit Admin** in the top bar to return to `/`.

### 9.3 Admin → Dashboard (`/admin`)

Four stat cards from `GET /api/admin/stats`:

- 📝 Articles
- 🎧 Podcasts
- 👩‍⚕️ Experts
- 👥 Subscribers

Below: the most recent five articles with their premium status.

### 9.4 Admin → CRUD pages

The four CRUD pages (`/admin/articles`, `/admin/podcasts`, `/admin/experts`,
`/admin/tips`) all share the same UX pattern.

#### Listing

A data table with sortable rows. Each row has **Edit** and **Delete** buttons
in the rightmost column. Top-right has a green **+ New …** button.

#### Creating

1. Click **+ New Article** (or Podcast, Expert, Tip).
2. A right-side slide-over panel appears with a Zod-validated form.
3. Fill the required fields. Inline validation errors appear under each input.
4. Click the green confirm button.
5. On success: the panel closes, the table refreshes (TanStack Query cache
   invalidation), and a success toast appears bottom-right.
6. On failure: the panel stays open, the error appears at the top of the form
   and a red toast appears bottom-right.

#### Editing

1. Click **Edit** on any row → the same slide-over form opens, pre-populated.
2. Modify the fields, click **Update**.
3. Same toast/cache feedback as create.

#### Deleting

1. Click **Delete** on any row → confirmation dialog with the item name.
2. Click the red **Delete** button.
3. Item disappears from the table, the public site's article/podcast/etc. cache
   is also invalidated, success toast appears.

### 9.5 Admin → Settings (`/admin/settings`)

Shows the current admin's `userId` and `role`. Has a red **Sign out** button
that calls `POST /api/auth/logout` and routes back to `/`.

### 9.6 What admin actions are blocked at the API layer

Every `/api/admin/*` route requires:

1. A valid access cookie (`requireAuth`)
2. The user's `role === 'admin'` (`requireAdmin`)

A `reader` calling any admin endpoint receives `403 Forbidden`. An anonymous
caller receives `401 Authentication required`.

---

## 10. Public anonymous experience

What an anonymous (not signed-in) visitor sees:

- The full marketing chrome: navbar, hero, footer.
- The **Sign In** button in the navbar.
- The **Get Started Free** CTA (which links to `/subscription`).
- All page routes are reachable, but every TanStack Query that needs auth is
  disabled (we gate on `isAuthenticated`), so anonymous visitors see the static
  layout and empty/skeleton states for content sections — they're prompted to
  sign in before they can browse the actual articles, podcasts, etc.
- `/dashboard` redirects to `/` (via `ProtectedRoute`).
- `/admin/*` redirects to `/` (via `AdminRoute`).
- Any unknown URL renders the `404` page.

---

## 11. How authentication and security work

### Tokens

| Cookie               | Lifetime | Purpose                                               |
|----------------------|----------|-------------------------------------------------------|
| `auth_token`         | 15 min   | Sent on every request; verified by `requireAuth`      |
| `auth_refresh_token` | 30 days  | Used by `POST /api/auth/refresh` to issue a new pair  |

Both cookies are set with:

- `httpOnly: true` — JavaScript cannot read them (immune to XSS exfiltration).
- `secure: true` in production — only sent over HTTPS.
- `sameSite: strict` in production / `lax` in development — CSRF mitigation.

### Refresh flow

```
Frontend                                     Backend
   │                                            │
   ├── GET /api/articles (cookie expired) ─────►│
   │◄────────────── 401 Unauthorized ───────────┤
   │                                            │
   ├── POST /api/auth/refresh ─────────────────►│
   │   (refresh cookie still valid)             │
   │◄── 200 + new auth_token + new refresh ────┤
   │                                            │
   ├── GET /api/articles (retried) ────────────►│
   │◄────────────── 200 [...articles] ──────────┤
```

If the refresh cookie has also expired, the axios interceptor invokes the
auth-failure handler registered by the auth store, which clears in-memory
state. The next render redirects guarded routes back to `/`.

### Hardening already in place

- `helmet()` security headers
- Strict CORS origin allow-list with `credentials: true`
- `cookie-parser`
- `express-rate-limit` — 10 login attempts per minute per IP
- bcrypt-only password storage
- Zod validation on every POST/PUT body and on every API response on the
  frontend
- Structured logging via `loglevel`; passwords are never logged
- No JWT in `localStorage`, no secrets in any committed file

---

## 12. Troubleshooting

| Symptom                                              | Likely cause                                                                                 |
|------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| Login dialog shows "Network request failed"          | Backend not running on port 3005 or `VITE_API_BASE_URL` mismatch                              |
| Browser console shows CORS error                     | Add your origin to `CORS_ORIGIN` (comma-separated) in `backend/.env`, restart the backend     |
| Session does not persist on reload                   | Browser is blocking third-party cookies; serve frontend and backend from the same domain     |
| 429 Too Many Requests on `/api/auth/login`           | You hit the 10 / min rate limit — wait a minute                                               |
| Backend fails to start with "Missing JWT_SECRET"     | Copy `backend/.env.example` to `backend/.env` and fill in 64+ char random secrets             |
| Backend fails to start with "Missing ADMIN_INVITE_CODE" | Add `ADMIN_INVITE_CODE=<long random>` to `backend/.env`                                     |
| Admin sees 403 on a CRUD endpoint                    | Cookie was cleared / expired; sign back in                                                    |
| `/admin/login` accepts password but returns 403      | The account is not an admin — use `/admin/register` with the invite code, or sign in with an admin account |
| `/admin/register` returns 403 "Invalid admin invite code" | The `ADMIN_INVITE_CODE` you entered does not match `backend/.env`                          |
| New users disappear after backend restart           | The user store is in-memory by design — swap to a real DB (e.g. SQLite via Prisma) for persistence |
| `npm run build` complains about types in tests       | Make sure `noUnusedLocals` is satisfied — don't import unused symbols                         |

---

## 13. Postman collection

A ready-to-import collection lives at:

```
docs/Vitalize-Health.postman_collection.json
```

### How to use it

1. Open Postman → **Import** → select that file.
2. Open the imported collection's **Variables** tab and confirm `baseUrl` is
   `http://localhost:3005` (default).
3. Run the requests in this order:
   1. **Auth → Login as admin** (or **Login as reader**) — Postman stores the
      cookies automatically because every request has cookie jar enabled by
      default.
   2. Any of the **Content** or **Admin** requests.
   3. **Auth → Refresh** — issues a new cookie pair without re-entering creds.
   4. **Auth → Logout** — clears the cookies.

> The collection uses Postman's built-in cookie jar; no `Authorization`
> header is needed because the backend reads cookies (mirrors the frontend).
> Make sure `Send cookies` is **on** (it is by default in modern Postman).

### What's included

- Health: `GET /api/health`
- Auth: `POST /login`, `POST /logout`, `POST /refresh`, `GET /me`
- Content (auth required): `GET /articles`, `/podcasts`, `/experts`, `/tips`,
  `/plans`, `/user/stats`, `/config/features`
- Admin (admin role required): `GET /admin/stats`, full CRUD for
  `/admin/articles`, `/admin/podcasts`, `/admin/experts`, `/admin/tips`

Each create/update body has a working JSON example you can edit and send
straight away.
