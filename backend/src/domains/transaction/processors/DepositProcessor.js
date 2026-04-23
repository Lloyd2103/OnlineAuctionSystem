// src/domains/transaction/processors/DepositProcessor.js
import { BasePaymentProcessor } from '../BasePaymentProcessor.js';
import { WalletStrategy } from '../strategies/WalletStrategy.js';
import auctionService from '../../../services/auctionService.js';
import userService from '../../../services/userService.js';
import transactionService from '../../../services/transactionService.js';
import { AuctionStateFactory } from '../../auction/states/AuctionStateFactory.js';

export class DepositProcessor extends BasePaymentProcessor {
    async validate(context) {
        const { bidderId, auctionId } = context.params;

        const [user, auction, existingDeposit] = await Promise.all([
            userService.findUserById(bidderId, { transaction: context.transaction }),
            auctionService.getAuctionById(auctionId, { transaction: context.transaction }),
            transactionService.getDepositStatus(bidderId, auctionId, { transaction: context.transaction })
        ]);

        if (!user) throw new Error('User not found');
        if (!auction) throw new Error('Auction not found');
        if (existingDeposit) throw new Error('You have already placed a deposit for this auction');

        const state = AuctionStateFactory.fromAuction(auction);
        if (!state.canPlaceBid(auction)) {
            throw new Error('Auction is not in a state that allows bidding');
        }
        
        context.data.user = user;
        context.data.auction = auction;
    }

    async performPayment(context) {
        const { user, auction } = context.data;
        // Đặt cọc mặc định dùng Ví
        const strategy = new WalletStrategy();
        // Thực hiện trừ tiền
        context.data.updatedUser = await strategy.pay(user, auction.mandatoryDeposit, context.transaction);
    }

    async recordLogs(context) {
        const { bidderId, auctionId } = context.params;
        const { auction, updatedUser } = context.data;

        await transactionService.createTransaction({
            userId: bidderId,
            auctionId,
            amount: -auction.mandatoryDeposit,
            type: 'AUCTION_DEPOSIT',
            walletBalance: updatedUser.walletBalance
        }, { transaction: context.transaction });

        context.result = {
            message: 'Deposit successfully',
            walletBalance: updatedUser.walletBalance
        };
    }
}
