import type { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phone } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'firstName, lastName, email et password sont obligatoires' });
  }
  try {
    const user = await registerUser(firstName, lastName, email, password, phone);
    const { password_hash, ...safe } = user;
    res.status(201).json(safe);
  } catch (err) {
    if ((err as Error).message === 'EMAIL_EXISTS') {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }
    console.error('Error registering:', err);
    res.status(500).json({ error: 'Une erreur est survenue lors de l\'inscription' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email et password sont obligatoires' });
  }
  try {
    const user = await loginUser(email, password);
    const { password_hash, ...safe } = user;
    res.json(safe);
  } catch (err) {
    if ((err as Error).message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Une erreur est survenue lors de la connexion' });
  }
};
