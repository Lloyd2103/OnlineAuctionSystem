import { UpcomingState } from './UpcomingState.js';
import { ActiveState } from './ActiveState.js';
import { EndedState } from './EndedState.js';

export class AuctionStateFactory {
    static fromAuction(auction, now = new Date()) {
        const { auctionStatus } = auction;

        switch (auctionStatus) {
            case 'UPCOMING':
                return new UpcomingState();
            case 'ACTIVE':
                return new ActiveState();
            case 'ENDED':
                return new EndedState();
            default:
                throw new Error(`Invalid auction state: ${auctionStatus}`);
        }
    }
}
