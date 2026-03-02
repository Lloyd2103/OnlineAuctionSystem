import express from 'express';
import { getAuctionList, getAuctionDetails, createAuction, placeBid } from '../controllers/auctionController.js';


const router = express.Router();

router.get('/', getAuctionList);
router.get('/:id', getAuctionDetails);
router.post('/', createAuction);
router.put('/:id', updateAuction);
router.delete('/:id', deleteAuction);
router.post('/:id/bid', placeBid);

export default router;