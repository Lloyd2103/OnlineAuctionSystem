import sequelize from '../libs/db.js';
import transactionService from '../services/transactionService.js';
import fakePaymentService from '../services/fakePaymentService.js';
import userService from '../services/userService.js';
import auctionService from '../services/auctionService.js';
import { AuctionStateFactory } from '../domains/auction/states/AuctionStateFactory.js';

class TransactionManager {
    async getWalletBalance(userId) {
        const user = await userService.findUserById(userId);
        if (!user) throw new Error('User not found');
        return user.walletBalance;
    }

    async getUserTransactions(userId) {
        return await transactionService.getTransactions(userId);
    }

    async getDepositStatus(bidderId, auctionId) {
        return await transactionService.findDepositStatus(bidderId, auctionId);
    }

    async payDeposit(bidderId, auctionId) {
        // 1. Dùng Transaction của Sequelize để đảm bảo tính an toàn
        const t = await sequelize.transaction();

        try {
            const user = await userService.findUserById(bidderId, { transaction: t });
            const auction = await auctionService.getAuctionById(auctionId, { transaction: t });
            const state = AuctionStateFactory.fromAuction(auction);

            if (!state.canPlaceBid(auction)) {
                throw new Error('Auction is not in bidding state');
            }

            // 3. Kiểm tra xem đã đặt cọc chưa (Tránh đặt cọc 2 lần)
            const existingDeposit = await transactionService.findDepositStatus(bidderId, auctionId, { transaction: t });
            if (existingDeposit) {
                return { message: 'Already deposited' };
            }

            if (Number(user.walletBalance) < Number(auction.mandatoryDeposit)) {
                throw new Error('Insufficient wallet balance');
            }

            // 4. Thực hiện trừ tiền trong Wallet của User
            const newBalance = Number(user.walletBalance) - Number(auction.mandatoryDeposit);
            console.log("newBalance", newBalance);

            if (isNaN(newBalance)) {
                console.log("user.walletBalance:", user.walletBalance);
                console.log("auction.mandatoryDeposit:", auction.mandatoryDeposit);
                throw new Error('Invalid deposit amount calculation');
            }
            await user.update({ walletBalance: newBalance }, { transaction: t });

            // 5. Lưu log giao dịch với trạng thái COMPLETED (hoặc FROZEN)
            await transactionService.createTransaction({
                userId: user.id,
                auctionId: auction.id,
                amount: -Number(auction.mandatoryDeposit), // Lưu số âm để thể hiện tiền ra
                type: 'AUCTION_DEPOSIT',
                paymentMethod: 'WALLET',
                paymentStatus: 'COMPLETED',
                walletBalance: newBalance // Lưu snapshot số dư sau khi trừ
            }, { transaction: t });

            // Commit mọi thay đổi
            await t.commit();
            
            return { message: 'Deposit successful', newBalance };

        } catch (error) {
            // Nếu có bất kỳ lỗi nào, hoàn tác toàn bộ (không trừ tiền, không lưu log)
            await t.rollback();
            throw error;
        }
    }

    async transfer(senderInstance, recipientUsername, amount) {
        const t = await sequelize.transaction();
        try {
            const recipient = await userService.findByUsername(recipientUsername, { transaction: t });
            if (!recipient) throw new Error('Recipient user not found');
            const transferAmount = parseFloat(amount);
            // Bước 1: Trừ tiền người gửi & cộng tiền ng nhận qua UserService
            const updatedSender = await userService.updateBalance(senderInstance, -transferAmount, { transaction: t });
            const updatedRecipient = await userService.updateBalance(recipient, transferAmount, { transaction: t });
            // Bước 2: Ghi log lịch sử bên Manager uỷ thác cho service
            await transactionService.createTransaction({
                userId: updatedSender.id,
                amount: -transferAmount,
                type: 'TRANSFER_OUT',
                walletBalance: updatedSender.walletBalance
            }, { transaction: t });
            await transactionService.createTransaction({
                userId: updatedRecipient.id,
                amount: transferAmount,
                type: 'TRANSFER_IN',
                walletBalance: updatedRecipient.walletBalance
            }, { transaction: t });
            await t.commit();
            return updatedSender.walletBalance;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async deposit(userInstance, amount) {
        await fakePaymentService.processPayment(amount, 'BANK_TRANSFER');
        const updatedUser = await userService.updateBalance(userInstance, amount);
        return await transactionService.createTransaction({
            userId: updatedUser.id,
            amount,
            type: 'DEPOSIT',
            walletBalance: updatedUser.walletBalance
        });
    }

    async withdraw(userInstance, amount) {
        await fakePaymentService.processPayment(amount, 'BANK_TRANSFER');
        const updatedUser = await userService.updateBalance(userInstance, -amount);
        return await transactionService.createTransaction({
            userId: updatedUser.id,
            amount: -amount,
            type: 'WITHDRAWAL',
            walletBalance: updatedUser.walletBalance
        });
    }

    async processAuctionPayment(userInstance, auctionId, amount, method) {
        const t = await sequelize.transaction();
        try {
            const auction = await auctionService.getAuctionById(auctionId, { transaction: t });
            
            const parsedAmount = parseFloat(amount);
            let finalUserInstance = userInstance;
            // Nếu dùng External Gateway (Credit Card, PayPal, Crypto...)
            if (method !== 'WALLET') {
                await fakePaymentService.processPayment(amount, method);
            } else {
                // Trừ ví người mua thông qua UserService
                finalUserInstance = await userService.updateBalance(userInstance, -parsedAmount, { transaction: t });
            }
            // Ghi log bên người chuyển (Winner)
            await transactionService.createTransaction({
                userId: finalUserInstance.id,
                auctionId: auction.id,
                amount: -parsedAmount,
                type: 'AUCTION_PAYMENT',
                paymentMethod: method,
                walletBalance: finalUserInstance.walletBalance
            }, { transaction: t });
            // Cộng tiền vào ví cho bên nhận (Owner)
            const owner = await userService.findUserById(auction.ownerId, { transaction: t });
            const updatedOwner = await userService.updateBalance(owner, parsedAmount, { transaction: t });
            
            await transactionService.createTransaction({
                userId: updatedOwner.id,
                auctionId: auction.id,
                amount: parsedAmount,
                type: 'AUCTION_PAYMENT',
                paymentMethod: 'WALLET',
                walletBalance: updatedOwner.walletBalance
            }, { transaction: t });
            // Update state
            await auctionService.updateAuction(auction, { auctionStatus: 'COMPLETED' }, { transaction: t });
            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async processRefunds(auction, winnerId) {
        const t = await sequelize.transaction();
        const deposits = await transactionService.getDepositsByAuctionId(auction.id, { transaction: t });
        for (const deposit of deposits) {
            if (deposit.userId !== winnerId) {
                const refundAmount = Math.abs(deposit.amount);
                const userToRefund = await userService.findUserById(deposit.userId, { transaction: t });
                await userService.updateBalance(userToRefund, refundAmount);
                await transactionService.createTransaction({
                    userId: deposit.userId,
                    auctionId: auction.id,
                    amount: refundAmount,
                    type: 'AUCTION_REFUND',
                    paymentStatus: 'COMPLETED',
                    walletBalance: userToRefund.walletBalance
                });
            }
        }
    }
}

export default new TransactionManager();
