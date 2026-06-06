import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const API_SECRET = process.env.API_SECRET as string;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization"); // Récupère le token dans le header

  if (!token) {
    res.status(401).json({ message: "Accès interdit, token manquant" });
    return;
  }

  if (token !== API_SECRET) {
    res.status(403).json({ message: "Accès interdit, token invalide" });
    return;
  }

  next(); // Autorise l'accès à la route
};