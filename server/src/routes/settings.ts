import { Router } from 'express';
import {
  getOrganizationSettings,
  updateOrganizationSettings,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider,
  getSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty
} from '../controllers/settings';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

router.use(protect);

// Organization settings
router
  .route('/organization')
  .get(getOrganizationSettings)
  .patch(restrictTo('ADMIN'), updateOrganizationSettings);

// Locations
router
  .route('/locations')
  .get(getLocations)
  .post(restrictTo('ADMIN'), createLocation);

router
  .route('/locations/:id')
  .patch(restrictTo('ADMIN'), updateLocation)
  .delete(restrictTo('ADMIN'), deleteLocation);

// Providers
router
  .route('/providers')
  .get(getProviders)
  .post(restrictTo('ADMIN'), createProvider);

router
  .route('/providers/:id')
  .patch(restrictTo('ADMIN'), updateProvider)
  .delete(restrictTo('ADMIN'), deleteProvider);

// Specialties
router
  .route('/specialties')
  .get(getSpecialties)
  .post(restrictTo('ADMIN'), createSpecialty);

router
  .route('/specialties/:id')
  .patch(restrictTo('ADMIN'), updateSpecialty)
  .delete(restrictTo('ADMIN'), deleteSpecialty);

export { router as settingsRouter };