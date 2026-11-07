import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureDb, readDb } from './db.js';
import authRoutes from './routes/auth.js';
import fixtureRoutes from './routes/fixtures.js';
import betRoutes from './routes/bets.js';
import adminRoutes from './routes/admin.js';
import walletRoutes from './routes/wallet.js';

dotenv.config();
await ensureDb();
const app = express();
const port = Number(process.env.PORT || 4000);
const here = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(here, '../../frontend/dist');
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map((item) => item.trim());

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error('Origin not allowed by CORS'));
} }));
app.use(express.json({ limit: '20kb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false }));
app.use('/api/auth', authRoutes);
app.use('/api/fixtures', fixtureRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wallet', walletRoutes);

app.get('/api/live-odds', async (_req, res, next) => {
  try {
    const db = await readDb();
    // These are static sample/demo prices, not a live third-party odds feed.
    res.json(db.matches.map(({ id, league, homeTeam, awayTeam, homeOdds, drawOdds, awayOdds, status, kickoffAt }) => ({ id, league, homeTeam, awayTeam, homeOdds, drawOdds, awayOdds, status, kickoffAt, source: 'demo', updatedAt: new Date().toISOString() })));
  } catch (error) { next(error); }
});
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found.' }));
app.use(express.static(frontendDist));
app.get('*', (_req, res, next) => res.sendFile(path.join(frontendDist, 'index.html'), (error) => error && next(error)));
app.use((error, _req, res, _next) => {
  console.error(error);
  if (res.headersSent) return;
  res.status(500).json({ error: 'Server error. Check the service logs.' });
});

app.listen(port, '0.0.0.0', () => console.log(`ZIPBET listening on port ${port}`));
