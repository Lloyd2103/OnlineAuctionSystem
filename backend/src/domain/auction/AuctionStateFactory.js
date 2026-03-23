import { UpcomingState } from './UpcomingState.js';
import { ActiveState } from './ActiveState.js';
import { EndedState } from './EndedState.js';

const UPCOMING = new UpcomingState();
const ACTIVE = new ActiveState();
const ENDED = new EndedState();

export class AuctionStateFactory {
  /**
   * @param {object} auction
   * @param {Date} now
   */
  static fromAuction(auction, now = new Date()) {
    // Prefer explicit status if it exists; otherwise derive from time.
    const status = auction?.auctionStatus;
    if (status === 'UPCOMING') return UPCOMING;
    if (status === 'ACTIVE') return ACTIVE;
    if (status === 'ENDED') return ENDED;

    const start = new Date(auction.startTime);
    const end = new Date(auction.endTime);
    if (now < start) return UPCOMING;
    if (now > end) return ENDED;
    return ACTIVE;
  }
}

