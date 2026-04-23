class RepositoryInterface {
	

	async create(data, options = {}) { return await this.model.create(data, options); }
	async update(values, where, options = {}) { return await this.model.update(values, { where, ...options }); }
	async destroy(where, options = {}) { return await this.model.destroy({ where, ...options }); }
	async save(instance, options = {}) { return await instance.save(options); }

	async findAll(where = {}, options = {}) { return await this.model.findAll({ where, ...options }); }
	async findAndCountAll(where = {}, options = {}) { return await this.model.findAndCountAll({ where, ...options }); }
	async findOne(where = {}, options = {}) { return await this.model.findOne({ where, ...options }); }
	async findByPk(id, options = {}) { return await this.model.findByPk(id, options); }
}

export default RepositoryInterface;