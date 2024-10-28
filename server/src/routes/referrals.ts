import { Router } from 'express';
import {
  getReferrals,
  getReferral,
  createReferral,
  updateReferral,
  deleteReferral,
  getReferralsByPatient
} from '../controllers/referrals';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(getReferrals)
  .post(createReferral);

router
  .route('/:id')
  .get(getReferral)
  .patch(updateReferral)
  .delete(restrictTo('ADMIN'), deleteReferral);

router.get('/patient/:patientId', getReferralsByPatient);

export { router as referralRouter };