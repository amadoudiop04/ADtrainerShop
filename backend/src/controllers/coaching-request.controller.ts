import type { Request, Response } from 'express';
import {
  getAllCoachingRequests,
  getCoachingRequestById,
  createCoachingRequest,
  updateCoachingRequest,
  deleteCoachingRequest,
} from '../services/coaching-request.service';

export const getCoachingRequests = async (req: Request, res: Response) => {
  try {
    const requests = await getAllCoachingRequests();
    res.json(requests);
  } catch (error) {
    console.error('Error fetching coaching requests:', error);
    res.status(500).json({ error: 'An error occurred while fetching coaching requests' });
  }
};

export const getCoachingRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const request = await getCoachingRequestById(id);
    res.json(request);
  } catch (error) {
    if ((error as Error).message === 'Coaching request not found') {
      res.status(404).json({ error: 'Coaching request not found' });
      return;
    }
    console.error(`Error fetching coaching request ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while fetching the coaching request' });
  }
};

const isUuid = (value: unknown): boolean => {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
};

export const createCoachingRequestHandler = async (req: Request, res: Response) => {
  const { user_id, full_name, email, phone, coaching_type, availability, message, status } = req.body;

  console.log('Create coaching request body:', req.body);

  if (!full_name || !email || !coaching_type) {
    return res.status(400).json({ error: 'Les champs full_name, email et coaching_type sont obligatoires' });
  }

  if (!['one_to_one', 'e_coaching'].includes(coaching_type)) {
    return res.status(400).json({ error: 'Le champ coaching_type doit être one_to_one ou e_coaching' });
  }

  if (status && !['new', 'in_progress', 'completed', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Le champ status doit être new, in_progress, completed ou rejected' });
  }

  if (user_id && !isUuid(user_id)) {
    return res.status(400).json({ error: 'Le champ user_id doit être un UUID valide' });
  }

  try {
    const request = await createCoachingRequest(
      full_name,
      email,
      coaching_type,
      user_id,
      phone,
      availability,
      message,
      status
    );
    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating coaching request:', error);
    if ((error as Error).message.includes('violates') || (error as Error).message.includes('duplicate key')) {
      return res.status(400).json({ error: 'Données invalides pour la demande de coaching' });
    }
    res.status(500).json({ error: 'An error occurred while creating the coaching request' });
  }
};

export const updateCoachingRequestHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const fields = req.body;
  try {
    const request = await updateCoachingRequest(id, fields);
    res.json(request);
  } catch (error) {
    if ((error as Error).message === 'Coaching request not found') {
      res.status(404).json({ error: 'Coaching request not found' });
      return;
    }
    console.error(`Error updating coaching request ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while updating the coaching request' });
  }
};

export const deleteCoachingRequestHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteCoachingRequest(id);
    res.json({ message: 'Coaching request deleted successfully' });
  } catch (error) {
    if ((error as Error).message === 'Coaching request not found') {
      res.status(404).json({ error: 'Coaching request not found' });
      return;
    }
    console.error(`Error deleting coaching request ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while deleting the coaching request' });
  }
};