import Order, { OrderItemType, OrderType } from '../models/order.model';

export const getAllOrders = async (): Promise<OrderType[]> => {
  try {
    return await Order.findAll();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('An error occurred while fetching orders');
  }
};

export const getOrderById = async (id: string): Promise<OrderType> => {
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  } catch (error) {
    console.error(`Error fetching order with id ${id}:`, error);
    throw new Error('An error occurred while fetching the order');
  }
};

export const createOrder = async (
  user_id: string,
  total_amount: number,
  items: Array<Partial<OrderItemType>> | undefined,
  order_number?: string,
  shipping_address?: string,
  billing_address?: string,
  status?: OrderType['status'],
  payment_method?: string,
  payment_status?: OrderType['payment_status']
): Promise<OrderType> => {
  try {
    return await Order.create({
      user_id,
      total_amount,
      order_number,
      shipping_address,
      billing_address,
      status,
      payment_method,
      payment_status,
      items,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('An error occurred while creating the order');
  }
};

export const updateOrder = async (
  id: string,
  fields: Partial<OrderType>
): Promise<OrderType> => {
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error('Order not found');
    }
    order.user_id = fields.user_id ?? order.user_id;
    order.order_number = fields.order_number ?? order.order_number;
    order.total_amount = fields.total_amount ?? order.total_amount;
    order.shipping_address = fields.shipping_address ?? order.shipping_address;
    order.billing_address = fields.billing_address ?? order.billing_address;
    order.status = fields.status ?? order.status;
    order.payment_method = fields.payment_method ?? order.payment_method;
    order.payment_status = fields.payment_status ?? order.payment_status;
    return await Order.save(order);
  } catch (error) {
    console.error(`Error updating order with id ${id}:`, error);
    throw new Error('An error occurred while updating the order');
  }
};

export const deleteOrder = async (id: string): Promise<void> => {
  try {
    await Order.destroy(id);
  } catch (error) {
    console.error(`Error deleting order with id ${id}:`, error);
    throw new Error('An error occurred while deleting the order');
  }
};