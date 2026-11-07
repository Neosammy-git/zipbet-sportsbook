import express from 'express';
import { requireAuth } from '../auth.js';
import { readDb, writeDb } from '../db.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const db = await readDb();
  const user = db.users.find((item) => item.id === req.user.id);
  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    wallet: user.wallet,
  });
});

router.get('/profile', requireAuth, async (req, res) => {
  const db = await readDb();
  const user = db.users.find((item) => item.id === req.user.id);
  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    wallet: user.wallet,
  });
});

export default router;
