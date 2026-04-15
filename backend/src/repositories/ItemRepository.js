import RepositoryInterface from './RepositoryInterface.js';
import Item from '../models/Item.js';

class ItemRepository extends RepositoryInterface {
    async create(data, options = {}) { return await Item.create(data, options); }
    async update(values, where, options = {}) { return await Item.update(values, { where, ...options }); }
    async save(itemInstance, options = {}) { return await itemInstance.save(options); }
    async destroy(itemInstance, options = {}) { return await itemInstance.destroy(options); }

    async findById(id, options = {}) { return await Item.findByPk(id, options); }
    async findAll(where = {}, options = {}) { return await Item.findAll({ where, ...options }); }
    async findOne(where = {}, options = {}) { return await Item.findOne({ where, ...options }); }
}

export default new ItemRepository();

