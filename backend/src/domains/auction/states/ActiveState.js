import { AuctionState } from './AuctionState.js';

export class ActiveState extends AuctionState {
    end(auction) {
        auction.auctionStatus = 'ENDED';
        return true;
    }

    canPlaceBid(auction, now = new Date()) {
        const startTime = new Date(auction.startTime);
        const endTime = new Date(auction.endTime);
        return now >= startTime && now <= endTime;
    }

    canEditAuction(auction, ownerId) {
        return false;
    }

    canDeleteAuction(auction, ownerId) {
        return false;
    }
}
