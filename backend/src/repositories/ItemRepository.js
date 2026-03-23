import Item from '../models/Item.js';

class ItemRepository {
    async create(data, options = {}) {
        return await Item.create(data, options);
    }

    async findAllByUserId(userId, options = {}) {
        return await Item.findAll({ where: { userId }, ...options });
    }

    async findOneByIdAndUserId(id, userId, options = {}) {
        return await Item.findOne({ where: { id, userId }, ...options });
    }

    async save(itemInstance, options = {}) {
        return await itemInstance.save(options);
    }

    async destroy(itemInstance, options = {}) {
        return await itemInstance.destroy(options);
    }
}

export default new ItemRepository();

