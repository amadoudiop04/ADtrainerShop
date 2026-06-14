import { Router } from 'express';
import {
  getProducts,
  getProduct,
  getProductBySlugHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from '../controllers/product.controller';

const router = Router();

router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlugHandler);
router.get('/:id', getProduct);
router.post('/', createProductHandler);
router.put('/:id', updateProductHandler);
router.delete('/:id', deleteProductHandler);

export default router;