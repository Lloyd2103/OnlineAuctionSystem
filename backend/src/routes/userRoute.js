import express from 'express';
import { 
    getUserProfile, 
    getUserById,
    updateUserProfile, 
    submitUserRating 
} from '../controllers/userController.js';
import { uploadCloud } from '../libs/cloudinary.js';


const router = express.Router();

router.get('/profile', getUserProfile);
router.get('/:id', getUserById);
router.put('/profile', uploadCloud.single('userImage'), updateUserProfile);

router.post('/rating/:id', submitUserRating);

export default router;