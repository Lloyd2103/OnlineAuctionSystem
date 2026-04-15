import { AuctionState } from './AuctionState.js';

export class EndedState extends AuctionState {
    canPlaceBid(auction, now) {
        return false;
    }

    canEditAuction(auction, ownerId) {
        return false;
    }

    canDeleteAuction(auction, ownerId) {
        return false;
    }
}
