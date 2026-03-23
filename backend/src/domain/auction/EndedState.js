import { AuctionState } from './AuctionState.js';

export class EndedState extends AuctionState {
  canEditAuction(_auction, _actorId) {
    return false;
  }

  canDeleteAuction(_auction, _actorId) {
    return false;
  }

  canPlaceBid(_auction, _now) {
    return false;
  }
}

