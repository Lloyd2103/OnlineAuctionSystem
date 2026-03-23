import { AuctionState } from './AuctionState.js';

export class ActiveState extends AuctionState {
  canEditAuction(_auction, _actorId) {
    return false;
  }

  canDeleteAuction(_auction, _actorId) {
    return false;
  }

  canPlaceBid(auction, now) {
    return now >= new Date(auction.startTime) && now <= new Date(auction.endTime);
  }
}

