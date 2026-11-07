import express from 'express';
import { readDb, writeDb } from '../db.js';
import { requireAuth } from '../auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const db = await readDb();
  const bets = db.bets.filter((bet) => bet.userId === req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return res.json(bets);
});

router.post('/', requireAuth, async (req, res) => {
  const { matchId, selection, stake } = req.body || {};

  if (!matchId || !selection || !stake) {
    return res.status(400).json({ error: 'Match, selection, and stake are required.' });
  }

  const db = await readDb();
  const match = db.matches.find((item) => item.id === Number(matchId));

  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }

  const user = db.users.find((item) => item.id === req.user.id);
  const parsedStake = Number(stake);

  if (parsedStake <= 0 || Number.isNaN(parsedStake)) {
    return res.status(400).json({ error: 'Stake must be a positive number.' });
  }

  if (user.wallet.balance < parsedStake) {
    return res.status(400).json({ error: 'Insufficient wallet balance.' });
  }

  const oddsMap = {
    home: match.homeOdds,
    draw: match.drawOdds,
    away: match.awayOdds,
  };

  const odds = oddsMap[selection];
  if (!odds) {
    return res.status(400).json({ error: 'Invalid selection.' });
  }

  const payout = Math.round(parsedStake * odds);

  const createdBet = {
    id: Date.now(),
    userId: user.id,
    matchId: match.id,
    selection,
    stake: parsedStake,
    odds,
    payout,
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  db.bets.push(createdBet);
  user.wallet.balance = Number((user.wallet.balance - parsedStake).toFixed(2));

  await writeDb(db);

  return res.status(201).json({ bet: createdBet, wallet: user.wallet });
});

export default router;
