import EventEmitter from 'events';

class AuctionEventEmitter extends EventEmitter {}

export const auctionEvents = new AuctionEventEmitter();

export const AUCTION_EVENTS = {
    STARTED: 'AUCTION_STARTED',
    ENDED: 'AUCTION_ENDED'
};
