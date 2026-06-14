import { Router, type Request, type Response } from 'express';
import { adminMiddleware } from '../middleware/admin.middleware';
import SettingsModel from '../models/settings.model';

const router = Router();

// Public — any client can read shop status
router.get('/shop-status', async (_req: Request, res: Response) => {
  try {
    const value = await SettingsModel.get('shop_open');
    res.json({ open: value !== 'false' });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin only — toggle shop open/closed
router.put('/shop-status', adminMiddleware, async (req: Request, res: Response) => {
  const { open } = req.body;
  if (typeof open !== 'boolean') {
    res.status(400).json({ error: 'Le champ "open" doit être un booléen' });
    return;
  }
  try {
    await SettingsModel.set('shop_open', String(open));
    res.json({ open });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
