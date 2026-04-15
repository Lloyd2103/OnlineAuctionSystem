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

	async handleTimeEvent(auctionId, actionType) {
		throw new Error('Not implemented');
	}

}

