import auctionService from '../services/auctionService.js';
import itemService from '../services/itemService.js';
import userService from '../services/userService.js';
import { IAuctionManager } from './interfaces/IAuctionManager.js';
import { NormalAuctionFinisher } from '../domains/auction/finishers/NormalAuctionFinisher.js';
import { BuyNowAuctionFinisher } from '../domains/auction/finishers/BuyNowAuctionFinisher.js';
import { CanceledAuctionFinisher } from '../domains/auction/finishers/CanceledAuctionFinisher.js';

import { scheduleAuctionStart, scheduleAuctionEnd } from '../domains/auction/jobs/cron.js';
import { auctionEvents, AUCTION_EVENTS } from '../domains/auction/events/AuctionEventEmitter.js';


class AuctionManager extends IAuctionManager {
    async createAuction(userId, payload) {
        const owner = await userService.findUserById(userId);
        if (owner.userStatus !== 'active') {
            throw new Error(`Your account is ${owner.userStatus}. Please wait for admin approval.`);
        }
        const item = await itemService.getItemById(payload.itemId);
        itemService.checkApprovalStatus(item);
        const newAuction = await auctionService.createAuction(userId, payload);
        scheduleAuctionStart(newAuction.id, newAuction.startTime);
        scheduleAuctionEnd(newAuction.id, newAuction.endTime);
        return newAuction;
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

    async getAuctionById(id) {
        return await auctionService.getAuctionById(id);
    }

    async getAuctionsByOwnerId(userId, options = {}) {
        const auctions = await auctionService.getAuctionsByUser(userId, options);
        return auctions;
    }

    async getAllAuctions(options = {}) {
        const auctions = await auctionService.getAllAuctions({}, options);
        return auctions;
    }

    async handleTimeEvent(auctionId, actionType) {
        if (actionType === 'START') {
            const auction = await auctionService.getAuctionById(auctionId);
            await auctionService.changeState(auction, actionType);
            auctionEvents.emit(AUCTION_EVENTS.STARTED, auction);
        } else if (actionType === 'END') {
            const finisher = new NormalAuctionFinisher();
            await finisher.execute(auctionId);
        }
    }

    async buyNowAuction(auctionId, userId) {
        const buyer = await userService.findUserById(userId);
        const finisher = new BuyNowAuctionFinisher();
        return await finisher.execute({ auctionId, buyer });
    }

    async cancelAuction(auctionId, userId) {
        // Có thể thêm kiểm tra quyền Admin hoặc Owner ở đây
        const finisher = new CanceledAuctionFinisher();
        return await finisher.execute(auctionId);
    }

    /**
     * @deprecated Sử dụng Template Finisher thay thế
     */
    async finalizeAuction(auctionId) {
        const finisher = new NormalAuctionFinisher();
        return await finisher.execute(auctionId);
    }

    
}


export default new AuctionManager();

