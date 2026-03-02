import itemService from '../services/itemService.js';

export const createItem = async (req, res) => {
    try {
        
        const newItem = await itemService.createItem(req.user.id, req.body);
        
        return res.status(201).json({ 
            message: 'Item created successfully', 
            item: newItem 
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllItems = async (req, res) => {
    try {
        const items = await itemService.getAllUserItems(req.user.id);
        return res.status(200).json({ items });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getItemById = async (req, res) => {
    try {
        const item = await itemService.findItemForUser(req.params.id, req.user.id);
        return res.status(200).json({ item });
    } catch (error) {
        const status = error.message === 'Item not found' ? 404 : 500;
        return res.status(status).json({ message: error.message });
    }
};

export const updateItem = async (req, res) => {
    try {
        await itemService.updateItem(req.params.id, req.user.id, req.body);
        return res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteItem = async (req, res) => {
    try {
        await itemService.deleteItem(req.params.id, req.user.id);
        return res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};