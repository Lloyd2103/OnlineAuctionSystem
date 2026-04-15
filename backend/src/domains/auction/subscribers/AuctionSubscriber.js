import { auctionEvents, AUCTION_EVENTS } from '../events/AuctionEventEmitter.js';
import { getIO } from '../../../libs/socket.js';
import bidRepository from '../../../repositories/BidRepository.js';

class AuctionSubscriber {
    constructor() {
        auctionEvents.on(AUCTION_EVENTS.STARTED, this.onAuctionStarted.bind(this));
        auctionEvents.on(AUCTION_EVENTS.ENDED, this.onAuctionEnded.bind(this));
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
            
            // 1. Broadcast công khai qua Socket cho tất cả người trong phòng đấu giá
            io.to(`auction_${auction.id}`).emit('auction_ended', {
                auctionId: auction.id,
                winnerId: winnerId,
                winningAmount: winningAmount,
                message: winnerId ? 'Auction ended successfully!' : 'Auction ended with no bids.',
                timestamp: new Date()
            });

            // 2. Gửi thông báo cá nhân cho người chiến thắng (nếu có)
            if (winnerId) {
                console.log(`[Subscriber] Emit win notification to user_${winnerId}`);
                io.to(`user_${winnerId}`).emit('new_notification', {
                    type: 'AUCTION_WIN',
                    title: 'Congratulations!',
                    message: `You won the auction round for item ${auction.itemId} with amount $${winningAmount}.`,
                    timestamp: new Date()
                });
            }

        } catch (error) {
            console.error('[Subscriber] Error handling AUCTION_ENDED:', error);
        }
    }
}

const subscriber = new AuctionSubscriber();
export default subscriber;
