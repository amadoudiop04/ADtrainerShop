import NewsletterSubscription, { NewsletterSubscriptionType } from '../models/newsletter-subscription.model';

export const getAllNewsletterSubscriptions = async (): Promise<NewsletterSubscriptionType[]> => {
  try {
    return await NewsletterSubscription.findAll();
  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    throw new Error('An error occurred while fetching newsletter subscriptions');
  }
};

export const getNewsletterSubscriptionById = async (id: string): Promise<NewsletterSubscriptionType> => {
  try {
    const subscription = await NewsletterSubscription.findByPk(id);
    if (!subscription) {
      throw new Error('Newsletter subscription not found');
    }
    return subscription;
  } catch (error) {
    console.error(`Error fetching newsletter subscription with id ${id}:`, error);
    throw new Error('An error occurred while fetching the newsletter subscription');
  }
};

export const createNewsletterSubscription = async (
  email: string,
  first_name?: string,
  last_name?: string,
  is_confirmed?: boolean,
  confirmed_at?: Date,
  unsubscribed_at?: Date
): Promise<NewsletterSubscriptionType> => {
  try {
    return await NewsletterSubscription.create({
      email,
      first_name,
      last_name,
      is_confirmed,
      confirmed_at,
      unsubscribed_at,
    });
  } catch (error) {
    console.error('Error creating newsletter subscription:', error);
    throw new Error('An error occurred while creating the newsletter subscription');
  }
};

export const updateNewsletterSubscription = async (
  id: string,
  fields: Partial<NewsletterSubscriptionType>
): Promise<NewsletterSubscriptionType> => {
  try {
    const subscription = await NewsletterSubscription.findByPk(id);
    if (!subscription) {
      throw new Error('Newsletter subscription not found');
    }
    subscription.email = fields.email ?? subscription.email;
    subscription.first_name = fields.first_name ?? subscription.first_name;
    subscription.last_name = fields.last_name ?? subscription.last_name;
    subscription.is_confirmed = fields.is_confirmed ?? subscription.is_confirmed;
    subscription.confirmed_at = fields.confirmed_at ?? subscription.confirmed_at;
    subscription.unsubscribed_at = fields.unsubscribed_at ?? subscription.unsubscribed_at;
    return await NewsletterSubscription.save(subscription);
  } catch (error) {
    console.error(`Error updating newsletter subscription with id ${id}:`, error);
    throw new Error('An error occurred while updating the newsletter subscription');
  }
};

export const deleteNewsletterSubscription = async (id: string): Promise<void> => {
  try {
    await NewsletterSubscription.destroy(id);
  } catch (error) {
    console.error(`Error deleting newsletter subscription with id ${id}:`, error);
    throw new Error('An error occurred while deleting the newsletter subscription');
  }
};