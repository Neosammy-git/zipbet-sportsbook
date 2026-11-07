import express from 'express';
import bcrypt from 'bcryptjs';
import { readDb, writeDb } from '../db.js';
import { requireAuth, signToken } from '../auth.js';

const router = express.Router();
const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, wallet: user.wallet, role: user.role || 'user' });

router.post('/signup', async (req, res, next) => {
  try {
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (name.length < 2 || name.length > 80 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || password.length > 128) {
      return res.status(400).json({ error: 'Enter a valid name and email; password must be 8–128 characters.' });
    }
    const db = await readDb();
    if (db.users.some((user) => user.email.toLowerCase() === email)) return res.status(409).json({ error: 'An account with that email already exists.' });
    const user = { id: Date.now(), name, email, passwordHash: await bcrypt.hash(password, 12), role: 'user', wallet: { balance: 2500, currency: 'DEMO' }, createdAt: new Date().toISOString() };
    db.users.push(user);
    await writeDb(db);
    return res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (error) { return next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const db = await readDb();
    const user = db.users.find((item) => item.email.toLowerCase() === email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ error: 'Invalid email or password.' });
    return res.json({ token: signToken(user), user: publicUser(user) });
  } catch (error) { return next(error); }
});

router.get('/profile', requireAuth, (req, res) => res.json(publicUser(req.user)));
export default router;
