import express from 'express';
import { readDb, writeDb } from '../db.js';
import { requireAuth } from '../auth.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const db = await readDb();
    res.json(db.bets.filter((bet) => bet.userId === req.user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const matchId = Number(req.body?.matchId);
    const selection = req.body?.selection;
    const stake = Number(req.body?.stake);
    if (!Number.isSafeInteger(stake) || stake < 1 || stake > 10000) return res.status(400).json({ error: 'Stake must be 1–10,000 demo credits.' });
    if (!['home', 'draw', 'away'].includes(selection)) return res.status(400).json({ error: 'Invalid outcome selection.' });

    const db = await readDb();
    const match = db.matches.find((item) => item.id === matchId);
    const user = db.users.find((item) => item.id === req.user.id);
    if (!match || !user) return res.status(404).json({ error: 'Match or user not found.' });
    if (match.status !== 'upcoming' || new Date(match.kickoffAt) <= new Date()) return res.status(400).json({ error: 'This match is no longer accepting demo bets.' });
    if (user.wallet.balance < stake) return res.status(400).json({ error: 'Insufficient demo-credit balance.' });

    const odds = { home: match.homeOdds, draw: match.drawOdds, away: match.awayOdds }[selection];
    const bet = { id: Date.now(), userId: user.id, matchId, selection, stake, odds, payout: 0, status: 'open', createdAt: new Date().toISOString() };
    user.wallet.balance -= stake;
    db.bets.push(bet);
    db.walletTransactions.push({ id: `${bet.id}-stake`, userId: user.id, type: 'bet_stake', amount: -stake, balanceAfter: user.wallet.balance, betId: bet.id, createdAt: bet.createdAt });
    await writeDb(db);
    return res.status(201).json({ bet, wallet: user.wallet });
  } catch (error) { return next(error); }
});
export default router;
