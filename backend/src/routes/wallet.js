import express from 'express';
import { readDb } from '../db.js';
import { requireAuth } from '../auth.js';

const router = express.Router();
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const db = await readDb();
    const user = db.users.find((item) => item.id === req.user.id);
    const transactions = db.walletTransactions.filter((item) => item.userId === req.user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return res.json({ wallet: user.wallet, transactions });
  } catch (error) { return next(error); }
});
export default router;
