# ZIPBET Sportsbook

A polished, simulated sportsbook demo built with:
- Frontend: React + Vite
- Backend: Express.js
- Auth: JWT
- Storage: JSON-based simulated database
- Wallet: simulated balance management with settlement

This project is for demo and learning purposes only. It is not a real-money gambling or payment system.

## Features
- Modern sportsbook landing page
- Login and signup flows
- Dashboard with wallet balance and recent bets
- Live odds feed to simulate market activity
- Match pages with market selection and stake input
- Bet placement and settlement logic
- Admin fixture creation and result settlement
- Simulated wallet balance tracking and payouts

## Tech stack
- React
- Vite
- Express
- JWT
- CORS
- JSON file persistence

## Repo structure

```bash
.
├── backend/
│   ├── src/
│   ├── data/
│   └── package.json
├── frontend/
│   ├── src/
│   ├── index.html
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── LICENSE
```

## Quick start

1. Install root dependencies:

```bash
npm install
```

2. Copy environment example:

```bash
cp .env.example .env
```

3. Start both frontend and backend in development mode:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend runs at `http://localhost:4000`.

## Environment variables

```env
PORT=4000
JWT_SECRET=supersecret_zipbet_key
FRONTEND_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:4000/api
```

## Demo login

A demo admin user is created automatically on first run:

- Email: demo@zipbet.com
- Password: Zipbet@123

## Notes

- This project intentionally uses a simulated wallet and does not include real payments, KYC, or gambling regulation logic.
- A production sportsbook requires licensing, compliance reviews, robust risk controls, and regulated payment integrations.
