import bcrypt from 'bcryptjs';

const localDemoUsers = process.env.NODE_ENV === 'production' || process.env.SEED_DEMO === 'false'
  ? []
  : [{
      id: 1,
      name: 'ZIPBET Demo Admin',
      email: 'demo@zipbet.com',
      passwordHash: bcrypt.hashSync('Zipbet@123', 10),
      role: 'admin',
      wallet: { balance: 2500, currency: 'DEMO' },
      createdAt: new Date().toISOString(),
    }];

const seedMatches = [
  { id: 1, homeTeam: 'Arsenal', awayTeam: 'Chelsea', league: 'Premier League', kickoffAt: '2026-11-20T18:00:00Z', homeOdds: 1.9, drawOdds: 3.35, awayOdds: 3.8 },
  { id: 2, homeTeam: 'Barcelona', awayTeam: 'Real Madrid', league: 'La Liga', kickoffAt: '2026-11-21T20:00:00Z', homeOdds: 2.08, drawOdds: 3.2, awayOdds: 3.05 },
  { id: 3, homeTeam: 'Bayern Munich', awayTeam: 'Dortmund', league: 'Bundesliga', kickoffAt: '2026-11-22T17:30:00Z', homeOdds: 1.7, drawOdds: 3.5, awayOdds: 4.2 },
  { id: 4, homeTeam: 'Inter Milan', awayTeam: 'Juventus', league: 'Serie A', kickoffAt: '2026-11-23T19:45:00Z', homeOdds: 2.15, drawOdds: 3.1, awayOdds: 2.95 },
].map((match) => ({ ...match, status: 'upcoming', winner: null, createdAt: new Date().toISOString() }));

export function seedDb() {
  return { users: localDemoUsers, matches: seedMatches, bets: [], walletTransactions: [] };
}
