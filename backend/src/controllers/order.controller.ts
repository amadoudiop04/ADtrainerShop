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

  try {
    const order = await createOrder(
      user_id,
      Number(total_amount),
      Array.isArray(items) ? items : [],
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