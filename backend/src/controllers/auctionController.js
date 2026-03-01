import Auction from '../models/Auction.js';

export const createAuction = async (req, res) => {
    try {
        const { itemId, startingPrice, startTime, endTime } = req.body;
        if (!itemId || !startingPrice || !startTime || !endTime) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newAuction = await Auction.create({
            itemId,
            startingPrice,
            startTime,
            endTime
        });
        return res.status(201).json({ auction: newAuction });
    } catch (error) {
        console.error('Error in createAuction:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getAllAuctions = async (req, res) => {
    try {
        const auctions = await Auction.findAll();
        return res.status(200).json({ auctions });
    } catch (error) {
        console.error('Error in getAllAuctions:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getAuctionById = async (req, res) => {
    try {
        const { id } = req.params;
        const auction = await Auction.findByPk(id);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        return res.status(200).json({ auction });
    } catch (error) {
        console.error('Error in getAuctionById:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateAuction = async (req, res) => {
    try {
        const { id } = req.params;
        const { itemId, startingPrice, startTime, endTime } = req.body;
        const auction = await Auction.findByPk(id);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        if (itemId) auction.itemId = itemId;
        if (startingPrice) auction.startingPrice = startingPrice;
        if (startTime) auction.startTime = startTime;
        if (endTime) auction.endTime = endTime;
        await auction.save();
        return res.status(200).json({ auction });
    } catch (error) {
        console.error('Error in updateAuction:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteAuction = async (req, res) => {
    try {
        const { id } = req.params;
        const auction = await Auction.findByPk(id);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        await auction.destroy();
        return res.status(200).json({ message: 'Auction deleted successfully' });
    } catch (error) {
        console.error('Error in deleteAuction:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

