import auctionService from '../services/auctionService.js';

export const createAuction = async (req, res) => {
    try {
        const newAuction = await auctionService.createAuction(req.user.id, req.body);
        return res.status(201).json({ message: 'Auction created successfully', auction: newAuction });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const getUserAuctions = async (req, res) => {
    try {
        const auctions = await auctionService.getAuctionsByUser(req.user.id);
        return res.status(200).json({ auctions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllAuctions = async (req, res) => {
    try {
        const auctions = await auctionService.getAllAuctions();
        return res.status(200).json({ auctions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateAuction = async (req, res) => {
    try {
        const auction = await auctionService.updateAuction(req.params.id, req.user.id, req.body);
        return res.status(200).json({ message: 'Auction updated successfully', auction });
    } catch (error) {
        const status = error.message.includes('Forbidden') ? 403 : 400;
        return res.status(status).json({ message: error.message });
    }
};

export const deleteAuction = async (req, res) => {
    try {
        await auctionService.deleteAuction(req.params.id, req.user.id);
        return res.status(200).json({ message: 'Auction deleted successfully' });
    }