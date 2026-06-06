import { Router } from 'express';
import {
  getCollections,
  getCollection,
  createCollectionHandler,
  updateCollectionHandler,
  deleteCollectionHandler,
} from '../controllers/collection.controller';

const router = Router();

router.get('/', getCollections);
router.get('/:id', getCollection);
router.post('/', createCollectionHandler);
router.put('/:id', updateCollectionHandler);
router.delete('/:id', deleteCollectionHandler);

export default router;