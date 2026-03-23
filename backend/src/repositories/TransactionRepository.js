import Transaction from '../models/Transaction.js';

class TransactionRepository {
	async create(data, options = {}) {
		return await Transaction.create(data, options);
	}

	async bulkCreate(rows, options = {}) {
		return await Transaction.bulkCreate(rows, options);
	}

	async findAllByUserId(userId, options = {}) {
		return await Transaction.findAll({
		where: { userId },
		order: [['createdAt', 'DESC']],
		...options,
		});
	}

	async findOneByIdAndUserId(id, userId, options = {}) {
		return await Transaction.findOne({ where: { id, userId }, ...options });
	}
}

export default new TransactionRepository();

