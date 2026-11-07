import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureDb, readDb } from './db.js';
import { requireAuth } from './auth.js';
import authRoutes from './routes/auth.js';
import fixtureRoutes from './routes/fixtures.js';
import betRoutes from './routes/bets.js';
import adminRoutes from './routes/admin.js';
import walletRoutes from './routes/wallet.js';

await ensureDb();
const app = express();
const here = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(here, '../../frontend/dist');
const allowedOrigins = new Set([
  ...(process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map((origin) => origin.trim()),
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
]);

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.has(origin)) return callback(null, true);
  return callback(new Error('Origin not allowed by CORS'));
} }));
app.use(express.json({ limit: '20kb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false }));
app.use('/api/auth', authRoutes);
app.use('/api/fixtures', fixtureRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/admin', requireAuth, adminRoutes);
app.use('/api/wallet', walletRoutes);

app.get('/api/live-odds', async (_req, res, next) => {
  try {
    const db = await readDb();
    // Static illustrative prices only; this is not a live odds provider.
    return res.json(db.matches.map(({ id, league, homeTeam, awayTeam, homeOdds, drawOdds, awayOdds, status, kickoffAt }) => ({ id, league, homeTeam, awayTeam, homeOdds, drawOdds, awayOdds, status, kickoffAt, source: 'demo', updatedAt: new Date().toISOString() })));
  } catch (error) { return next(error); }
});
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found.' }));

// Local/Render production mode serves the Vite build. Vercel serves frontend/dist
// as static output and routes /api/* to the serverless handlers instead.
app.use(express.static(frontendDist));
app.get('*', (_req, res, next) => res.sendFile(path.join(frontendDist, 'index.html'), (error) => error && next(error)));
app.use((error, _req, res, _next) => {
  console.error(error);
  if (res.headersSent) return;
  res.status(error.message === 'Origin not allowed by CORS' ? 403 : 500).json({ error: error.message === 'Origin not allowed by CORS' ? error.message : 'Server error. Check service logs.' });
});

export default app;
