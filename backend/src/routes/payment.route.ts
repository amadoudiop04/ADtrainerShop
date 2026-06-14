import { Router } from 'express';
import { createCheckoutSessionHandler } from '../controllers/payment.controller';

const router = Router();

router.post('/create-checkout-session', createCheckoutSessionHandler);

export default router;
