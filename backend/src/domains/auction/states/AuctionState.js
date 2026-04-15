export class AuctionState {
    start(auction) {
        throw new Error('Action not allowed in current state: Cannot start.');
    }
    
    end(auction) {
        throw new Error('Action not allowed in current state: Cannot end.');
    }
    
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
