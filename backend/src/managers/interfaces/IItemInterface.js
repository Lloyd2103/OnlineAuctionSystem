export class IItemManager {
    async createItem(ownerId, payload) {
        throw new Error('Not implemented');
    }

    async getItemById(id) {
        throw new Error('Not implemented');
    }

    async getAllItemsForOwner(ownerId) {
        throw new Error('Not implemented');
    }

    async updateItem(id, ownerId, payload) {
        throw new Error('Not implemented');
    }

    async deleteItem(id, ownerId) {
        throw new Error('Not implemented');
    }
}