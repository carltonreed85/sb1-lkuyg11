import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, updatePassword } from '../controllers/auth';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/update-password', protect, updatePassword);

export { router as authRouter };