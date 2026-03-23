import itemRepository from '../repositories/ItemRepository.js';

class ItemService {
    
    async createItem(userId, itemData) {
        const { itemName, itemDescription, itemAddress, itemStatus, itemImage, price, category, attributes } = itemData;
        
        return await itemRepository.create({
            userId,
            itemName,
            itemDescription,
            itemAddress,
            itemStatus,
            itemImage,
            price,
            category,
            attributes: attributes || {}
        });
    }

    async getAllUserItems(userId) {
        return await itemRepository.findAllByUserId(userId);
    }

    async findItemForUser(id, userId) {
        const item = await itemRepository.findOneByIdAndUserId(id, userId);
        if (!item) throw new Error('Item not found');
        return item;
    }

    async updateItem(id, userId, updateData) {
        const item = await this.findItemForUser(id, userId);
        const { itemName, itemDescription, itemAddress, itemStatus, itemImage, price, category, attributes } = updateData;

        if (itemName) item.itemName = itemName;
        if (itemDescription) item.itemDescription = itemDescription;
        if (itemAddress) item.itemAddress = itemAddress;
        if (itemStatus) item.itemStatus = itemStatus;
        if (itemImage) item.itemImage = itemImage;
        if (price) item.price = price;
        if (category) item.category = category;
        if (attributes) item.attributes = attributes;

        return await itemRepository.save(item);
    }

    async deleteItem(id, userId) {
        const item = await this.findItemForUser(id, userId);
        return await itemRepository.destroy(item);
    }
}

export default new ItemService();