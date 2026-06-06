import { Router } from 'express';
import {
  getNewsletterSubscriptions,
  getNewsletterSubscription,
  createNewsletterSubscriptionHandler,
  updateNewsletterSubscriptionHandler,
  deleteNewsletterSubscriptionHandler,
} from '../controllers/newsletter-subscription.controller';

const router = Router();

router.get('/', getNewsletterSubscriptions);
router.get('/:id', getNewsletterSubscription);
router.post('/', createNewsletterSubscriptionHandler);
router.put('/:id', updateNewsletterSubscriptionHandler);
router.delete('/:id', deleteNewsletterSubscriptionHandler);

export default router;