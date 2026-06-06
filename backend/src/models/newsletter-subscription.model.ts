import { query } from '../../db';

export interface NewsletterSubscription {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_confirmed: boolean;
  subscribed_at: Date;
  confirmed_at?: Date;
  unsubscribed_at?: Date;
}

const mapNewsletterRow = (row: any): NewsletterSubscription => ({
  id: row.subscription_id,
  email: row.email,
  first_name: row.first_name ?? undefined,
  last_name: row.last_name ?? undefined,
  is_confirmed: row.is_confirmed,
  subscribed_at: new Date(row.subscribed_at),
  confirmed_at: row.confirmed_at ? new Date(row.confirmed_at) : undefined,
  unsubscribed_at: row.unsubscribed_at ? new Date(row.unsubscribed_at) : undefined,
});

const NewsletterSubscriptionModel = {
  async findAll(): Promise<NewsletterSubscription[]> {
    const result = await query(
      `SELECT subscription_id, email, first_name, last_name, is_confirmed, subscribed_at, confirmed_at, unsubscribed_at
       FROM newsletter_subscriptions
       ORDER BY subscribed_at DESC`
    );
    return result.rows.map(mapNewsletterRow);
  },

  async findByPk(id: string): Promise<NewsletterSubscription | null> {
    const result = await query(
      `SELECT subscription_id, email, first_name, last_name, is_confirmed, subscribed_at, confirmed_at, unsubscribed_at
       FROM newsletter_subscriptions
       WHERE subscription_id::text = $1`,
      [id]
    );
    if (result.rowCount === 0) return null;
    return mapNewsletterRow(result.rows[0]);
  },

  async create(data: Partial<NewsletterSubscription>): Promise<NewsletterSubscription> {
    const result = await query(
      `INSERT INTO newsletter_subscriptions (email, first_name, last_name, is_confirmed, subscribed_at, confirmed_at, unsubscribed_at)
       VALUES ($1, $2, $3, $4, NOW(), $5, $6)
       RETURNING subscription_id, email, first_name, last_name, is_confirmed, subscribed_at, confirmed_at, unsubscribed_at`,
      [
        data.email ?? '',
        data.first_name ?? null,
        data.last_name ?? null,
        data.is_confirmed !== undefined ? data.is_confirmed : false,
        data.confirmed_at ?? null,
        data.unsubscribed_at ?? null,
      ]
    );
    return mapNewsletterRow(result.rows[0]);
  },

  async save(subscription: NewsletterSubscription): Promise<NewsletterSubscription> {
    const result = await query(
      `UPDATE newsletter_subscriptions
       SET email = $1,
           first_name = $2,
           last_name = $3,
           is_confirmed = $4,
           confirmed_at = $5,
           unsubscribed_at = $6
       WHERE subscription_id = $7
       RETURNING subscription_id, email, first_name, last_name, is_confirmed, subscribed_at, confirmed_at, unsubscribed_at`,
      [
        subscription.email,
        subscription.first_name ?? null,
        subscription.last_name ?? null,
        subscription.is_confirmed,
        subscription.confirmed_at ?? null,
        subscription.unsubscribed_at ?? null,
        subscription.id,
      ]
    );
    if (result.rowCount === 0) {
      throw new Error('Newsletter subscription not found');
    }
    return mapNewsletterRow(result.rows[0]);
  },

  async destroy(id: string): Promise<void> {
    const result = await query(`DELETE FROM newsletter_subscriptions WHERE subscription_id = $1`, [id]);
    if (result.rowCount === 0) {
      throw new Error('Newsletter subscription not found');
    }
  },
};

export default NewsletterSubscriptionModel;
export { NewsletterSubscription as NewsletterSubscriptionType };