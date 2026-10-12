# Velora

**Velora** is an online appointment booking app for a women's hair & beauty salon. It is a
frontend-only portfolio demo: everything runs in the browser, deploys to **Vercel**, installs as a
**PWA**, and builds as a desktop app with **Tauri 2**, all from one codebase.

The UI is in Persian (RTL) and uses the Jalali calendar, Persian digits, and prices in toman.

> نسخه نمایشی — داده‌ها فقط در مرورگر شما ذخیره می‌شوند

## Screenshots

| Home | Booking | Admin calendar |
| --- | --- | --- |
| _screenshot_ | _screenshot_ | _screenshot_ |

<!-- Add screenshots / a GIF to docs/ and link them here. -->

## Features

**Public site**
- Home page with hero, services grouped by category, team, gallery, hours, contact and a map placeholder
- PWA install button (hidden when already installed or running inside Tauri)
- Six-step booking flow: service → staff (or "any available") → Jalali date → time slot → phone + OTP → confirmation
  - The step lives in the URL (`?step=`), so the browser back button works
  - A live summary panel on desktop and a sticky action bar on mobile
  - Past days, closed days and fully booked days are disabled
  - Slots are grouped into morning, afternoon and evening
  - Download an `.ics` file to add the booking to your calendar
- "My appointments" page with upcoming and past tabs, plus cancellation

**Admin panel** (`/admin`, lazy-loaded)
- Calendar with a day view (one column per staff member, staff tabs on mobile) and a week view
- Confirm, cancel, mark done, reschedule and add notes from a side sheet
- Add phone bookings for an existing or new customer
- Summary cards: bookings, pending count, expected revenue
- Services CRUD, staff editing (services, weekly hours, time off), salon closures, slot interval, and a demo reset

**Global**
- Light and dark themes (follows the system theme by default), toasts, loading skeletons, empty states and a 404 page
- Keyboard accessible with visible focus rings; respects `prefers-reduced-motion`

## Demo credentials

| | |
| --- | --- |
| Admin | `admin` / `velora` |
| Customer OTP code | `1234` (any phone number starting with `09`) |

A booking made on the public site shows up in the admin calendar immediately, in the same browser
and across tabs.

## Tech stack

Vite · React 19 · TypeScript · Tailwind CSS v4 (`@theme` tokens) · React Router · TanStack Query ·
react-hook-form + zod · Motion · dayjs + jalaliday · lucide-react · vite-plugin-pwa · Tauri 2

## Architecture

```
pages / components  →  hooks (TanStack Query)  →  src/api/index.ts  →  src/api/mockDb.ts  →  localStorage
```

- `src/api/` is the only layer that knows where data lives. `mockDb.ts` stores everything under the
  `velora-db` localStorage key, seeds it from `seed.ts`, and adds 300–700 ms of latency.
- `src/lib/availability.ts` computes free slots from working hours, minus time off and existing
  appointments. `createAppointment` re-checks the slot before saving, so a double booking fails with a
  friendly error.
- Every successful mutation invalidates all queries, which keeps the customer and admin views in sync.

### Swapping in a real backend

Only `src/api/index.ts` needs to change. Each function already mirrors a REST endpoint
(`getServices` → `GET /api/services`, `createAppointment` → `POST /api/appointments`, and so on). Replace
the `readDb()`/`writeDb()` calls with `fetch` requests and delete `mockDb.ts` and `seed.ts`. Hooks
and pages stay as they are.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on port 5173 |
| `npm run build` | Type-check, then build to `dist/` (including the service worker) |
| `npm run preview` | Preview the production build |
| `npm run tauri:dev` | Run the desktop app in development |
| `npm run tauri:build` | Build desktop installers (`.msi` / `.exe` on Windows) |

`node scripts/icons.mjs` regenerates the PWA icons. Afterwards, run `npx tauri icon src-tauri/app-icon.png`
for the native icons.

## Deployment

- **Vercel**: build command `npm run build`, output directory `dist`. `vercel.json` rewrites every route
  to `index.html`. A custom domain is recommended, because `*.vercel.app` may be unreachable for some
  visitors in Iran.
- **Tauri**: requires Rust and the platform's WebView prerequisites
  (see the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)). The PWA plugin is turned
  off automatically when `TAURI_ENV_PLATFORM` is set.
