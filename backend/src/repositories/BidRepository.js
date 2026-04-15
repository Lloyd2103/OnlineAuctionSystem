import RepositoryInterface from './RepositoryInterface.js';
import Bid from '../models/Bid.js';

class BidRepository extends RepositoryInterface {
    async create(data, options = {}) { return await Bid.create(data, options); }
    async update(values, where, options = {}) { return await Bid.update(values, { where, ...options }); }
    async destroy(where, options = {}) { return await Bid.destroy({ where, ...options }); }
    async save(bidInstance, options = {}) { return await bidInstance.save(options); }

    async findAll(where = {}, order = [], options = {}) { return await Bid.findAll({ where, order, ...options }); }
    async findOne(where = {}, order = [], options = {}) { return await Bid.findOne({ where, order, ...options }); }
    async findById(id, options = {}) { return await Bid.findByPk(id, options); }
}

export default new BidRepository();


