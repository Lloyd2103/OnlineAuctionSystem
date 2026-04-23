import { DepositProcessor } from '../domains/transaction/processors/DepositProcessor.js';
import { AuctionPaymentProcessor } from '../domains/transaction/processors/AuctionPaymentProcessor.js';
import { WalletDepositProcessor } from '../domains/transaction/processors/WalletDepositProcessor.js';
import { WalletWithdrawProcessor } from '../domains/transaction/processors/WalletWithdrawProcessor.js';
import { WalletTransferProcessor } from '../domains/transaction/processors/WalletTransferProcessor.js';
import userService from '../services/userService.js';
import transactionService from '../services/transactionService.js';
import { TransactionManagerInterface } from './interfaces/TransactionManagerInterface.js';

class TransactionManager extends TransactionManagerInterface {
    // === CÁC GIAO DỊCH DÙNG TEMPLATE PATTERN ===

    async payDeposit(bidderId, auctionId) {
        const processor = new DepositProcessor();
        return await processor.execute({ bidderId, auctionId });
    }

    async processAuctionPayment(user, auctionId, amount, method) {
        const processor = new AuctionPaymentProcessor();
        return await processor.execute({ user, auctionId, amount, method });
    }

    async deposit(user, amount) {
        const processor = new WalletDepositProcessor();
        return await processor.execute({ user, amount });
    }

    async withdraw(user, amount) {
        const processor = new WalletWithdrawProcessor();
        return await processor.execute({ user, amount });
    }

    async transfer(user, recipientUsername, amount) {
        const processor = new WalletTransferProcessor();
        return await processor.execute({ user, recipientUsername, amount });
    }

    // === CÁC HÀM TRUY VẤN THÔNG TIN ===

    async getWalletBalance(userId) {
        const user = await userService.findUserById(userId);
        return user?.walletBalance || 0;
    }

    async getDepositStatus(userId, auctionId) {
        const deposit = await transactionService.getDepositStatus(userId, auctionId);
        return !!deposit;
    }

    async getUserTransactions(userId, options = {}) {
        return await transactionService.getTransactions(userId, options);
    }

    async getHistory(userId, options = {}) {
        return await transactionService.getTransactions(userId, options);
    }

    async getAllTransactions(options = {}) {
        return await transactionService.getAllTransactions(options);
    }
}

export default new TransactionManager();
