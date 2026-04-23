import { BaseAuctionFinisher } from './BaseAuctionFinisher.js';
import bidService from '../../../services/bidService.js';

export class NormalAuctionFinisher extends BaseAuctionFinisher {
    async handleResults(context) {
        const { auctionId } = context;
        
        // 1. Tìm người đặt giá cao nhất
        const winningBid = await bidService.getHighestBid(auctionId, { transaction: context.transaction });
        
        if (winningBid) {
            await winningBid.update({ isWinningBid: true }, { transaction: context.transaction });
            context.data.winnerId = winningBid.bidderId;
            context.data.winningAmount = winningBid.bidAmount;
        } else {
            context.data.winnerId = null;
            context.data.winningAmount = 0;
        }
    }

    async processFinancials(context) {
        const { winnerId } = context.data;
        // Hoàn tiền cho tất cả mọi người trừ người thắng cuộc
        await this.refundParticipants(context, winnerId);
    }
}

