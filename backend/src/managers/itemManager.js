import itemService from '../services/itemService.js';
import { ItemManagerInterface } from './interfaces/ItemManagerInterface.js';

class ItemManager extends ItemManagerInterface {
    async createItem(userId, itemData) {
        const item = await itemService.createItem(userId, itemData);
        return item;
    }

    async updateItem(id, userId, updateData) {
        const item = await itemService.getItemById(id);
        if (item.userId !== userId) {
            throw new Error('Forbidden: You do not own this item');
        }
        return await itemService.updateFields(item, updateData);
    }

    async updateItemStatus(id, newStatus) {
        const item = await itemService.getItemById(id);
        const validStatuses = ['pending', 'approved', 'rejected', 'available'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error('Invalid status');
        }
        return await itemService.updateFields(item, { itemStatus: newStatus });
    }

    async deleteItem(id, userId) {
        const item = await itemService.getItemById(id);
        if (item.userId !== userId) {
            throw new Error('Forbidden: You do not own this item');
        }
        return await itemService.deleteItem(item);
    }

    async getItemById(id) {
        const item = await itemService.getItemById(id);
        if (!item) {
            throw new Error('Item not found');
        }
        return item;
    }

    async getAllUserItems(userId, options = {}) {
        return await itemService.getItemsByUserId(userId, options);
    }

    async getAllItems(options = {}) {
        return await itemService.getAllItems(options);
    }
}

export default new ItemManager();
