import express from 'express';
import { getUserProfile, updateUserProfile, getWalletBalance, submitUserRating } from '../controllers/userController.js';


const router = express.Router();

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/wallet', getWalletBalance);
router.post('/rating/:id', submitUserRating);

export default router;