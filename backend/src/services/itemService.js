import itemRepository from '../repositories/ItemRepository.js';

class ItemService {
    validateItemAttributes(itemData) {
        if (!itemData.itemName || itemData.price < 0) {
            throw new Error('Invalid input on name or price');
        }
    }

    // Logic: Kiểm tra trạng thái đã duyệt chưa (Ví dụ để Manager dùng khi tạo Auction)
    checkApprovalStatus(item) {
        if (item.itemStatus !== 'approved') {
            throw new Error('Item is not approved');
        }
    }

    async createItem(userId, itemData) {
        this.validateItemAttributes(itemData);
        const data = {
            ...itemData,
            userId,
            itemStatus: 'pending',
            attributes: itemData.attributes || {}
        };
        return await itemRepository.create(data);
    }

    async getItemById(id, options = {}) {
        const item = await itemRepository.findByPk(id, options);
        if (!item) throw new Error('Item not found');
        return item;
    }

    async getItemsByUserId(userId, options = {}) {
        return await itemRepository.findAndCountAll({ userId }, options);
    }

    async updateFields(itemInstance, updateData) {
        if (updateData.price !== undefined) {
            this.validateItemAttributes({ ...itemInstance.get({ plain: true }), ...updateData });
        }

        const fields = [
            'itemName', 'itemDescription', 'itemAddress', 
            'itemStatus', 'itemImage', 'price', 'category', 'attributes'
        ];

        fields.forEach(field => {
            if (updateData[field] !== undefined) {
                itemInstance[field] = updateData[field];
            }
        });

        return await itemRepository.save(itemInstance);
    }

    async deleteItem(itemInstance) {
        return await itemRepository.destroy(itemInstance);
    }

    async getAllItems(options = {}) {
        return await itemRepository.findAndCountAll({}, { order: [['createdAt', 'DESC']], ...options });
    }
}

export default new ItemService();
