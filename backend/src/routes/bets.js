import express from 'express';
import { readDb } from '../db.js';
import { requireAuth } from '../auth.js';

const router = express.Router();

router.get('/', requireAuth, async (_req, res) => {
  const db = await readDb();
  return res.json(db.matches);
});

router.get('/:id', requireAuth, async (req, res) => {
  const db = await readDb();
  const match = db.matches.find((item) => item.id === Number(req.params.id));

  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }

  return res.json(match);
});

export default router;
