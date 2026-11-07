# ZIPBET Sportsbook Demo

ZIPBET is a React/Vite frontend with an Express API for a **virtual-credit-only sportsbook UI demo**. No real-money betting, deposits, withdrawals, or payment processing are implemented. The included sample prices are illustrative—not live odds.

## Deploy on Vercel

The repository includes `vercel.json`, a Vite static build, and serverless Express handlers under `api/`. A PostgreSQL database is required because Vercel function filesystems are ephemeral.

1. Create a Postgres database using Neon (or another provider compatible with the Neon serverless driver) and copy its connection string.
2. Import this GitHub repo into Vercel. Keep the project root at the repository root; the checked-in `vercel.json` configures the build/output.
3. Set Vercel project environment variables for **Production** (and Preview if desired):
   - `DATABASE_URL`: provider connection string
   - `JWT_SECRET`: a private random secret of at least 32 characters
   - `ADMIN_EMAIL`: email address to use for the admin account
   - `FRONTEND_URL`: the exact deployed origin, such as `https://your-project.vercel.app` (include preview origins if you want cross-origin previews)
4. Deploy. Visit `/api/health` on the deployment; it should return `{"ok":true}`. Sign up using the configured `ADMIN_EMAIL`; admin fixture and settlement endpoints authorize that address server-side.

Vercel build settings are defined in `vercel.json`:
- Install: `npm install`
- Build: `npm run vercel-build`
- Output: `frontend/dist`

The API initializes a single JSONB state row in Postgres automatically on first request. For this low-traffic demonstration only; use a relational schema and database transactions before multi-user/production use. Do not reuse the demo for real money or gambling.

## Local development

Requires Node.js 20+.

```sh
npm install
npm run dev
```

Frontend: `http://localhost:5173`; API: `http://localhost:4000/api/health`. Local development uses `backend/data/db.json` unless `DATABASE_URL` is set. The local-only demo admin account is `demo@zipbet.com` / `Zipbet@123`; it is not seeded in production. To reset local demo data, stop the API and delete `backend/data/db.json`.

To test the production build locally:

```sh
npm run build
npm start
```

## Security and scope

Passwords are hashed; auth endpoints are rate limited; administrative fixture creation and settlement are restricted to `ADMIN_EMAIL` (or the local-only seeded admin role). The simulated wallet has no cash value. The JSONB state approach is a starter/demo architecture and does not provide production-grade transactional guarantees, audit, regulatory controls, or live odds.
