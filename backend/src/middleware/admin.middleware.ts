import type { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user.model';

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.header('X-User-Id');
  if (!userId) {
    res.status(401).json({ error: 'Non authentifié' });
    return;
  }
  const user = await UserModel.findByPk(userId);
  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    return;
  }
  next();
};
