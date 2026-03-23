import sequelize from '../libs/db.js';
import { getIO } from '../libs/socket.js';
import bidRepository from '../repositories/BidRepository.js';
import auctionRepository from '../repositories/AuctionRepository.js';
import userRepository from '../repositories/UserRepository.js';
import { StandardBidValidation } from '../domain/bidding/StandardBidValidation.js';
import { AuctionStateFactory } from '../domain/auction/AuctionStateFactory.js';

const bidValidation = new StandardBidValidation();

class BidService {
    async placeBid(userId, { auctionId, bidAmount }) {
        const t = await sequelize.transaction();

        try {
            const auction = await auctionRepository.findById(auctionId, { transaction: t });
            if (!auction) throw new Error('Auction not found');
            
            const now = new Date();
            const state = AuctionStateFactory.fromAuction(auction, now);
            if (!state.canPlaceBid(auction, now)) throw new Error('Phiên đấu giá hiện không diễn ra');

            const user = await userRepository.findById(userId, { transaction: t });

            const highestBid = await bidRepository.findHighestByAuctionId(auctionId, { transaction: t });

            bidValidation.validate({
                auction,
                highestBid,
                bidder: user,
                bidAmount,
                now
            });

            const newBid = await bidRepository.create({
                auctionId,
                bidderId: userId,
                bidAmount
            }, { transaction: t });

            await t.commit();

            const io = getIO();
            io.to(`auction_${auctionId}`).emit('new_bid', {
                auctionId,
                highestBid: bidAmount,
                bidderId: userId,
                bidderName: user.userName
            });

            return newBid;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getAuctionStats(auctionId) {
        const bids = await bidRepository.findAllByAuctionId(auctionId);

        const count = bids.length;
        const highest = bids[0] || null;
        const average = count > 0 
            ? bids.reduce((acc, b) => acc + parseFloat(b.bidAmount), 0) / count 
            : 0;

        return { bids, count, highest, average };
    }

    async getUserHistory(userId) {
        return await bidRepository.findAllByBidderId(userId);
    }
}

export default new BidService();