import { Op } from 'sequelize';
import auctionRepository from '../repositories/AuctionRepository.js';
import { AuctionStateFactory } from '../domain/auction/AuctionStateFactory.js';

class AuctionService {
    async createAuction(userId, auctionData) {
        if (new Date(auctionData.startTime) >= new Date(auctionData.endTime)) {
            throw new Error('Thời gian bắt đầu phải trước thời gian kết thúc');
        }
        const {itemId, startTime, endTime, startingPrice, incrementPrice, instantBuyPrice, mandatoryDeposit} = auctionData;
        return await auctionRepository.create({
            ownerId: userId,
            itemId,
            startTime,
            endTime,
            startingPrice,
            incrementPrice,
            instantBuyPrice,
            mandatoryDeposit
        });
    }

    async getAllAuctions() {
        return await auctionRepository.findAll();
    }

    async getAuctionById(id) {
        const auction = await auctionRepository.findById(id);
        if (!auction) throw new Error('Auction not found');
        return auction;
    }

    async getAuctionsByUser(userId) {
        // Keep method for backward compatibility; align to model field ownerId.
        return await auctionRepository.findAllByOwnerId(userId);
    }

    async findAuctionAndVerifyOwner(id, userId) {
        const auction = await auctionRepository.findById(id);
        if (!auction) throw new Error('Auction not found');
        if (userId && auction.ownerId !== userId) {
            throw new Error('Forbidden: Bạn không có quyền thực hiện thao tác này');
        }
        return auction;
    }

    async updateAuction(id, userId, updateData) {
        const auction = await auctionRepository.findById(id);
        if (!auction) throw new Error('Auction not found');

        const state = AuctionStateFactory.fromAuction(auction);
        if (!state.canEditAuction(auction, userId)) {
            throw new Error('Forbidden: Bạn không có quyền thực hiện thao tác này');
        }
        const { startTime, endTime, startingPrice, incrementPrice, instantBuyPrice, mandatoryDeposit } = updateData;

        if (startTime) auction.startTime = startTime;
        if (endTime) auction.endTime = endTime;
        if (startingPrice) auction.startingPrice = startingPrice;
        if (incrementPrice) auction.incrementPrice = incrementPrice;
        if (instantBuyPrice) auction.instantBuyPrice = instantBuyPrice;
        if (mandatoryDeposit) auction.mandatoryDeposit = mandatoryDeposit;
        return await auctionRepository.save(auction);
    }

    async deleteAuction(id, userId) {
        const auction = await auctionRepository.findById(id);
        if (!auction) throw new Error('Auction not found');

        const state = AuctionStateFactory.fromAuction(auction);
        if (!state.canDeleteAuction(auction, userId)) {
            throw new Error('Forbidden: Bạn không có quyền thực hiện thao tác này');
        }
        const bidCount = await auction.countBids();
        if (bidCount > 0) throw new Error('Không thể xóa phiên đã có người đặt giá');
        return await auctionRepository.destroy(auction);
    }

    async activatePendingAuctions() {
        const now = new Date();
        return await auctionRepository.update(
            { auctionStatus: 'ACTIVE' },
            { 
                auctionStatus: 'PENDING',
                startTime: { [Op.lte]: now } // startTime <= hiện tại
            }
        );
    }

    // 2. Luồng kết thúc phiên (ACTIVE -> ENDED)
    async closeExpiredAuctions() {
        const now = new Date();
        return await auctionRepository.update(
            { auctionStatus: 'ENDED' },
            { 
                auctionStatus: 'ACTIVE',
                endTime: { [Op.lte]: now } // endTime <= hiện tại
            }
        );
    }
}



export default new AuctionService();