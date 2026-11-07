import express from 'express';
import { readDb, writeDb } from '../db.js';
import { requireAdmin } from '../auth.js';

const router = express.Router();
router.use(requireAdmin);

router.post('/fixtures', async (req, res, next) => {
  try {
    const { homeTeam, awayTeam, league, kickoffAt } = req.body || {};
    const odds = [Number(req.body?.homeOdds), Number(req.body?.drawOdds), Number(req.body?.awayOdds)];
    const date = new Date(kickoffAt);
    if (![homeTeam, awayTeam, league].every((value) => typeof value === 'string' && value.trim().length > 0 && value.length <= 80) || !Number.isFinite(date.getTime()) || date <= new Date() || odds.some((value) => !Number.isFinite(value) || value <= 1 || value > 1000)) {
      return res.status(400).json({ error: 'Provide valid team/league names, a future kickoff time, and decimal odds greater than 1.' });
    }
    const db = await readDb();
    const id = Math.max(0, ...db.matches.map((match) => match.id)) + 1;
    const match = { id, homeTeam: homeTeam.trim(), awayTeam: awayTeam.trim(), league: league.trim(), kickoffAt: date.toISOString(), homeOdds: odds[0], drawOdds: odds[1], awayOdds: odds[2], status: 'upcoming', winner: null, createdAt: new Date().toISOString() };
    db.matches.push(match);
    await writeDb(db);
    return res.status(201).json({ match });
  } catch (error) { return next(error); }
});

router.post('/settle', async (req, res, next) => {
  try {
    const matchId = Number(req.body?.matchId);
    const winner = req.body?.winner;
    if (!Number.isSafeInteger(matchId) || !['home', 'draw', 'away', 'void'].includes(winner)) return res.status(400).json({ error: 'Choose a valid match and outcome (home, draw, away, or void).' });
    const db = await readDb();
    const match = db.matches.find((item) => item.id === matchId);
    if (!match) return res.status(404).json({ error: 'Match not found.' });
    if (match.status === 'completed') return res.status(409).json({ error: 'This match has already been settled.' });

    const bets = db.bets.filter((bet) => bet.matchId === matchId && bet.status === 'open');
    for (const bet of bets) {
      const user = db.users.find((item) => item.id === bet.userId);
      if (!user) continue;
      if (winner === 'void') {
        user.wallet.balance += bet.stake;
        bet.status = 'void';
        bet.payout = bet.stake;
      } else if (bet.selection === winner) {
        bet.payout = Math.round(bet.stake * bet.odds);
        user.wallet.balance += bet.payout;
        bet.status = 'won';
      } else {
        bet.payout = 0;
        bet.status = 'lost';
      }
      if (bet.payout > 0) db.walletTransactions.push({ id: `${bet.id}-settlement`, userId: user.id, type: bet.status === 'void' ? 'bet_refund' : 'bet_payout', amount: bet.payout, balanceAfter: user.wallet.balance, betId: bet.id, createdAt: new Date().toISOString() });
    }
    match.status = 'completed';
    match.winner = winner;
    match.settledAt = new Date().toISOString();
    await writeDb(db);
    return res.json({ success: true, settled: bets.length, winner, match });
  } catch (error) { return next(error); }
});
export default router;
