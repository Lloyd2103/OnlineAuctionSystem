import RepositoryInterface from './RepositoryInterface.js';
import Auction from '../models/Auction.js';

class AuctionRepository extends RepositoryInterface {
	async create(data, options = {}) { return await Auction.create(data, options); }
	async update(values, where, options = {}) { return await Auction.update(values, { where, ...options }); }
	async destroy(where, options = {}) { return await Auction.destroy({ where, ...options }); }
	async save(auctionInstance, options = {}) { return await auctionInstance.save(options); }

	async findAll(where = {}, options = {}) { return await Auction.findAll({ where, ...options }); }
	async findOne(where = {}, options = {}) { return await Auction.findOne({ where, ...options }); }
	async findByPk(id, options = {}) { return await Auction.findByPk(id, options); }

	async findAndCountAll(where = {}, options = {}) { return await Auction.findAndCountAll({ where, ...options }); }
}

export default new AuctionRepository();

