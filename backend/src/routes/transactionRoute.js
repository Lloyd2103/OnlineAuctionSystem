import express from 'express';
import { 
    depositToWallet, 
    withdrawFromWallet, 
    transferToUser, 
    payForAuction, 
    getWalletBalance, 
    getUserTransaction,
    payDeposit,
    getDepositStatus
} from '../controllers/transactionController.js';

const router = express.Router();

router.post('/deposit', depositToWallet);
router.post('/withdraw', withdrawFromWallet);
router.post('/transfer', transferToUser);
router.get('/balance', getWalletBalance);
router.get('/history', getUserTransaction);

router.post('/auction/payment/:id', payForAuction);
router.post('/auction/deposit/:id', payDeposit);

router.get('/auction/:id/status', getDepositStatus);

export default router;
