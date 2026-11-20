# Deployment guide

This guide covers a production deployment of VeltrixVault. The application runs on Node.js with a relational database through Prisma. Local development uses SQLite; production should use PostgreSQL.

## 1. Prerequisites

- Node.js 20.19+ (Node 22 LTS recommended)
- npm
- A PostgreSQL 14+ database (managed or self-hosted)
- A domain with HTTPS
- Optionally, a [Resend](https://resend.com) API key and a verified sender domain for transactional email

> SQLite is intentionally used for local development only. Most serverless and container platforms have read-only or ephemeral filesystems, so `file:./dev.db` will not persist. Use PostgreSQL in production.

## 2. Environment variables

Copy `.env.example` and set the following in your hosting platform's environment settings. Never commit `.env`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes at runtime and seeding | PostgreSQL connection string, e.g. `postgresql://user:pass@host:5432/veltrixvault?schema=public`. Not needed during `next build` (see below). |
| `NEXT_PUBLIC_APP_URL` | Yes | Canonical origin with no trailing slash, e.g. `https://analytics.example.com`. Used for metadata, invite links, and emails. |
| `IP_HASH_SECRET` | **Yes in production** | Long random string used to pseudonymise IPs in the audit trail. The app throws at startup if missing when `NODE_ENV=production`. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| `RESEND_API_KEY` | Recommended | Enables verification and password-reset emails. Without it, links are logged server-side but not delivered to users. |
| `MAIL_FROM` | If email enabled | Verified sender, e.g. `VeltrixVault <no-reply@example.com>`. |

`NODE_ENV` is set to `production` by Next.js during build and start. Secure cookies, the production Content-Security-Policy, and other security headers are enabled automatically in that mode.

The prerendered marketing pages (`/` and `/analytics`) read the committed `src/data/dataset.json` through `src/lib/public-data.ts`, not the database. A clean `npm run build` therefore succeeds without `DATABASE_URL` or a seeded database — useful for CI and container image builds. `DATABASE_URL` must still be present when seeding and when the app serves dynamic routes (league/team pages, Match Lab, accounts, APIs).

## 3. Switch Prisma to PostgreSQL

The committed schema targets SQLite. Before building for production, change the datasource in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

No model changes are needed. Then apply the schema and load the public data:

```bash
npm install
npm run db:push
npm run db:seed
```

`npm run db:seed` loads competitions, teams, and matches from `src/data/dataset.json`. It is idempotent enough for a fresh database; do not run it repeatedly against a database that contains user data without reviewing `prisma/seed.ts`.

The normalised dataset is already committed at `src/data/dataset.json`. To rebuild it from the public archives in `data/football/`:

```bash
npm run data:build
```

## 4. Build and start

```bash
npm run build
npm run start
```

`npm run build` runs `prisma generate` before `next build`, so the Prisma Client matches the deployed schema. Set a port with `npm run start -- -p 3000` or via your platform's `PORT` environment variable.

A minimal `Dockerfile` style process for reference:

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package*.json ./
EXPOSE 3000
CMD ["npm", "run", "start"]
```

Apply the schema and seed as a release step or one-off job against the production database before serving traffic.

## 5. Health checks and observability

- `GET /api/health` executes `SELECT 1` and returns `{ "status": "ok", ... }` or HTTP 503 with `{ "status": "unavailable" }`.
- Use that endpoint for load-balancer and container health checks.
- The app logs failed health checks and unexpected server errors to stdout/stderr. Ship logs to your usual aggregator.
- Verification and reset tokens are stored as hashes; raw tokens appear only in sent emails or dev console output.

## 6. Security notes

- Sessions are DB-backed with hashed tokens in HTTP-only cookies; logout revokes the session server-side.
- Passwords are hashed with scrypt (N=16384, r=8, p=1).
- All mutating APIs require a same-origin request header; cross-origin writes are rejected.
- Login, signup, password reset, verification resend, model runs, and account deletion are rate limited.
- The current rate limiter is in-process (`src/lib/rate-limit.ts`). If you run **more than one Node instance**, replace its `Map` store with Redis or another shared store so limits are enforced globally. The module exposes `rateLimit()` and `resetRateLimits()`; keep that interface when swapping the backend.
- Production security headers, including a Content-Security-Policy, are configured in `next.config.ts`. If you add a third-party script or font, update the CSP allowlist there.
- Do not expose `IP_HASH_SECRET` to the client. Only `NEXT_PUBLIC_APP_URL` is public by design.

## 7. Email delivery

With `RESEND_API_KEY` set, the app sends verification and password-reset messages through Resend using `MAIL_FROM`. A verified domain is required for production sending.

Without a provider, links are written to the server log, and development builds also return them to the form so the flow can be completed locally. In production, users cannot receive those links — configure email before launch.

## 8. Updates and data refreshes

- To refresh the football snapshot, replace the files in `data/football/` with a newer OpenFootball export, run `npm run data:build`, then `npm run db:reset` against a **non-production** database or re-seed deliberately in production.
- Competition records carry `isComplete: false`. Keep that flag accurate; the UI uses it to avoid implying a season is final.
- Copy and product wording live in `src/content/` (`site.ts`, `marketing.ts`, `product.ts`, `legal.ts`). Update content there rather than editing page components.

## 9. Verification before release

```bash
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
```

The E2E suite starts its own dev server on port 3100 by default. Override with `E2E_PORT` if needed. It covers public pages and the account lifecycle on desktop and mobile viewports.

## 10. Operational caveats

- The model and all copy explicitly state that output is for analysis and education, not betting advice. Preserve that framing.
- Referrals record joins only. Do not add cash rewards, commissions, deposit requirements, or recruitment tiers.
- The public data snapshot is partial and has a fixed latest date. Do not present it as live or complete.
