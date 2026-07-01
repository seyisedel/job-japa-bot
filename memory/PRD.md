# JobJapa Admin Dashboard — PRD

## Original Problem Statement
Build a web admin dashboard for a Nigerian career services app called **JobJapa**. It needs:
- A **user list** showing phone number, subscription status, CV rewrites used, and join date
- A **payments table** showing reference, amount, type, and status
- A **stats header** showing total users, total Pro subscribers, and monthly revenue in Naira
- Connect to a **Supabase** database using the Supabase JS client
- Use environment variables for the Supabase URL and key
- Clean, professional design

## Architecture
- **Frontend:** React 18 (CRA) + Tailwind CSS + lucide-react + @supabase/supabase-js (v2.45.4)
- **Backend:** Minimal FastAPI (`/api/health` only) — the dashboard talks directly to Supabase from the browser.
- **Data:** Supabase (`users`, `payments` tables). A mock-data fallback (`/app/frontend/src/lib/mockData.js`) auto-activates when Supabase env vars are placeholders, so the dashboard is fully browsable before credentials are wired.

## User Personas
- **Ops / Admin** — internal JobJapa staff monitoring accounts, subscriptions, and revenue.

## Core Requirements (Static)
1. Stats header: Total Users, Pro Subscribers, Monthly Revenue (₦)
2. Users table: phone number, subscription (badge), CV rewrites, joined date
3. Payments table: reference, amount (₦), type, status (badge), date
4. Supabase JS client integration driven by `REACT_APP_SUPABASE_URL` + `REACT_APP_SUPABASE_ANON_KEY`
5. Clean, professional visual language

## What's Been Implemented (2026-07-01)
- Distinctive design system per `/app/design_guidelines.json`: Deep Emerald + Ochre palette, Outfit + IBM Plex Sans, sharp 1px-border surfaces
- Sticky top nav with brand, data-source indicator, and Refresh action
- Preview-mode banner explaining how to swap in real Supabase creds
- Three stat cards with icons and helper text (Total Users, Pro Subscribers, Monthly Revenue)
- Users table: search (phone), status filter (All/Pro/Free/Expired), pagination (10/page)
- Payments table: search (reference), status filter (All/Success/Pending/Failed), pagination (10/page)
- Skeleton loaders, empty-state rows, error banner
- Full data-testid coverage for every interactive/informational element
- Seeded mock dataset (47 users, 68 payments) with at least 18 successful payments dated inside the current month so the revenue stat is meaningful in preview
- Backend `/api/health` endpoint (supervisor liveness only)
- E2E tests via testing subagent — 100% pass rate (iteration_1.json)

## File Map
- `/app/frontend/src/App.js` — dashboard shell, stats, refresh, banners
- `/app/frontend/src/components/StatCard.jsx`
- `/app/frontend/src/components/StatusBadge.jsx`
- `/app/frontend/src/components/UsersTable.jsx` (also exports shared `Pagination`)
- `/app/frontend/src/components/PaymentsTable.jsx`
- `/app/frontend/src/lib/supabaseClient.js` — creates client OR flips `USE_MOCK_DATA`
- `/app/frontend/src/lib/api.js` — fetchers, formatters (`formatNaira`, `formatDate`), `computeStats`
- `/app/frontend/src/lib/mockData.js` — seeded users + payments
- `/app/backend/server.py` — FastAPI health service

## How to Connect Real Supabase
1. In Supabase, ensure tables:
   - `users(id, phone_number text, subscription_status text, cv_rewrites_used int, created_at timestamptz)`
   - `payments(id, reference text, amount numeric, type text, status text, created_at timestamptz)`
2. In `/app/frontend/.env` set:
   - `REACT_APP_SUPABASE_URL=https://<project>.supabase.co`
   - `REACT_APP_SUPABASE_ANON_KEY=<anon key>`
   - Optionally set `REACT_APP_USE_MOCK_DATA=false` (auto when URL/key are real)
3. Restart frontend: `sudo supervisorctl restart frontend`
4. Configure Row Level Security policies to allow the anon key to `select` these tables from the browser (or gate the dashboard with Supabase Auth — see backlog).

## Prioritized Backlog
- **P1** — Admin authentication (Supabase Auth email/password or Emergent Google Auth) before exposing tables
- **P1** — CSV export for both tables
- **P2** — Charts: revenue trend line, subscription funnel
- **P2** — Row detail drawer (click a user/payment to see full history)
- **P2** — Date-range filter on Payments and revenue stat
- **P3** — Multi-currency support / FX awareness for international users

## Next Tasks
- User to plug in real Supabase URL + anon key
- Add auth gate once real data is connected

## Test Reports
- `/app/test_reports/iteration_1.json` — 100% backend + frontend pass, one design suggestion (mock revenue = ₦0) already resolved.
