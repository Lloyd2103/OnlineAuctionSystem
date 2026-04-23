import { BaseAuctionFinisher } from './BaseAuctionFinisher.js';
import transactionManager from '../../../managers/transactionManager.js';
import bidService from '../../../services/bidService.js';

export class BuyNowAuctionFinisher extends BaseAuctionFinisher {
    async validate(context) {
        await super.validate(context);
        const { auction } = context.data;
        const { buyer } = context.params;

        if (auction.auctionStatus !== 'ACTIVE') throw new Error('Auction is not active');
        if (!auction.instantBuyPrice) throw new Error('This auction does not support Buy Now');
        if (buyer.walletBalance < auction.instantBuyPrice) throw new Error('Insufficient balance to Buy Now');
    }

    async handleResults(context) {
        const { buyer } = context.params;
        const { auction } = context.data;

        // TẠO BID THẮNG CUỘC NGAY LẬP TỨC CHO NGƯỜI MUA NGAY
        const winningBid = await bidService.create({
            auctionId: auction.id,
            bidderId: buyer.id,
            bidAmount: auction.instantBuyPrice,
            isWinningBid: true
        }, { transaction: context.transaction });

        context.data.winnerId = buyer.id;
        context.data.winningAmount = auction.instantBuyPrice;
        
        context.result = {
            success: true,
            message: 'Buy Now successful',
            winnerId: buyer.id,
            winningAmount: auction.instantBuyPrice,
            bid: winningBid
        };
    }


    async processFinancials(context) {
        const { buyer } = context.params;
        const { auction } = context.data;

        // 1. Thực hiện thanh toán Mua ngay
        await transactionManager.processAuctionPayment(
            buyer, 
            auction.id, 
            auction.instantBuyPrice, 
            'WALLET'
        );

        // 2. Hoàn tiền đặt cọc cho tất cả những người khác (người mua ngay cũng được hoàn cọc nếu đã đặt trước đó)
        await this.refundParticipants(context, buyer.id);
    }
}

