import Stripe from 'stripe';
import OrderModel from '../models/order.model';
import { query } from '../../db';

let _stripe: InstanceType<typeof Stripe> | null = null;
function getStripe(): InstanceType<typeof Stripe> {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key.startsWith('sk_test_REPLACE')) {
      throw new Error('STRIPE_SECRET_KEY non configurée dans .env');
    }
    _stripe = new Stripe(key);
  }
  return _stripe;
}

export interface CartItemPayload {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  imageUrl?: string;
}

export const createCheckoutSession = async (
  userId: string,
  items: CartItemPayload[],
  shippingAddress?: string,
): Promise<{ sessionUrl: string; orderId: string }> => {
  if (!items.length) throw new Error('Cart is empty');

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const orderNumber = `ADT-${Date.now()}`;

  const order = await OrderModel.create({
    user_id: userId,
    order_number: orderNumber,
    total_amount: totalAmount,
    shipping_address: shippingAddress,
    status: 'pending',
    payment_method: 'card',
    payment_status: 'pending',
  });

  for (const item of items) {
    await query(
      `INSERT INTO order_items (order_id, product_id, quantity, size, unit_price)
       VALUES ($1, $2, $3, $4, $5)`,
      [order.id, item.productId, item.quantity, item.size ?? null, item.price],
    );
  }

  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:4200';

  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.size ? `${item.name} — ${item.size}` : item.name,
          ...(item.imageUrl ? { images: [item.imageUrl] } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    metadata: { orderId: order.id },
    success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/gallery`,
  });

  await query(
    `UPDATE orders SET stripe_session_id = $1 WHERE order_id = $2`,
    [session.id, order.id],
  );

  return { sessionUrl: session.url!, orderId: order.id };
};

type CheckoutSessionLike = { metadata?: Record<string, string> | null };

export const handleWebhook = async (rawBody: Buffer, signature: string): Promise<void> => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  const event = (() => {
    try {
      return getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      throw new Error(`Webhook signature invalid: ${(err as Error).message}`);
    }
  })();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as CheckoutSessionLike;
    const orderId = session.metadata?.orderId;
    if (!orderId) return;

    await query(
      `UPDATE orders SET status = 'paid', payment_status = 'paid', updated_at = NOW()
       WHERE order_id = $1`,
      [orderId],
    );

    const result = await query(
      `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
      [orderId],
    );
    for (const row of result.rows) {
      await query(
        `UPDATE products SET stock = GREATEST(0, stock - $1), updated_at = NOW()
         WHERE product_id = $2`,
        [row.quantity, row.product_id],
      );
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as CheckoutSessionLike;
    const orderId = session.metadata?.orderId;
    if (!orderId) return;
    await query(
      `UPDATE orders SET status = 'cancelled', payment_status = 'failed', updated_at = NOW()
       WHERE order_id = $1`,
      [orderId],
    );
  }
};
