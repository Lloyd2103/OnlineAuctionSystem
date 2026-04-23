import express from 'express';
import { signUp, signIn, signOut, refreshToken } from '../controllers/authController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', protectedRoute, signOut);
router.post('/refresh', protectedRoute, refreshToken);

export default router;