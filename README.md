# ZIPBET Sportsbook Demo

ZIPBET is a deployable React + Vite frontend and Express API for a **virtual-credit-only sportsbook UI demo**. It has no real-money betting, deposits, withdrawals, or payment integrations. Sample odds are static illustrative data, not a live odds service.

## Features
- Responsive landing page, sports markets, match pages, authentication, user dashboard, and admin tools.
- Express API for signup/login, fixtures, demo-credit bets, wallet history, and settlement.
- Demo-credit wallet ledger, hashed passwords, JWT auth, rate-limited auth endpoints, and admin-only fixture/settlement routes.
- Express serves the built Vite app, so one Render web service can host both frontend and API.

## Local run
Requires Node.js 20+.

```sh
npm install
npm run dev
```

Open <http://localhost:5173>. API health: <http://localhost:4000/api/health>. Local demo admin: `demo@zipbet.com` / `Zipbet@123` (only seeded outside production). For a clean local database, delete `backend/data/db.json` and restart the API.

Build and production start locally:

```sh
npm run build
npm start
```

## Deploy on Render
1. Push this repository to GitHub and in Render choose **New → Blueprint**, then select the repository. Render reads `render.yaml` to create the Node web service and persistent disk.
2. In the service environment, set `ADMIN_EMAIL` to the email address that will administer the demo. Create an account on the deployed site using that email; admin actions are authorized server-side. Do not set this to a public/shared account.
3. Deploy. Visit the generated `*.onrender.com` service URL; `/api/health` should return `{"ok":true}`.

The blueprint generates a strong `JWT_SECRET`. Keep it private. The configured disk preserves JSON demo data across deploys/restarts; Render persistent disks require a paid service plan. Without a disk or external database, local filesystem data may be lost on redeploy and should be treated as disposable.

### Render setup without Blueprint
- Runtime: Node
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Health check path: `/api/health`
- Environment: `NODE_ENV=production`, `JWT_SECRET` (random, at least 32 characters), `ADMIN_EMAIL` (admin login email), `DATA_DIR=/opt/render/project/src/backend/data`
- Add a persistent disk mounted at `/opt/render/project/src/backend/data` to retain simulated users and bets.

## Important limitations
This repository uses a single-process JSON file store intended for a small demo. Do not scale to multiple instances or treat it as financial, wagering, or production account software. Real-money gambling is not implemented. A real odds feed is not configured; replace the demo data through an appropriately licensed provider if your use case permits.
