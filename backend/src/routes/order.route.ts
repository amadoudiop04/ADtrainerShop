import { Router } from 'express';
import {
  getOrders,
  getOrder,
  createOrderHandler,
  updateOrderHandler,
  deleteOrderHandler,
} from '../controllers/order.controller';

const router = Router();

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrderHandler);
router.put('/:id', updateOrderHandler);
router.delete('/:id', deleteOrderHandler);

export default router;