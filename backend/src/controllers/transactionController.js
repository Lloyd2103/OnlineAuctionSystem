import TransactionManager from '../managers/transactionManager.js';

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

export const getTransactionHistory = async (req, res) => {
    try {
        const transactions = await TransactionManager.history(req.user.id);
        return res.status(200).json({ transactions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};