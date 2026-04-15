import RepositoryInterface from './RepositoryInterface.js';
import User from '../models/User.js';

class UserRepository extends RepositoryInterface {
	async create(data, options = {}) { return await User.create(data, options); }
	async update(values, where, options = {}) { return await User.update(values, { where, ...options }); }
	async destroy(where, options = {}) { return await User.destroy({ where, ...options }); }
	async save(userInstance, options = {}) { return await userInstance.save(options); }

	async findAll(where = {}, options = {}) { return await User.findAll({ where, ...options }); }
	async findOne(where = {}, options = {}) { return await User.findOne({ where, ...options }); }
	async findById(id, options = {}) { return await User.findByPk(id, options); }
}

export default new UserRepository();

