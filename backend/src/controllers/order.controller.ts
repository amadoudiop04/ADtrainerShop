import type { Request, Response } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../services/order.service';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'An error occurred while fetching orders' });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await getOrderById(id);
    res.json(order);
  } catch (error) {
    if ((error as Error).message === 'Order not found') {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    console.error(`Error fetching order ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while fetching the order' });
  }
};

const isUuid = (value: unknown): boolean => {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
};

export const createOrderHandler = async (req: Request, res: Response) => {
  const {
    user_id,
    total_amount,
    items,
    order_number,
    shipping_address,
    billing_address,
    status,
    payment_method,
    payment_status,
  } = req.body;

  if (!user_id || total_amount === undefined) {
    return res.status(400).json({ error: 'Les champs user_id et total_amount sont obligatoires' });
  }

  if (!isUuid(user_id)) {
    return res.status(400).json({ error: 'Le champ user_id doit être un UUID valide' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'La commande doit contenir au moins un item' });
  }

  const preparedItems = [] as Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
  }>;

  for (const item of items) {
    if (!item.product_id || item.quantity === undefined || item.unit_price === undefined) {
      return res.status(400).json({ error: 'Chaque item doit contenir product_id, quantity et unit_price' });
    }
    if (!isUuid(item.product_id)) {
      return res.status(400).json({ error: 'product_id doit être un UUID valide' });
    }
    const quantityNumber = Number(item.quantity);
    const unitPriceNumber = Number(item.unit_price);
    if (Number.isNaN(quantityNumber) || quantityNumber <= 0 || Number.isNaN(unitPriceNumber) || unitPriceNumber < 0) {
      return res.status(400).json({ error: 'Chaque item doit avoir une quantité positive et un prix unitaire valide' });
    }
    preparedItems.push({
      product_id: item.product_id,
      quantity: quantityNumber,
      unit_price: unitPriceNumber,
    });
  }

  const totalAmountNumber = Number(total_amount);
  if (Number.isNaN(totalAmountNumber) || totalAmountNumber < 0) {
    return res.status(400).json({ error: 'Le champ total_amount doit être un nombre positif' });
  }

  if (status && !['pending', 'paid', 'shipped', 'completed', 'cancelled', 'refunded'].includes(status)) {
    return res.status(400).json({ error: 'Le champ status est invalide' });
  }

  if (payment_status && !['pending', 'paid', 'failed', 'refunded'].includes(payment_status)) {
    return res.status(400).json({ error: 'Le champ payment_status est invalide' });
  }

  try {
    const order = await createOrder(
      user_id,
      totalAmountNumber,
      preparedItems,
      order_number,
      shipping_address,
      billing_address,
      status,
      payment_method,
      payment_status
    );
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'An error occurred while creating the order' });
  }
};

export const updateOrderHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const fields = req.body;
  try {
    const order = await updateOrder(id, fields);
    res.json(order);
  } catch (error) {
    if ((error as Error).message === 'Order not found') {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    console.error(`Error updating order ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while updating the order' });
  }
};

export const deleteOrderHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteOrder(id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    if ((error as Error).message === 'Order not found') {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    console.error(`Error deleting order ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while deleting the order' });
  }
};