import sequelize from '../../../libs/db.js';
import auctionService from '../../../services/auctionService.js';
import bidService from '../../../services/bidService.js';
import userService from '../../../services/userService.js';
import transactionService from '../../../services/transactionService.js';
import { AuctionStateFactory } from '../states/AuctionStateFactory.js';
import { StandardBiddingStrategy } from '../strategies/StandardBiddingStrategy.js';
import { auctionEvents, AUCTION_EVENTS } from '../events/AuctionEventEmitter.js';

export class PlaceBidCommand {
    constructor(bidderId, { auctionId, bidAmount }, strategy = new StandardBiddingStrategy()) {
        this.bidderId = bidderId;
        this.auctionId = auctionId;
        this.bidAmount = bidAmount;
        this.strategy = strategy;
    }

    async execute() {
        const t = await sequelize.transaction();
        try {
            // 1. Khóa row Auction để tránh race condition
            const auction = await auctionService.getAuctionById(this.auctionId, { 
                transaction: t,
                lock: t.LOCK.UPDATE 
            });
            if (!auction) throw new Error('Auction not found');

            // 2. Kiểm tra đặt cọc
            const hasDeposit = await transactionService.getDepositStatus(this.bidderId, this.auctionId, { transaction: t });
            if (!hasDeposit) {
                throw new Error('You must pay deposit before placing a bid');
            }

            // 3. Kiểm tra trạng thái bằng State Pattern
            const state = AuctionStateFactory.fromAuction(auction);
            if (!state.canPlaceBid(auction)) {
                throw new Error('Auction is not in bidding state');
            }

            // 4. Lấy giá hiện tại và áp dụng Strategy
            const highestBid = await bidService.getHighestBid(this.auctionId, { transaction: t });
            const currentPrice = highestBid ? parseFloat(highestBid.bidAmount) : parseFloat(auction.startingPrice);
            const increment = parseFloat(auction.stepPrice || 0);

            // Validate bằng Strategy
            this.strategy.validate(this.bidAmount, currentPrice, increment);

            // 5. Tạo bản ghi Bid
            const bid = await bidService.create({ 
                auctionId: this.auctionId, 
                bidderId: this.bidderId, 
                bidAmount: this.bidAmount 
            }, { transaction: t });

            const user = await userService.findUserById(this.bidderId, { transaction: t });
            const previousHighestBidderId = highestBid ? highestBid.bidderId : null;

            await t.commit();

            // 6. Phát hành sự kiện thành công
            const result = { bid, userName: user.userName, currentPrice: this.bidAmount, previousHighestBidderId };
            auctionEvents.emit(AUCTION_EVENTS.BID_PLACED, result);

            return result;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}
