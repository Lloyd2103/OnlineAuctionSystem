export class ITransactionManager {
    async deposit(userInstance, amount) {
        throw new Error('Not implemented');
    }

    async transfer(userInstance, recipientUsername, amount) {
        throw new Error('Not implemented');
    }

    async history(userId) {
        throw new Error('Not implemented');
    }

    async payDeposit(bidderId, auctionId) {
        throw new Error('Not implemented');
    }

    async payWinningFee(winnerId, auctionId) {
        throw new Error('Not implemented');
    }

    async refundDeposit(bidderId, auctionId) {
        throw new Error('Not implemented');
    }

    async getTransactionHistory(userId, options) {
        throw new Error('Not implemented');
    }
}

