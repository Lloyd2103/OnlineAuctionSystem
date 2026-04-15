import transactionRepository from '../repositories/TransactionRepository.js';

class TransactionService {
    async createTransaction(data, options = {}) {
        return await transactionRepository.create({
            ...data,
            transactionStatus: 'COMPLETED',
            paymentMethod: data.paymentMethod || 'WALLET',
            paymentStatus: 'COMPLETED'
        }, options);
    }

    async updateTransaction(transaction, data, options = {}) {
        
        return await transactionRepository.update(transaction, data, options);
    }

    async deleteTransaction(transaction, options = {}) {

        return await transactionRepository.delete(transaction, options);
    }

    async findDepositStatus(userId, auctionId, options = {}) {
        return await transactionRepository.findOne({
            userId,
            auctionId,
            type: 'AUCTION_DEPOSIT'
        }, options);
    }

    async getDepositsByAuctionId(auctionId, options = {}) {
        return await transactionRepository.findAll({
            auctionId,
            type: 'AUCTION_DEPOSIT'
        }, options);
    }

    async getTransactions(userId) {
        return await transactionRepository.findAll({ userId }, [['createdAt', 'DESC']]);
    }
}

export default new TransactionService();
