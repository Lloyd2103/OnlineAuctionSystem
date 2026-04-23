import transactionRepository from '../repositories/TransactionRepository.js';

class TransactionService {
    async createTransaction(data, options = {}) {
        return await transactionRepository.create({
            ...data,
            transactionStatus: 'COMPLETED',
            paymentStatus: 'COMPLETED'
        }, options);
    }

    async bulkCreateTransactions(dataList, options = {}) {
        return await transactionRepository.bulkCreate(dataList, options);
    }

    async updateTransaction(transaction, data, options = {}) {
        return await transactionRepository.update(transaction, data, options);
    }

    async deleteTransaction(transaction, options = {}) {
        return await transactionRepository.delete(transaction, options);
    }

    async getDepositStatus(userId, auctionId, options = {}) {
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

    async getTransactions(userId, options = {}) {
        return await transactionRepository.findAndCountAll({ userId }, { order: [['createdAt', 'DESC']], ...options });
    }

    async getAllTransactions(options = {}) {
        return await transactionRepository.findAndCountAll({}, { order: [['createdAt', 'DESC']], ...options });
    }
}

export default new TransactionService();
