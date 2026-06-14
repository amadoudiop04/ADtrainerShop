import type { Request, Response } from 'express';
import { createCheckoutSession, handleWebhook } from '../services/payment.service';

export const createCheckoutSessionHandler = async (req: Request, res: Response) => {
  const { userId, items, shippingAddress } = req.body;

  if (!userId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'userId et items sont obligatoires' });
  }

  try {
    const result = await createCheckoutSession(userId, items, shippingAddress);
    res.json(result);
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const webhookHandler = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  if (!signature) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  try {
    await handleWebhook(req.body as Buffer, signature);
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: (error as Error).message });
  }
};
