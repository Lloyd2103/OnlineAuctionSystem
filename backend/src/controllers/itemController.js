import itemManager from '../managers/itemManager.js';

export const createItem = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.files && req.files.length > 0) {
            updateData.itemImage = req.files.map(file => file.path);
        } else if (req.file) {
            updateData.itemImage = [req.file.path];
        } else {
            delete updateData.itemImage;
        }
        const newItem = await itemManager.createItem(req.user.id, updateData);
        return res.status(201).json({ message: 'Item created successfully', item: newItem });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateItem = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.files && req.files.length > 0) {
            updateData.itemImage = req.files.map(file => file.path);
        } else if (req.file) {
            updateData.itemImage = req.file.path;
        } else {    
            delete updateData.itemImage;
        }
        await itemManager.updateItem(req.params.id, req.user.id, updateData);
        return res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteItem = async (req, res) => {
    try {
        await itemManager.deleteItem(req.params.id, req.user.id);
        return res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllItems = async (req, res) => {
    try {
        const items = await itemManager.getAllUserItems(req.user.id);
        return res.status(200).json({ items });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getItemById = async (req, res) => {
    try {
        const item = await itemManager.findItemForUser(req.params.id, req.user.id);
        return res.status(200).json({ item });
    } catch (error) {
        const status = error.message === 'Item not found' ? 404 : 500;
        return res.status(status).json({ message: error.message });
    }
};

export const updateItemStatus = async (req, res) => {
    try {
        const { status } = req.body;
        await itemManager.updateItemStatus(req.params.id, status);
        return res.status(200).json({ message: 'Item status updated successfully' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
