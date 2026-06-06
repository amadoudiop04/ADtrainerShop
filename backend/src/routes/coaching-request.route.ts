import { Router } from 'express';
import {
  getCoachingRequests,
  getCoachingRequest,
  createCoachingRequestHandler,
  updateCoachingRequestHandler,
  deleteCoachingRequestHandler,
} from '../controllers/coaching-request.controller';

const router = Router();

router.get('/', getCoachingRequests);
router.get('/:id', getCoachingRequest);
router.post('/', createCoachingRequestHandler);
router.put('/:id', updateCoachingRequestHandler);
router.delete('/:id', deleteCoachingRequestHandler);

export default router;