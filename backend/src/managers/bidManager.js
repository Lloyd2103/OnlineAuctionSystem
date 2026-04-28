import bidService from '../services/bidService.js';
import { PlaceBidCommand } from '../domains/auction/commands/PlaceBidCommand.js';
import { IBidManager } from './interfaces/IBidManager.js';

class BidManager extends IBidManager {
    async getAuctionStats(auctionId) {
        return await bidService.getStats(auctionId);
    }

    async getBidHistory(bidderId) {
        return await bidService.getUserHistory(bidderId);
    }

    async placeBid(bidderId, { auctionId, bidAmount }) {
        const command = new PlaceBidCommand(bidderId, { auctionId, bidAmount });
        return await command.execute();
    }
}

export default new BidManager();
