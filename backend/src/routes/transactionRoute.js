import express from 'express';
import { 
    depositToWallet, 
    withdrawFromWallet, 
    transferToUser, 
    payForAuction, 
    getWalletBalance, 
    getUserTransaction,
    getAllTransactionsAdmin,
    payDeposit,
    getDepositStatus
} from '../controllers/transactionController.js';
import { protectedRoute, adminRoute } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/deposit', protectedRoute, depositToWallet);
router.post('/withdraw', protectedRoute, withdrawFromWallet);
router.post('/transfer', protectedRoute, transferToUser);
router.get('/balance', protectedRoute, getWalletBalance);
router.get('/history', protectedRoute, getUserTransaction);
router.get('/all', protectedRoute, adminRoute, getAllTransactionsAdmin);

router.post('/auction/payment/:id', protectedRoute, payForAuction);
router.post('/auction/deposit/:id', protectedRoute, payDeposit);
router.get('/auction/:id/status', protectedRoute, getDepositStatus);

export default router;
