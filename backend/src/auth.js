import jwt from 'jsonwebtoken';
import { readDb } from './db.js';

export function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'supersecret_zipbet_key', {
    expiresIn: '7d',
  });
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_zipbet_key');
    const db = await readDb();
    const user = db.users.find((item) => item.id === payload.id);

    if (!user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
