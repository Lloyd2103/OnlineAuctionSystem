import TransactionManager from '../managers/transactionManager.js';
import { getPagination, getPagingData } from '../utils/paginationHelper.js';

export const getWalletBalance = async (req, res) => {
    try {
        const balance = await TransactionManager.getWalletBalance(req.user.id);
        return res.status(200).json({ balance });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getDepositStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const status = await TransactionManager.getDepositStatus(req.user.id, id);
        return res.status(200).json({ status });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getUserTransaction = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const { limit: l, offset } = getPagination(page, limit);
        const result = await TransactionManager.getUserTransactions(req.user.id, { limit: l, offset });
        const response = getPagingData(result, page, l);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllTransactionsAdmin = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const { limit: l, offset } = getPagination(page, limit);
        const result = await TransactionManager.getAllTransactions({ limit: l, offset });
        const response = getPagingData(result, page, l);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const depositToWallet = async (req, res) => {
    try {
        const { amount } = req.body;
        const result = await TransactionManager.deposit(req.user, amount);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const transferToUser = async (req, res) => {
    try {
        const { recipientUsername, amount } = req.body;
        const result = await TransactionManager.transfer(req.user, recipientUsername, amount);
        return res.status(200).json(result);
    } catch (error) {
        const status = ['Recipient user not found', 'Insufficient wallet balance'].includes(error.message) ? 400 : 500;
        return res.status(status).json({ message: error.message });
    }
};

export const withdrawFromWallet = async (req, res) => {
    try {
        const { amount } = req.body;
        const result = await TransactionManager.withdraw(req.user, amount);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


export const payForAuction = async (req, res) => {
    try {
        const { id: auctionId } = req.params;
        const { amount, method } = req.body;
        
        if (!auctionId || amount <= 0) return res.status(400).json({ message: 'Invalid payment information' });

        const result = await TransactionManager.processAuctionPayment(req.user, auctionId, amount, method || 'WALLET');
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


export const getTransactionHistory = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const { limit: l, offset } = getPagination(page, limit);
        const result = await TransactionManager.getHistory(req.user.id, { limit: l, offset });
        const response = getPagingData(result, page, l);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const payDeposit = async (req, res) => {
    try {
        const result = await TransactionManager.payDeposit(req.user.id, req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};