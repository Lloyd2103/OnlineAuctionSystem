import sequelize from '../../../libs/db.js';
import userService from '../../../services/userService.js';
import auctionService from '../../../services/auctionService.js';
import transactionService from '../../../services/transactionService.js';
import { auctionEvents, AUCTION_EVENTS } from '../events/AuctionEventEmitter.js';

export class BaseAuctionFinisher {
    /**
     * Template Method điều phối quy trình kết thúc cuộc đấu giá
     */
    async execute(params) {
        const auctionId = typeof params === 'object' ? params.auctionId : params;
        const t = await sequelize.transaction();
        const context = {
            auctionId,
            params,
            transaction: t,
            data: {}, // Chứa auction, logs, winner...
            result: {}
        };

        try {
            // 1. Khóa và nạp thông tin cuộc đấu giá
            await this.lockAndLoad(context);

            // 2. Kiểm tra tính hợp lệ
            await this.validate(context);

            // 3. Xử lý kết quả (Xác định người thắng/không có người thắng)
            await this.handleResults(context);

            // 4. Xử lý tài chính (Thanh toán/Hoàn tiền cho người thua)
            await this.processFinancials(context);

            // 5. Cập nhật trạng thái cuối cùng của cuộc đấu giá
            await this.updateAuctionState(context);

            await t.commit();

            // 6. Thông báo (Sau khi commit thành công)
            await this.notify(context);

            return context.result;
        } catch (error) {
            await t.rollback();
            console.error(`[Finisher] Error finishing auction ${auctionId}:`, error);
            throw error;
        }
    }

    async lockAndLoad(context) {
        context.data.auction = await auctionService.getAuctionById(context.auctionId, {
            transaction: context.transaction,
            lock: context.transaction.LOCK.UPDATE
        });
        if (!context.data.auction) throw new Error('Auction not found');
    }

    async validate(context) {
        if (context.data.auction.auctionStatus === 'FINISHED' || context.data.auction.auctionStatus === 'CANCELED') {
            throw new Error('Auction already finished or canceled');
        }
    }

    // Helper: Hoàn tiền cho người chơi
    async refundParticipants(context, excludeUserId = null) {
        const { auctionId } = context;
        const deposits = await transactionService.getDepositsByAuctionId(auctionId, { 
            transaction: context.transaction 
        });

        for (const deposit of deposits) {
            if (deposit.userId !== excludeUserId) {
                const user = await userService.findUserById(deposit.userId, { transaction: context.transaction });
                const refundAmount = Math.abs(deposit.amount);
                const updatedUser = await userService.updateBalance(user, refundAmount, { transaction: context.transaction });

                await transactionService.createTransaction({
                    userId: user.id,
                    auctionId: auctionId,
                    amount: refundAmount,
                    type: 'AUCTION_REFUND',
                    walletBalance: updatedUser.walletBalance,
                    description: `Refund for auction ${auctionId}`
                }, { transaction: context.transaction });
            }
        }
    }

    // Các bước logic đặc thù cho từng loại kết thúc
    async handleResults(context) { throw new Error("Method 'handleResults' must be implemented."); }
    async processFinancials(context) { throw new Error("Method 'processFinancials' must be implemented."); }
    
    async updateAuctionState(context) { 
        const status = context.data.auctionStatus || 'FINISHED';
        await context.data.auction.update({ 
            auctionStatus: status,
            endTime: new Date() // Ghi lại thời điểm kết thúc thực tế
        }, { transaction: context.transaction });
    }


    async notify(context) {
        const { auction, winnerId, winningAmount } = context.data;
        auctionEvents.emit(AUCTION_EVENTS.ENDED, { auction, winnerId, winningAmount });
    }
}

