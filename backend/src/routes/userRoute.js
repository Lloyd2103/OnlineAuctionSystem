import express from 'express';
import {
    getUserProfile,
    getUserById,
    updateUserProfile,
    submitUserRating,
    getAllUsers,
    updateUserStatus,
    updateUserRole
} from '../controllers/userController.js';
import { uploadCloud } from '../libs/cloudinary.js';
import { protectedRoute, adminRoute } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.get('/profile', protectedRoute, getUserProfile);
router.patch('/profile', protectedRoute, uploadCloud.single('userImage'), updateUserProfile);
router.put('/profile', protectedRoute, uploadCloud.single('userImage'), updateUserProfile);
router.get('/profile/:id', getUserById);

router.post('/rating/:id', protectedRoute, submitUserRating);

router.get('/', protectedRoute, adminRoute, getAllUsers);
router.patch('/:id/status', protectedRoute, adminRoute, updateUserStatus);
router.patch('/:id/role', protectedRoute, adminRoute, updateUserRole);

export default router;