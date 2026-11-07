import jwt from 'jsonwebtoken';
import { readDb } from './db.js';

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production' && (!secret || secret.length < 32)) {
    throw new Error('JWT_SECRET must be set to a random value of at least 32 characters in production.');
  }
  return secret || 'local-only-zipbet-demo-secret-change-me';
}

export function signToken(user) {
  return jwt.sign({ id: user.id }, jwtSecret(), { expiresIn: '7d' });
}

export async function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  try {
    const payload = jwt.verify(token, jwtSecret());
    const db = await readDb();
    const user = db.users.find((item) => item.id === payload.id);
    if (!user) return res.status(401).json({ error: 'Invalid session.' });
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }
}

export function requireAdmin(req, res, next) {
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (req.user?.role === 'admin' || (adminEmail && req.user?.email.toLowerCase() === adminEmail)) {
    return next();
  }
  return res.status(403).json({ error: 'Administrator access required.' });
}
