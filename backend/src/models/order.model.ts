import { query } from '../../db';

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
}

const COLS = `order_id, user_id, order_number, total_amount, shipping_address, billing_address, status, payment_method, payment_status, placed_at, updated_at`;

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

const OrderModel = {
  async findAll(): Promise<Order[]> {
    const result = await query(
      `SELECT ${COLS} FROM orders ORDER BY placed_at DESC`
    );
    return result.rows.map(mapOrderRow);
  },

  async findByUser(user_id: string): Promise<Order[]> {
    const result = await query(
      `SELECT ${COLS} FROM orders WHERE user_id = $1 ORDER BY placed_at DESC`,
      [user_id]
    );
    return result.rows.map(mapOrderRow);
  },

  async findByPk(id: string): Promise<Order | null> {
    const result = await query(
      `SELECT ${COLS} FROM orders WHERE order_id::text = $1`,
      [id]
    );
    if (result.rowCount === 0) return null;
    return mapOrderRow(result.rows[0]);
  },

  async create(data: Partial<Order>): Promise<Order> {
    const result = await query(
      `INSERT INTO orders (user_id, order_number, total_amount, shipping_address, billing_address, status, payment_method, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING ${COLS}`,
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
    return mapOrderRow(result.rows[0]);
  },

  async save(order: Order): Promise<Order> {
    const result = await query(
      `UPDATE orders
       SET user_id = $1, order_number = $2, total_amount = $3,
           shipping_address = $4, billing_address = $5, status = $6,
           payment_method = $7, payment_status = $8, updated_at = NOW()
       WHERE order_id = $9
       RETURNING ${COLS}`,
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
    if (result.rowCount === 0) throw new Error('Order not found');
    return mapOrderRow(result.rows[0]);
  },

  async destroy(id: string): Promise<void> {
    const result = await query(`DELETE FROM orders WHERE order_id = $1`, [id]);
    if (result.rowCount === 0) throw new Error('Order not found');
  },
};

export default OrderModel;
export { Order as OrderType };
