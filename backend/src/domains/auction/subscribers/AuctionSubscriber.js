import { auctionEvents, AUCTION_EVENTS } from '../events/AuctionEventEmitter.js';
import { getIO } from '../../../libs/socket.js';

class AuctionSubscriber {
    constructor() {
        auctionEvents.on(AUCTION_EVENTS.STARTED, this.onAuctionStarted.bind(this));
        auctionEvents.on(AUCTION_EVENTS.ENDED, this.onAuctionEnded.bind(this));
        auctionEvents.on(AUCTION_EVENTS.BID_PLACED, this.onBidPlaced.bind(this));
    }

    async onAuctionStarted(auction) {
        try {
            console.log(`[Subscriber] Auction ${auction.id} STARTED`);
            const io = getIO();
            io.to(`auction_${auction.id}`).emit('auction_started', {
                auctionId: auction.id,
                message: 'Auction started successfully!',
                timestamp: new Date()
            });
        } catch (error) {
            console.error('[Subscriber] Error handling AUCTION_STARTED:', error);
        }
    }

    async onAuctionEnded({ auction, winnerId, winningAmount }) {
        try {
            console.log(`[Subscriber] Auction ${auction.id} ENDED`);
            const io = getIO();
            
            io.to(`auction_${auction.id}`).emit('auction_ended', {
                auctionId: auction.id,
                winnerId: winnerId,
                winningAmount: winningAmount,
                message: winnerId ? 'Auction ended successfully!' : 'Auction ended with no bids.',
                timestamp: new Date()
            });

        } catch (error) {
            console.error('[Subscriber] Error handling AUCTION_ENDED:', error);
        }
    }

    async onBidPlaced(data) {
        try {
            const { bid, userName, currentPrice, previousHighestBidderId } = data;
            console.log(`[Subscriber] New bid placed on auction ${bid.auctionId} by ${userName}`);
            
            const io = getIO();
            
            // 1. Gửi cho tất cả mọi người trong phòng đấu giá giá mới
            io.to(`auction_${bid.auctionId}`).emit('bid_updated', {
                auctionId: bid.auctionId,
                bid: bid,
                userName: userName,
                currentPrice: currentPrice,
                timestamp: new Date()
            });

            // 2. Gửi thông báo riêng cho người vừa bị vượt mặt (Outbid)
            if (previousHighestBidderId) {
                io.to(`user_${previousHighestBidderId}`).emit('outbid', {
                    auctionId: bid.auctionId,
                    message: `You have been outbid on auction ${bid.auctionId}! New price: ${currentPrice}`,
                    timestamp: new Date()
                });
            }
        } catch (error) {
            console.error('[Subscriber] Error handling BID_PLACED:', error);
        }
    }
}


const subscriber = new AuctionSubscriber();
export default subscriber;
