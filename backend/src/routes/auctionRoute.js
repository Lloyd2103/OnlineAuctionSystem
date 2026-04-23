import express from 'express';
import { 
    createAuction, 
    getAllAuctions, 
    getAuctionById, 
    updateAuction, 
    deleteAuction, 
    getAuctionsByOwnerId, 
    buyNowAuction } 
from '../controllers/auctionController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllAuctions);
router.get('/:id', getAuctionById);

// Protected routes
router.post('/', protectedRoute, createAuction);
router.patch('/:id', protectedRoute, updateAuction);
router.delete('/:id', protectedRoute, deleteAuction);
router.post('/:id/buy', protectedRoute, buyNowAuction);
router.get('/user/:ownerId', protectedRoute, getAuctionsByOwnerId);


export default router;
