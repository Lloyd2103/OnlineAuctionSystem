import TransactionManager from '../managers/transactionManager.js';

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
        const transactions = await TransactionManager.getUserTransactions(req.user.id);
        return res.status(200).json({ transactions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const depositToWallet = async (req, res) => {
    try {
        const { amount } = req.body;
        if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

        const newBalance = await TransactionManager.deposit(req.user, amount);
        return res.status(200).json({ message: 'Deposit successful', walletBalance: newBalance });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const transferToUser = async (req, res) => {
    try {
        const { recipientUsername, amount } = req.body;
        const newBalance = await TransactionManager.transfer(req.user, recipientUsername, amount);
        
        return res.status(200).json({ message: 'Transfer successful', senderBalance: newBalance });
    } catch (error) {
        const status = ['Recipient user not found', 'Insufficient wallet balance'].includes(error.message) ? 400 : 500;
        return res.status(status).json({ message: error.message });
    }
};

export const withdrawFromWallet = async (req, res) => {
    try {
        const { amount } = req.body;
        if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

        await TransactionManager.withdraw(req.user, amount);
        return res.status(200).json({ message: 'Withdrawal successful' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const payForAuction = async (req, res) => {
    try {
        const { auctionId, amount, method } = req.body;
        if (!auctionId || amount <= 0) return res.status(400).json({ message: 'Invalid payment information' });

        await TransactionManager.processAuctionPayment(req.user, auctionId, amount, method || 'WALLET');
        return res.status(200).json({ message: 'Auction payment successful' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const getTransactionHistory = async (req, res) => {
    try {
        const transactions = await TransactionManager.getHistory(req.user.id);
        return res.status(200).json({ transactions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const payDeposit = async (req, res) => {
    try {
        await TransactionManager.payDeposit(req.user.id, req.params.id);
        return res.status(200).json({ message: 'Deposit successful'});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};