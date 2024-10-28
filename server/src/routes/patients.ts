import { Router } from 'express';
import { 
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient
} from '../controllers/patients';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

router.use(protect); // Protect all routes

router
  .route('/')
  .get(getPatients)
  .post(createPatient);

router
  .route('/:id')
  .get(getPatient)
  .patch(updatePatient)
  .delete(restrictTo('ADMIN'), deletePatient);

export { router as patientRouter };