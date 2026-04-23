import { BaseAuctionFinisher } from './BaseAuctionFinisher.js';

export class CanceledAuctionFinisher extends BaseAuctionFinisher {
    async handleResults(context) {
        // Hủy phiên thì không có người thắng
        context.data.winnerId = null;
        context.data.winningAmount = 0;
        context.result = { message: 'Auction canceled and all deposits refunded' };
    }

    async processFinancials(context) {
        // Hoàn tiền cho TẤT CẢ mọi người tham gia
        await this.refundParticipants(context, null);
    }

    async updateAuctionState(context) {
        // Cập nhật trạng thái thành CANCELED và chốt thời gian kết thúc
        await context.data.auction.update({ 
            auctionStatus: 'CANCELED',
            endTime: new Date()
        }, { transaction: context.transaction });
    }

}
