import Session from '../models/Session.js';

class SessionRepository {
	async create(data, options = {}) {
		return await Session.create(data, options);
	}

	async findByRefreshToken(refreshToken, options = {}) {
		return await Session.findOne({ where: { refreshToken }, ...options });
	}

	async deleteByRefreshToken(refreshToken, options = {}) {
		return await Session.destroy({ where: { refreshToken }, ...options });
	}

	async deleteById(id, options = {}) {
		return await Session.destroy({ where: { id }, ...options });
	}
}

export default new SessionRepository();

