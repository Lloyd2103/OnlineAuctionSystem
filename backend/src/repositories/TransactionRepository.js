import RepositoryInterface from './RepositoryInterface.js';
import Transaction from '../models/Transaction.js';

class TransactionRepository extends RepositoryInterface {
	async create(data, options = {}) { return await Transaction.create(data, options); }
	async update(values, where, options = {}) { return await Transaction.update(values, { where, ...options }); }
	async destroy(where, options = {}) { return await Transaction.destroy({ where, ...options }); }
	async save(transactionInstance, options = {}) { return await transactionInstance.save(options); }

	async findAll(where = {}, options = {}) { return await Transaction.findAll({ where, ...options }); }
	async findOne(where = {}, options = {}) { return await Transaction.findOne({ where, ...options }); }
	async findByPk(id, options = {}) { return await Transaction.findByPk(id, options); }
	async bulkCreate(rows, options = {}) { return await Transaction.bulkCreate(rows, options); }

	async findAndCountAll(where = {}, options = {}) { return await Transaction.findAndCountAll({ where, ...options }); }
}

export default new TransactionRepository();

