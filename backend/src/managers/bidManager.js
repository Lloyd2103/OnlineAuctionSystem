import sequelize from '../libs/db.js';

import auctionService from '../services/auctionService.js';
import bidService from '../services/bidService.js';
import userService from '../services/userService.js';
import transactionService from '../services/transactionService.js';

import { AuctionStateFactory } from '../domains/auction/states/AuctionStateFactory.js';

class BidManager {
    async getAuctionStats(auctionId) {
        return await bidService.getStats(auctionId);
    }

    async getBidHistory(bidderId) {
        return await bidService.getUserHistory(bidderId);
    }

    async placeBid(bidderId, { auctionId, bidAmount }) {
        const t = await sequelize.transaction();
        try {
            const auction = await auctionService.getAuctionById(auctionId, { 
                transaction: t,
                lock: t.LOCK.UPDATE 
            });
            
            // 1. KIỂM TRA ĐẶT CỌC TRƯỚC (QUAN TRỌNG)
            // Bạn phải đảm bảo user đã chạy payDeposit trước đó
            const hasDeposit = await transactionService.findDepositStatus(bidderId, auctionId, { transaction: t });
            if (!hasDeposit) {
                throw new Error('You must pay deposit before placing a bid');
            }

            const state = AuctionStateFactory.fromAuction(auction);
            if (!state.canPlaceBid(auction)) {
                throw new Error('Auction is not in bidding state');
            }

            const highestBid = await bidService.getHighestBid(auctionId, { transaction: t });
            const user = await userService.findUserById(bidderId, { transaction: t });

            const currentPrice = highestBid ? parseFloat(highestBid.bidAmount) : parseFloat(auction.startingPrice);
            const increment = parseFloat(auction.stepPrice || 0);

            // Validate số tiền bid mới so với giá hiện tại
            bidService.validateBidAmount(parseFloat(bidAmount), currentPrice, increment);

            // 2. TẠO LỆNH BID
            const bid = await bidService.create({ 
                auctionId, 
                bidderId, 
                bidAmount 
            }, { transaction: t });

            const previousHighestBidderId = highestBid ? highestBid.bidderId : null;

            await t.commit();
            console.log('Bid placed successfully:', { bid, userName: user.userName, currentPrice: bidAmount, previousHighestBidderId });
            return { bid, userName: user.userName, currentPrice: bidAmount, previousHighestBidderId };
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }
}

export default new BidManager();