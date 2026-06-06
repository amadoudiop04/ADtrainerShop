import type { Request, Response } from 'express';
import {
  getAllNewsletterSubscriptions,
  getNewsletterSubscriptionById,
  createNewsletterSubscription,
  updateNewsletterSubscription,
  deleteNewsletterSubscription,
} from '../services/newsletter-subscription.service';

export const getNewsletterSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await getAllNewsletterSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    res.status(500).json({ error: 'An error occurred while fetching newsletter subscriptions' });
  }
};

export const getNewsletterSubscription = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const subscription = await getNewsletterSubscriptionById(id);
    res.json(subscription);
  } catch (error) {
    if ((error as Error).message === 'Newsletter subscription not found') {
      res.status(404).json({ error: 'Newsletter subscription not found' });
      return;
    }
    console.error(`Error fetching newsletter subscription ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while fetching the newsletter subscription' });
  }
};

export const createNewsletterSubscriptionHandler = async (req: Request, res: Response) => {
  const { email, first_name, last_name, is_confirmed, confirmed_at, unsubscribed_at } = req.body;
  try {
    const subscription = await createNewsletterSubscription(
      email,
      first_name,
      last_name,
      is_confirmed,
      confirmed_at ? new Date(confirmed_at) : undefined,
      unsubscribed_at ? new Date(unsubscribed_at) : undefined
    );
    res.status(201).json(subscription);
  } catch (error) {
    console.error('Error creating newsletter subscription:', error);
    res.status(500).json({ error: 'An error occurred while creating the newsletter subscription' });
  }
};

export const updateNewsletterSubscriptionHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const fields = req.body;
  try {
    const subscription = await updateNewsletterSubscription(id, fields);
    res.json(subscription);
  } catch (error) {
    if ((error as Error).message === 'Newsletter subscription not found') {
      res.status(404).json({ error: 'Newsletter subscription not found' });
      return;
    }
    console.error(`Error updating newsletter subscription ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while updating the newsletter subscription' });
  }
};

export const deleteNewsletterSubscriptionHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteNewsletterSubscription(id);
    res.json({ message: 'Newsletter subscription deleted successfully' });
  } catch (error) {
    if ((error as Error).message === 'Newsletter subscription not found') {
      res.status(404).json({ error: 'Newsletter subscription not found' });
      return;
    }
    console.error(`Error deleting newsletter subscription ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while deleting the newsletter subscription' });
  }
};