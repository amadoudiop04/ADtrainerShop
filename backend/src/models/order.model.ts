import { getClient, query } from '../../db';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  total_amount: number;
  shipping_address?: string;
  billing_address?: string;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled' | 'refunded';
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  placed_at: Date;
  updated_at: Date;
  items?: OrderItem[];
}

const mapOrderRow = (row: any): Order => ({
  id: row.order_id,
  user_id: row.user_id,
  order_number: row.order_number,
  total_amount: Number(row.total_amount),
  shipping_address: row.shipping_address ?? undefined,
  billing_address: row.billing_address ?? undefined,
  status: row.status,
  payment_method: row.payment_method ?? undefined,
  payment_status: row.payment_status,
  placed_at: new Date(row.placed_at),
  updated_at: new Date(row.updated_at),
});

const mapOrderItemRow = (row: any): OrderItem => ({
  id: row.order_item_id,
  order_id: row.order_id,
  product_id: row.product_id,
  quantity: row.quantity,
  unit_price: Number(row.unit_price),
  total_price: Number(row.total_price),
});

type CreateOrderInput = Omit<Partial<Order>, 'items'> & { items?: Partial<OrderItem>[] };

const OrderModel = {
  async findAll(): Promise<Order[]> {
    const result = await query(
      `SELECT order_id, user_id, order_number, total_amount, shipping_address, billing_address, status, payment_method, payment_status, placed_at, updated_at
       FROM orders
       ORDER BY placed_at DESC`
    );
    return result.rows.map(mapOrderRow);
  },

  async findByPk(id: string): Promise<Order | null> {
    const result = await query(
      `SELECT order_id, user_id, order_number, total_amount, shipping_address, billing_address, status, payment_method, payment_status, placed_at, updated_at
       FROM orders
       WHERE order_id::text = $1`,
      [id]
    );
    if (result.rowCount === 0) {
      return null;
    }
    const order = mapOrderRow(result.rows[0]);
    const itemsResult = await query(
      `SELECT order_item_id, order_id, product_id, quantity, unit_price, total_price
       FROM order_items
       WHERE order_id = $1`,
      [order.id]
    );
    order.items = itemsResult.rows.map(mapOrderItemRow);
    return order;
  },

  async create(data: CreateOrderInput): Promise<Order> {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, order_number, total_amount, shipping_address, billing_address, status, payment_method, payment_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING order_id, user_id, order_number, total_amount, shipping_address, billing_address, status, payment_method, payment_status, placed_at, updated_at`,
        [
          data.user_id ?? '',
          data.order_number ?? `ORDER-${Date.now()}`,
          data.total_amount ?? 0,
          data.shipping_address ?? null,
          data.billing_address ?? null,
          data.status ?? 'pending',
          data.payment_method ?? null,
          data.payment_status ?? 'pending',
        ]
      );
      const order = mapOrderRow(orderResult.rows[0]);
      order.items = [];

      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          const itemResult = await client.query(
            `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
             VALUES ($1, $2, $3, $4)
             RETURNING order_item_id, order_id, product_id, quantity, unit_price, total_price`,
            [order.id, item.product_id ?? '', item.quantity ?? 0, item.unit_price ?? 0]
          );
          order.items.push(mapOrderItemRow(itemResult.rows[0]));
        }
      }

      await client.query('COMMIT');
      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating order transaction:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  async save(order: Order): Promise<Order> {
    const result = await query(
      `UPDATE orders
       SET user_id = $1,
           order_number = $2,
           total_amount = $3,
           shipping_address = $4,
           billing_address = $5,
           status = $6,
           payment_method = $7,
           payment_status = $8,
           updated_at = NOW()
       WHERE order_id = $9
       RETURNING order_id, user_id, order_number, total_amount, shipping_address, billing_address, status, payment_method, payment_status, placed_at, updated_at`,
      [
        order.user_id,
        order.order_number,
        order.total_amount,
        order.shipping_address ?? null,
        order.billing_address ?? null,
        order.status,
        order.payment_method ?? null,
        order.payment_status,
        order.id,
      ]
    );
    if (result.rowCount === 0) {
      throw new Error('Order not found');
    }
    const saved = mapOrderRow(result.rows[0]);
    const itemsResult = await query(
      `SELECT order_item_id, order_id, product_id, quantity, unit_price, total_price
       FROM order_items
       WHERE order_id = $1`,
      [saved.id]
    );
    saved.items = itemsResult.rows.map(mapOrderItemRow);
    return saved;
  },

  async destroy(id: string): Promise<void> {
    const result = await query(`DELETE FROM orders WHERE order_id = $1`, [id]);
    if (result.rowCount === 0) {
      throw new Error('Order not found');
    }
  },
};

export default OrderModel;
export { Order as OrderType, OrderItem as OrderItemType };