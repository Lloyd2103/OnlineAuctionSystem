import { AuctionState } from './AuctionState.js';

export class UpcomingState extends AuctionState {
    start(auction) {
        auction.auctionStatus = 'ACTIVE';
        return true;
    }

    canEditAuction(auction, ownerId) {
        return auction.ownerId === ownerId;
    }

    canDeleteAuction(auction, ownerId) {
        return auction.ownerId === ownerId;
    }
}
