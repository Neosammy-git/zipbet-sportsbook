import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ensureDb, readDb, writeDb } from './db.js';
import authRoutes from './routes/auth.js';
import fixtureRoutes from './routes/fixtures.js';
import betRoutes from './routes/bets.js';
import adminRoutes from './routes/admin.js';
import walletRoutes from './routes/wallet.js';

dotenv.config();
await ensureDb();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/fixtures', fixtureRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wallet', walletRoutes);

app.get('/api/health', async (_req, res) => {
  const db = await readDb();
  res.json({ ok: true, matches: db.matches.length, users: db.users.length });
});

app.get('/api/live-odds', async (_req, res) => {
  const db = await readDb();
  const liveMatches = db.matches.map((match) => {
    const swing = (Math.random() * 0.22) - 0.11;
    const home = Number((match.homeOdds + swing).toFixed(2));
    const draw = Number((match.drawOdds + (Math.random() * 0.2 - 0.1)).toFixed(2));
    const away = Number((match.awayOdds + (Math.random() * 0.2 - 0.1)).toFixed(2));

    return {
      id: match.id,
      league: match.league,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeOdds: home,
      drawOdds: draw,
      awayOdds: away,
      status: match.status,
      updatedAt: new Date().toISOString(),
    };
  });

  res.json(liveMatches);
});

app.listen(port, () => {
  console.log(`ZIPBET API listening on http://localhost:${port}`);
});
