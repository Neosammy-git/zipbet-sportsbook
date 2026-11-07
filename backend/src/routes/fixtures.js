import express from 'express';
import { readDb } from '../db.js';

const router = express.Router();
router.get('/', async (_req, res, next) => {
  try {
    const db = await readDb();
    res.json(db.matches.sort((a, b) => new Date(a.kickoffAt) - new Date(b.kickoffAt)));
  } catch (error) { next(error); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const db = await readDb();
    const match = db.matches.find((item) => item.id === Number(req.params.id));
    if (!match) return res.status(404).json({ error: 'Match not found.' });
    return res.json(match);
  } catch (error) { return next(error); }
});
export default router;
