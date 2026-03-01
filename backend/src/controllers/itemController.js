import Item from '../models/Item.js';

export const createItem = async (req, res) => {
    try {
        const { itemName, itemDescription, itemAddress, price, category, attributes } = req.body;
        if (!itemName || !itemDescription || !itemAddress || !price || !category) {
            return res.status(400).json({ message: 'All fields except itemImage are required' });
        }
        const newItem = await Item.create({
            itemName,
            itemDescription,
            itemAddress,
            price,
            category,
            attributes: attributes || {}
        });
        return res.status(201).json({ item: newItem });
    } catch (error) {
        console.error('Error in createItem:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getAllItems = async (req, res) => {
    try {
        const items = await Item.findAll();
        return res.status(200).json({ items });
    } catch (error) {
        console.error('Error in getAllItems:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        return res.status(200).json({ item });
    } catch (error) {
        console.error('Error in getItemById:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { itemName, itemDescription, itemAddress, price, category, attributes } = req.body;
        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (itemName) item.itemName = itemName;
        if (itemDescription) item.itemDescription = itemDescription;
        if (itemAddress) item.itemAddress = itemAddress;
        if (price) item.price = price;
        if (category) item.category = category;
        if (attributes) item.attributes = attributes;

        await item.save();
        return res.status(200).json({ item });
    } catch (error) {
        console.error('Error in updateItem:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        await item.destroy();
        return res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error in deleteItem:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

