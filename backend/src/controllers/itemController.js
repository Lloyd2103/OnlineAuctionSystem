import itemManager from '../managers/itemManager.js';
import { getPagination, getPagingData } from '../utils/paginationHelper.js';

export const createItem = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.files && req.files.length > 0) {
            updateData.itemImage = req.files[0].path;
        } else if (req.file) {
            updateData.itemImage = req.file.path;
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
            updateData.itemImage = req.files[0].path;
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
        const { page, limit } = req.query;
        const { limit: l, offset } = getPagination(page, limit);
        const result = await itemManager.getAllUserItems(req.user.id, { limit: l, offset });
        const response = getPagingData(result, page, l);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllItemsAdmin = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const { limit: l, offset } = getPagination(page, limit);
        const result = await itemManager.getAllItems({ limit: l, offset });
        const response = getPagingData(result, page, l);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getItemById = async (req, res) => {
    try {
        const item = await itemManager.getItemById(req.params.id);
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
