import auctionService from '../services/auctionService.js';
import itemService from '../services/itemService.js';
import userService from '../services/userService.js';

import bidService from '../services/bidService.js';
import sequelize from '../libs/db.js';

import { IAuctionManager } from './interfaces/IAuctionManager.js';

import { auctionEvents, AUCTION_EVENTS } from '../domains/auction/events/AuctionEventEmitter.js';
import { scheduleAuctionStart, scheduleAuctionEnd } from '../domains/auction/jobs/cron.js';

class AuctionManager extends IAuctionManager {
    async createAuction(userId, payload) {
        const owner = await userService.findUserById(userId);
        if (owner.userStatus === 'banned') throw new Error('Your account has been banned');
        const item = await itemService.getById(payload.itemId);
        // itemService.checkApprovalStatus(item);
        const newAuction = await auctionService.createAuction(userId, payload);
        scheduleAuctionStart(newAuction.id, newAuction.startTime);
        scheduleAuctionEnd(newAuction.id, newAuction.endTime);
        return newAuction;
    }

    async getAuctionById(id) {
        return await auctionService.getAuctionById(id);
    }

    async getAuctionsByOwnerId(userId) {
        const auctions = await auctionService.getAuctionsByUser(userId);
        return auctions.map(a => a.toJSON ? a.toJSON() : a);
    }

    async getAllAuctions() {
        const auctions = await auctionService.getAllAuctions();
        return auctions.map(a => a.toJSON ? a.toJSON() : a);
    }

    async updateAuction(id, userId, payload) {
        const auction = await auctionService.getAuctionById(id);
        if (auction.ownerId !== userId) {
            throw new Error('Forbidden: You do not have permission to perform this action');
        }
        return await auctionService.updateAuction(auction, payload);
    }

    async deleteAuction(id, userId) {
        const auction = await auctionService.getAuctionById(id);
        if (auction.ownerId !== userId) {
            throw new Error('Forbidden: You do not have permission to perform this action');
        }
        await auctionService.deleteAuction(auction);
    }

    async handleTimeEvent(auctionId, actionType) {
        if (actionType === 'START') {
            const auction = await auctionService.getAuctionById(auctionId);
            await auctionService.changeState(auction, actionType);
            auctionEvents.emit(AUCTION_EVENTS.STARTED, auction);
        } else if (actionType === 'END') {
            const { winnerId, winningAmount } = await this.finalizeAuction(auctionId);

            const auction = await auctionService.getAuctionById(auctionId);
            auctionEvents.emit(AUCTION_EVENTS.ENDED, { auction, winnerId, winningAmount });
        }
    }

    async finalizeAuction(auctionId) {
        const t = await sequelize.transaction();
        try {
            // 1. Lấy và cập nhật trạng thái Auction thành FINISHED
            const auction = await auctionService.getAuctionById(auctionId, { transaction: t });
            await auction.update({ auctionStatus: 'FINISHED' }, { transaction: t });

            // 2. Tìm người thắng cuộc
            const winningBid = await bidService.getHighestBid(auctionId, { transaction: t });
            let winnerId = null;
            let winningAmount = 0;
            
            if (winningBid) {
                await winningBid.update({ isWinningBid: true }, { transaction: t });
                winnerId = winningBid.bidderId;
                winningAmount = winningBid.bidAmount;
            }

            // 3. Hoàn tiền cho người thua thông qua processRefunds
            await this.processRefunds(auction, winnerId, t);

            await t.commit();
            return { winnerId, winningAmount };
        } catch (error) {
            await t.rollback();
            console.error(`[AuctionManager] Error finalizing auction ${auctionId}:`, error);
            throw error;
        }
    }
}

export default new AuctionManager();
