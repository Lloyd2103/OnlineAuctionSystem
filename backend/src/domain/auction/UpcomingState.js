import { AuctionState } from './AuctionState.js';

export class UpcomingState extends AuctionState {
  canEditAuction(auction, actorId) {
    return auction.ownerId === actorId;
  }

  canDeleteAuction(auction, actorId) {
    return auction.ownerId === actorId;
  }

  canPlaceBid(_auction, _now) {
    return false;
  }
}

