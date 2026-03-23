import express from 'express';
import { createAuction, getAllAuctions, getAuctionById, updateAuction, deleteAuction } from '../controllers/auctionController.js';
import { createBid } from '../controllers/bidController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllAuctions);
router.get('/:id', getAuctionById);

// Protected routes
router.post('/', protectedRoute, createAuction);
router.put('/:id', protectedRoute, updateAuction);
router.delete('/:id', protectedRoute, deleteAuction);
router.post('/:id/bid', protectedRoute, createBid);

export default router;