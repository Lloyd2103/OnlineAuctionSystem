import sequelize from '../libs/db.js';
import { getIO } from '../libs/socket.js';

import auctionRepository from '../repositories/AuctionRepository.js';
import bidRepository from '../repositories/BidRepository.js';
import userRepository from '../repositories/UserRepository.js';

import { AuctionStateFactory } from '../domain/auction/AuctionStateFactory.js';
import { StandardBidValidation } from '../domain/bidding/StandardBidValidation.js';
import { IAuctionManager } from '../interfaces/IAuctionManager.js';

import Item from '../models/Item.js';
import Auction from '../models/Auction.js';
const bidValidation = new StandardBidValidation();

class AuctionManager extends IAuctionManager {
    async createAuction(ownerId, payload) {
        if (new Date(payload.startTime) >= new Date(payload.endTime)) {
        throw new Error('Thời gian bắt đầu phải trước thời gian kết thúc');
        }

        const {
        itemId,
        title,
        description,
        startTime,
        endTime,
        startingPrice,
        incrementPrice,
        instantBuyPrice,
        mandatoryDeposit,
        } = payload;

        return await auctionRepository.create({
        ownerId,
        itemId,
        title,
        description,
        startTime,
        endTime,
        startingPrice,
        incrementPrice,
        instantBuyPrice,
        mandatoryDeposit,
        });
    }

    async getAuctionById(id) {
        const auction = await auctionRepository.findById(id, {
            include: [
                {
                    model: Item, // Model bạn muốn join
                    as: 'item',  // Phải khớp với "as" lúc khai báo association
                    attributes: ['itemName', 'itemDescription', 'itemImage', 'itemAddress', 'category', 'attributes'] // Chỉ lấy các field cần thiết
                }
            ]
        });
        
        if (!auction) throw new Error('Auction not found');
        return auction;
    }

    async getAllAuctions() {
        const auctions = await auctionRepository.findAll({
            include: [
                {
                    model: Item, // Model bạn muốn join
                    as: 'item',  // Phải khớp với "as" lúc khai báo association
                    attributes: ['itemName', 'itemDescription', 'itemImage', 'itemAddress', 'category', 'attributes'] // Chỉ lấy các field cần thiết
                }
            ]
        });

        return auctions.map(auction => auction.toJSON());
    }

    async updateAuction(id, ownerId, payload) {
        const auction = await this.getAuctionById(id);

        const state = AuctionStateFactory.fromAuction(auction);
        if (!state.canEditAuction(auction, ownerId)) {
        throw new Error('Forbidden: Bạn không có quyền thực hiện thao tác này');
        }

        const { itemId, title, description, auctionStatus, startTime, endTime, startingPrice, incrementPrice, instantBuyPrice, mandatoryDeposit } = payload;
        if (itemId) auction.itemId = itemId;
        if (title) auction.title = title;
        if (description) auction.description = description;
        if (auctionStatus) auction.auctionStatus = auctionStatus;
        if (startTime) auction.startTime = startTime;
        if (endTime) auction.endTime = endTime;
        if (startingPrice) auction.startingPrice = startingPrice;
        if (incrementPrice) auction.incrementPrice = incrementPrice;
        if (instantBuyPrice) auction.instantBuyPrice = instantBuyPrice;
        if (mandatoryDeposit) auction.mandatoryDeposit = mandatoryDeposit;
        return await auctionRepository.save(auction);
    }

    async deleteAuction(id, ownerId) {
        const auction = await this.getAuctionById(id);

        const state = AuctionStateFactory.fromAuction(auction);
        if (!state.canDeleteAuction(auction, ownerId)) {
        throw new Error('Forbidden: Bạn không có quyền thực hiện thao tác này');
        }

        const bidCount = await auction.countBids();
        if (bidCount > 0) throw new Error('Không thể xóa phiên đã có người đặt giá');

        await auctionRepository.destroy(auction);
    }

    async placeBid(bidderId, { auctionId, bidAmount }) {
        const t = await sequelize.transaction();
        try {
        const auction = await auctionRepository.findById(auctionId, { transaction: t });
        if (!auction) throw new Error('Auction not found');

        const now = new Date();
        const state = AuctionStateFactory.fromAuction(auction, now);
        if (!state.canPlaceBid(auction, now)) throw new Error('Phiên đấu giá hiện không diễn ra');

        const bidder = await userRepository.findById(bidderId, { transaction: t });
        const highestBid = await bidRepository.findHighestByAuctionId(auctionId, { transaction: t });

        bidValidation.validate({ auction, highestBid, bidder, bidAmount, now });

        const bid = await bidRepository.create(
            { auctionId, bidderId, bidAmount },
            { transaction: t }
        );

        await t.commit();

        const io = getIO();
        io.to(`auction_${auctionId}`).emit('new_bid', {
            auctionId,
            highestBid: bidAmount,
            bidderId,
            bidderName: bidder.userName,
        });

        return bid;
        } catch (e) {
        await t.rollback();
        throw e;
        }
    }

    async getAuctionStats(auctionId) {
        const bids = await bidRepository.findAllByAuctionId(auctionId);
        const count = bids.length;
        const highest = bids[0] || null;
        const average =
        count > 0 ? bids.reduce((acc, b) => acc + parseFloat(b.bidAmount), 0) / count : 0;
        return { bids, count, highest, average };
    }

    async getBidHistory(bidderId) {
        return await bidRepository.findAllByBidderId(bidderId);
    }
}

export default new AuctionManager();
