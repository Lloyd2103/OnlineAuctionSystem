import Auction from '../models/Auction.js';

class AuctionRepository {
	getModel() {
		return Auction;
	}

	async create(data, options = {}) {
		return await Auction.create(data, options);
	}

	async findById(id, options = {}) {
		return await Auction.findByPk(id, options);
	}

	async findAll(options = {}) {
		return await Auction.findAll(options);
	}

	async save(auctionInstance, options = {}) {
		return await auctionInstance.save(options);
	}

	async destroy(auctionInstance, options = {}) {
		return await auctionInstance.destroy(options);
	}

	async update(values, where, options = {}) {
		return await Auction.update(values, { where, ...options });
	}
}

export default new AuctionRepository();

