# VeltrixVault

A public-data football analytics workspace. Explore league tables and team records, run a transparent expected-goals model, and keep your own analyses in a private account.

VeltrixVault is an analysis and education tool. It is **not** a betting product: there are no tips, deposits, commissions, or guaranteed outcomes.

## What is included

| Area | What it does |
| --- | --- |
| **League explorer** | Tables, home/away splits, recent form, results, and team profiles for six competition snapshots. |
| **Match Lab** | Pick two teams from the same competition and get an independent-Poisson distribution: expected goals, result probabilities, over/under 2.5, both teams to score, and the five most likely scorelines. Runs without an account. |
| **Free accounts** | Email/password signup with verification, password reset, and DB-backed sessions. No payment flow. |
| **Saved analyses** | Store a model snapshot with your own notes. Detail pages show the values frozen at save time, not a recomputed result. |
| **Watchlist** | Bookmark teams you care about. No alerts or recommendations. |
| **Invite a friend** | A plain referral code and shareable link that records who joined. No cash rewards, tiers, or commissions. |
| **Methodology** | A readable explanation of the model, its inputs, and its limits. |

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, Framer Motion, Lucide React
- **Forms:** React Hook Form + Zod
- **Database:** Prisma 6 — SQLite for local development, PostgreSQL for production
- **Auth:** Custom DB-backed sessions, scrypt password hashing, HTTP-only cookies, same-origin checks, rate limiting, hashed-IP audit trail
- **Tests:** Vitest (unit) + Playwright (E2E, desktop and mobile projects)

## Data

Match data comes from the public-domain [OpenFootball football.json](https://github.com/openfootball/football.json) archives, normalised by `scripts/build-dataset.ts` into `src/data/dataset.json` and seeded into the database.

The bundled snapshot contains **six competitions, 116 teams, 1,683 matches, and 4,985 goals** (latest result 20 September 2026). Five competitions are partial 2025/26 seasons and one is a partial 2026/27 Premier League season. Every competition is explicitly marked incomplete in the UI; the app never presents a snapshot as a finished season.

Static marketing pages read this committed dataset directly via `src/lib/public-data.ts`, so `npm run build` does not need `DATABASE_URL` or a seeded database. Dynamic routes and user data still use Prisma.

## Model

The Match Lab uses a deliberately simple **independent-Poisson goals model**:

1. Estimate home and away attack/defence rates from each team's split goal record.
2. Shrink rates toward the league average with six pseudo-matches so small samples cannot dominate.
3. Combine the two teams' rates into expected goals (λ).
4. Build the scoreline matrix from the product of two Poisson distributions.

Limits are shown in the product: the model does not see line-ups, injuries, travel, weather, or motivation. Output is a statistical estimate, not a forecast or betting advice. The full formula and disclosure live in `src/lib/model/poisson.ts` and on `/methodology`.

## Local setup

### Prerequisites

- Node.js 20.19+ (Node 22 LTS recommended)
- npm

### Steps

```bash
npm install
cp .env.example .env
npm run setup        # build dataset → push Prisma schema → seed the database
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm run setup` is equivalent to:

```bash
npm run data:build   # data/football/*.json → src/data/dataset.json
npm run db:push      # create/update the SQLite schema
npm run db:seed      # load competitions, teams, matches
```

Without a mail provider, verification and password-reset links are printed to the dev server console and returned to the originating form in development, so the full account flow is testable locally.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Generate Prisma Client and build for production |
| `npm run start` | Serve a production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright E2E tests (starts its own dev server) |
| `npm run data:build` | Rebuild the normalised dataset from public archives |
| `npm run db:push` | Apply the Prisma schema |
| `npm run db:seed` | Seed public data |
| `npm run db:reset` | Recreate and reseed the local database |
| `npm run setup` | `data:build` + `db:push` + `db:seed` |

## Verification

```bash
npm run typecheck
npm run lint
npm test            # 23 unit tests
npm run test:e2e    # 16 E2E tests across desktop and mobile
npm run build
```

The health endpoint (`GET /api/health`) runs `SELECT 1` against the database and returns `503` when the database is unreachable.

## Project layout

```
src/
  app/
    (marketing)/        Homepage, analytics, team profiles, method, legal pages
    (auth)/             Login, signup, reset, verification pages
    (app)/dashboard/    Private workspace pages
    api/                Auth, analyses, watchlist, model, health endpoints
  components/
    analytics/          Tables, match list, prediction card, Match Lab form
    auth/               Auth forms
    dashboard/          Dashboard shell, forms, action buttons
    layout/             Header, footer, logo, status screens
    ui/                 Buttons, fields, badges, charts, shared primitives
  content/              All product copy in one place (site, marketing, product, legal)
  data/                 Generated dataset.json
  lib/                  Auth, DB, validation, rate limiting, model, queries, public dataset, mail, HTTP helpers
prisma/                 Schema and seed
scripts/                Dataset build script
tests/unit/             Vitest suites
tests/e2e/              Playwright suites
docs/deployment.md      Production deployment guide
```

## Deployment

See [docs/deployment.md](docs/deployment.md) for the production checklist, PostgreSQL migration, environment variables, and operational notes.

## Licensing and attribution

- Application code and copy are original to this project.
- Match data is public domain, sourced from [OpenFootball](https://github.com/openfootball/football.json) and attributed in the UI and footer.
- No reference-site assets, copy, or betting/affiliate mechanics are used.
