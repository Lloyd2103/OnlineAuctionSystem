import User from '../models/User.js';

class UserRepository {
	async findById(id, options = {}) {
		return await User.findByPk(id, options);
	}

	async findByEmail(userEmail, options = {}) {
		return await User.findOne({ where: { userEmail }, ...options });
	}

	async findByPhone(userPhone, options = {}) {
		return await User.findOne({ where: { userPhone }, ...options });
	}

	async findByUsername(userName, options = {}) {
		return await User.findOne({ where: { userName }, ...options });
	}

	async create(data, options = {}) {
		return await User.create(data, options);
	}

	async save(userInstance, options = {}) {
		return await userInstance.save(options);
	}
}

export default new UserRepository();

