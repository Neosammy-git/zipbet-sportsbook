import express from 'express';
import { readDb, writeDb } from '../db.js';
import { requireAuth } from '../auth.js';

const router = express.Router();

router.post('/fixtures', requireAuth, async (req, res) => {
  const { homeTeam, awayTeam, league, kickoffAt, homeOdds, drawOdds, awayOdds } = req.body || {};

  if (!homeTeam || !awayTeam || !league || !kickoffAt) {
    return res.status(400).json({ error: 'Fixture details are incomplete.' });
  }

  const db = await readDb();
  const nextId = db.matches.length ? Math.max(...db.matches.map((match) => match.id)) + 1 : 1;

  const newMatch = {
    id: nextId,
    homeTeam,
    awayTeam,
    league,
    kickoffAt,
    homeOdds: Number(homeOdds || 2),
    drawOdds: Number(drawOdds || 3.2),
    awayOdds: Number(awayOdds || 3.5),
    status: 'upcoming',
    winner: null,
    createdAt: new Date().toISOString(),
  };

  db.matches.push(newMatch);
  await writeDb(db);

  return res.status(201).json({ match: newMatch });
});

router.post('/settle', requireAuth, async (req, res) => {
  const { matchId, winner } = req.body || {};

  if (!matchId || !winner) {
    return res.status(400).json({ error: 'Match ID and winner are required.' });
  }

  const db = await readDb();
  const match = db.matches.find((item) => item.id === Number(matchId));
  if (!match) {
    return res.status(404).json({ error: 'Match not found.' });
  }

  const matchBets = db.bets.filter((bet) => bet.matchId === Number(matchId));

  for (const bet of matchBets) {
    const user = db.users.find((item) => item.id === bet.userId);
    if (!user) continue;

    if (winner === 'void') {
      user.wallet.balance = Number((user.wallet.balance + bet.stake).toFixed(2));
      bet.status = 'void';
      bet.payout = bet.stake;
      continue;
    }

    if (bet.selection === winner) {
      const payout = Math.round(bet.stake * bet.odds);
      user.wallet.balance = Number((user.wallet.balance + payout).toFixed(2));
      bet.status = 'won';
      bet.payout = payout;
    } else {
      bet.status = 'lost';
      bet.payout = 0;
    }
  }

  match.status = 'completed';
  match.winner = winner;

  await writeDb(db);

  return res.json({ success: true, settled: matchBets.length, winner, match });
});

export default router;
