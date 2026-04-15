import itemService from '../services/itemService.js';

class ItemManager {
    async createItem(userId, itemData) {
        return await itemService.create(userId, itemData);
    }

    async updateItem(id, userId, updateData) {
        const item = await itemService.getById(id);
        if (item.userId !== userId) {
            throw new Error('Forbidden: You do not own this item');
        }
        return await itemService.updateFields(item, updateData);
    }

    async deleteItem(id, userId) {
        const item = await itemService.getById(id);
        if (item.userId !== userId) {
            throw new Error('Forbidden: You do not own this item');
        }
        return await itemService.delete(item);
    }

    async getAllUserItems(userId) {
        return await itemService.getItemsByUserId(userId);
    }

    async updateItemStatus(id, newStatus) {
        const item = await itemService.getById(id);
        const validStatuses = ['pending', 'approved', 'rejected', 'available'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error('Invalid status');
        }
        return await itemService.updateFields(item, { itemStatus: newStatus });
    }
}

export default new ItemManager();
