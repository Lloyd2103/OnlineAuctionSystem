export class IBidManager {
    async placeBid(userId, auctionId, amount) {
        throw new Error('Not implemented');
    }

    async getBidById(id) {
        throw new Error('Not implemented');
    }

    async getBidsByAuctionId(auctionId) {
        throw new Error('Not implemented');
    }

    async getBidsByUserId(userId) {
        throw new Error('Not implemented');
    }

    async deleteBid(id, userId) {
        throw new Error('Not implemented');
    }
}