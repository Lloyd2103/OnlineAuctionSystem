import { BasePaymentProcessor } from '../BasePaymentProcessor.js';
import { WalletStrategy } from '../strategies/WalletStrategy.js';
import { ExternalStrategy } from '../strategies/ExternalStrategy.js';
import auctionService from '../../../services/auctionService.js';
import transactionService from '../../../services/transactionService.js';

export class AuctionPaymentProcessor extends BasePaymentProcessor {
    async validate(context) {
        const { user, auctionId, amount } = context.params;

        const auction = await auctionService.getAuctionById(auctionId, { transaction: context.transaction });
        if (!auction) throw new Error('Không tìm thấy cuộc đấu giá');

        // Ở đây có thể thêm kiểm tra user có phải người thắng cuộc không
        // if (auction.winnerId !== user.id) throw new Error('Bạn không phải người thắng cuộc');
        
        context.data.user = user;
        context.data.auction = auction;
        context.data.amount = amount;
    }

    async performPayment(context) {
        const { user, amount, method } = context.params;
        
        // Chọn Strategy dựa vào method
        let strategy;
        if (method === 'WALLET') {
            strategy = new WalletStrategy();
        } else {
            strategy = new ExternalStrategy(method);
        }

        context.data.updatedUser = await strategy.pay(user, amount, context.transaction);
    }

    async postProcess(context) {
        const { auction } = context.data;
        // Cập nhật trạng thái cuộc đấu giá thành COMPLETED hoặc PAID
        await auction.update({ paymentStatus: 'PAID' }, { transaction: context.transaction });
    }

    async recordLogs(context) {
        const { user, auctionId, amount } = context.params;
        const { updatedUser } = context.data;

        await transactionService.createTransaction({
            userId: user.id,
            auctionId,
            amount: -amount,
            type: 'AUCTION_PAYMENT',
            walletBalance: updatedUser?.walletBalance || user.walletBalance
        }, { transaction: context.transaction });

        context.result = {
            message: 'Auction payment successful',
            walletBalance: updatedUser?.walletBalance
        };
    }
}
