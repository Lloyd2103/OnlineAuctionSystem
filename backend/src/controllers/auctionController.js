import auctionManager from '../managers/auctionManager.js';

export const createAuction = async (req, res) => {
    try {
        const newAuction = await auctionManager.createAuction(req.user.id, req.body);
        return res.status(201).json({ message: 'Auction created successfully', auction: newAuction });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const getAuctionById = async (req, res) => {
    try {
        const auction = await auctionManager.getAuctionById(req.params.id);
        return res.status(200).json({ auction });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

export const getAuctionsByOwnerId = async (req, res) => {
    try {
        const auctions = await auctionManager.getAuctionsByOwnerId(req.params.ownerId);
        return res.status(200).json({ auctions });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

export const getAllAuctions = async (req, res) => {
    try {
        const auctions = await auctionManager.getAllAuctions();
        return res.status(200).json({ auctions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateAuction = async (req, res) => {
    try {
        const auction = await auctionManager.updateAuction(req.params.id, req.user.id, req.body);
        return res.status(200).json({ message: 'Auction updated successfully', auction });
    } catch (error) {
        const status = error.message.includes('Forbidden') ? 403 : 400;
        return res.status(status).json({ message: error.message });
    }
};

export const deleteAuction = async (req, res) => {
    try {
        await auctionManager.deleteAuction(req.params.id, req.user.id);
        return res.status(200).json({ message: 'Auction deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getDepositStatus = async (req, res) => {
    try {
        const status = await auctionManager.getDepositStatus(req.user.id, req.params.id);
        return res.status(200).json({ status });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const buyNow = async (req, res) => {
    try {
        const auction = await auctionManager.buyNow(req.params.id, req.user.id);
        return res.status(200).json({ message: 'Buy successfully', auction });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};