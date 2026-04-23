import Session from '../models/Session.js';

class SessionRepository {
	async create(data, options = {}) { return await Session.create(data, options); }
	async update(values, where, options = {}) { return await Session.update(values, { where, ...options }); }
	async destroy(where, options = {}) { return await Session.destroy({ where, ...options }); }
	async save(sessionInstance, options = {}) { return await sessionInstance.save(options); }

	async findAll(where = {}, options = {}) { return await Session.findAll({ where, ...options }); }
	async findOne(where = {}, options = {}) { return await Session.findOne({ where, ...options }); }
	async findByPk(id, options = {}) { return await Session.findByPk(id, options); }

	async deleteByRefreshToken(refreshToken, options = {}) { return await Session.destroy({ where: { refreshToken }, ...options }); }
	async findByRefreshToken(refreshToken, options = {}) { return await Session.findOne({ where: { refreshToken }, ...options }); }
	async deleteById(id, options = {}) { return await Session.destroy({ where: { id }, ...options }); }
}

export default new SessionRepository();

