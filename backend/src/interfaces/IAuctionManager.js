export class IAuctionManager {

	async createAuction(ownerId, payload) {
		throw new Error('Not implemented');
	}

	async getAuctionById(id) {
		throw new Error('Not implemented');
	}

	async getAllAuctionsForOwner(ownerId) {
		throw new Error('Not implemented');
	}

	async updateAuction(id, ownerId, payload) {
		throw new Error('Not implemented');
	}

	async deleteAuction(id, ownerId) {
		throw new Error('Not implemented');
	}

	// Bidding

	async placeBid(bidderId, payload) {
		throw new Error('Not implemented');
	}

	async getAuctionStats(auctionId) {
		throw new Error('Not implemented');
	}

	async getBidHistory(bidderId) {
		throw new Error('Not implemented');
	}
}

