import express from 'express';
import bcrypt from 'bcryptjs';
import { readDb, writeDb } from '../db.js';
import { signToken } from '../auth.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const db = await readDb();
  const exists = db.users.some((user) => user.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now(),
    name,
    email,
    passwordHash,
    wallet: { balance: 2500, currency: 'USD' },
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  await writeDb(db);

  const token = signToken(newUser);

  return res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      wallet: newUser.wallet,
    },
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = await readDb();
  const user = db.users.find((item) => item.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken(user);

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      wallet: user.wallet,
    },
  });
});

export default router;
