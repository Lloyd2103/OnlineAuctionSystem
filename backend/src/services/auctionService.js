import { Op } from 'sequelize';
import auctionRepository from '../repositories/AuctionRepository.js';
import { AuctionStateFactory } from '../domains/auction/states/AuctionStateFactory.js';
import Item from '../models/Item.js';
import Bid from '../models/Bid.js';
import User from '../models/User.js';

class AuctionService {
    validateAuctionTime(startTime, endTime) {
        if (new Date(startTime) >= new Date(endTime)) {
            throw new Error('Start time must be before end time');
        }
    }

    async createAuction(userId, auctionData, options = {}) {
        this.validateAuctionTime(auctionData.startTime, auctionData.endTime);
        const { itemId, title, description, startTime, endTime, startingPrice, incrementPrice, instantBuyPrice, mandatoryDeposit } = auctionData;
        return await auctionRepository.create({
            ownerId: userId,
            itemId,
            title,
            description,
            startTime,
            endTime,
            startingPrice,
            incrementPrice,
            instantBuyPrice,
            mandatoryDeposit
        }, options);
    }

    async updateAuction(auction, updateData, options = {}) {
        const state = AuctionStateFactory.fromAuction(auction);
        if (!state.canEditAuction(auction, auction.ownerId)) {
            throw new Error('Forbidden: You do not have permission to perform this action');
        }
        const fields = ['itemId', 'title', 'description', 'auctionStatus',
            'startTime', 'endTime', 'startingPrice', 'incrementPrice',
            'instantBuyPrice', 'mandatoryDeposit'];
        fields.forEach(field => {
            if (updateData[field] !== undefined) auction[field] = updateData[field];
        });
        if (updateData.startTime || updateData.endTime) {
            this.validateAuctionTime(auction.startTime, auction.endTime);
        }
        return await auctionRepository.save(auction, options);
    }

    async deleteAuction(auction) {
        const state = AuctionStateFactory.fromAuction(auction);
        if (!state.canDeleteAuction(auction, auction.ownerId)) {
            throw new Error('Forbidden: You do not have permission to perform this action');
        }
        const bidCount = await auction.countBids();
        if (bidCount > 0) throw new Error('Không thể xóa phiên đã có người đặt giá');
        return await auctionRepository.destroy({ id: auction.id }, options);
    }

    async getAllAuctions() {
        const auctions = await auctionRepository.findAll({}, {
            include: [
                {
                    model: Item, // Model bạn muốn join
                    as: 'item',  // Phải khớp với "as" lúc khai báo association
                    attributes: ['itemName', 'itemDescription', 'itemImage', 'itemAddress', 'category', 'attributes', 'itemStatus']
                }
            ]
        });
        if (!auctions) throw new Error('Auctions not found');
        return auctions;
    }

    async getAuctionById(id) {
        const auction = await auctionRepository.findById(id, {
            include: [
                {
                    model: Item,
                    as: 'item',
                    attributes: ['itemName', 'itemDescription', 'itemImage', 'itemAddress', 'category', 'attributes']
                },
                {
                    model: Bid,
                    as: 'bids',
                    include: [{ model: User, as: 'bidder', attributes: ['userName'] }]
                }
            ]
        });
        if (!auction) throw new Error('Auction not found');
        return auction;
    }

    async getAuctionsByUser(userId) {
        return await auctionRepository.findAll({ ownerId: userId }, {
            include: [
                {
                    model: Item,
                    as: 'item',
                    attributes: ['itemName', 'itemDescription', 'itemImage', 'itemAddress', 'category', 'attributes']
                },
                {
                    model: Bid,
                    as: 'bids',
                    include: [{ model: User, as: 'bidder', attributes: ['userName'] }]
                }
            ]
        });
    }

    async findAuctionAndVerifyOwner(id, userId) {
        const auction = await auctionRepository.findById(id,  {
            include: [
                {
                    model: Item,
                    as: 'item',
                    attributes: ['itemName', 'itemDescription', 'itemImage', 'itemAddress', 'category', 'attributes']
                },
                {
                    model: Bid,
                    as: 'bids',
                    include: [{ model: User, as: 'bidder', attributes: ['userName'] }]
                }
            ]
        });
        if (!auction) throw new Error('Auction not found');
        if (userId && auction.ownerId !== userId) {
            throw new Error('Forbidden: You do not have permission to perform this action');
        }
        return auction;
    }

    async changeState(auction, actionType, options = {}) {
        const state = AuctionStateFactory.fromAuction(auction);
        if (actionType === 'START') {
            state.start(auction);
        } else if (actionType === 'END') {
            state.end(auction);
        }
        return await auctionRepository.save(auction, options);
    }

    async activatePendingAuctions() {
        const now = new Date();
        return await auctionRepository.update(
            { auctionStatus: 'ACTIVE' },
            {
                auctionStatus: 'PENDING',
                startTime: { [Op.lte]: now }
            }
        );
    }

    async closeExpiredAuctions() {
        const now = new Date();
        return await auctionRepository.update(
            { auctionStatus: 'ENDED' },
            {
                auctionStatus: 'ACTIVE',
                endTime: { [Op.lte]: now }
            }
        );
    }
}

export default new AuctionService();