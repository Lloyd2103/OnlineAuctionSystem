import Bid from '../models/Bid.js';

export const createBid = async (req, res) => {
    try {
        const { auctionId, bidAmount } = req.body;
        if (!auctionId || !bidAmount) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newBid = await Bid.create({
            auctionId,
            userId: req.user.id,
            bidAmount
        });
        return res.status(201).json({ bid: newBid });
    } catch (error) {
        console.error('Error in createBid:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getBidsByAuctionId = async (req, res) => {
    try {
        const { auctionId } = req.params;
        const bids = await Bid.findAll({ where: { auctionId } });
        return res.status(200).json({ bids });
    } catch (error) {
        console.error('Error in getBidsByAuctionId:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getBidById = async (req, res) => {
    try {
        const { id } = req.params;
        const bid = await Bid.findByPk(id);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }
        return res.status(200).json({ bid });
    } catch (error) {
        console.error('Error in getBidById:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateBid = async (req, res) => {
    try {
        const { id } = req.params;
        const { bidAmount } = req.body;
        const bid = await Bid.findByPk(id);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }
        if (bid.userId !== req.user.id) {
            return res.status(403).json({ message: 'You can only update your own bids' });
        }
        if (bidAmount) bid.bidAmount = bidAmount;
        await bid.save();
        return res.status(200).json({ bid });
    } catch (error) {
        console.error('Error in updateBid:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteBid = async (req, res) => {
    try {
        const { id } = req.params;
        const bid = await Bid.findByPk(id);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }
        if (bid.userId !== req.user.id) {
            return res.status(403).json({ message: 'You can only delete your own bids' });
        }
        await bid.destroy();
        return res.status(200).json({ message: 'Bid deleted successfully' });
    } catch (error) {
        console.error('Error in deleteBid:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getBidsByUserId = async (req, res) => {
    try {
        const userId = req.user.id; 
        const bids = await Bid.findAll({ where: { userId } });
        return res.status(200).json({ bids });
    } catch (error) {
        console.error('Error in getBidsByUserId:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getBidsByAuctionIdSorted = async (req, res) => {
    try {
        const { auctionId } = req.params;
        const bids = await Bid.findAll({ 
            where: { auctionId },
            order: [['bidAmount', 'DESC']]
        });
        return res.status(200).json({ bids });
    } catch (error) {
        console.error('Error in getBidsByAuctionIdSorted:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getHighestBidByAuctionId = async (req, res) => {
    try {
        const { auctionId } = req.params;
        const highestBid = await Bid.findOne({
            where: { auctionId },
            order: [['bidAmount', 'DESC']]
        });
        if (!highestBid) {
            return res.status(404).json({ message: 'No bids found for this auction' });
        }
        return res.status(200).json({ highestBid });
    } catch (error) {
        console.error('Error in getHighestBidByAuctionId:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getLowestBidByAuctionId = async (req, res) => {
    try {
        const { auctionId } = req.params;
        const lowestBid = await Bid.findOne({
            where: { auctionId },
            order: [['bidAmount', 'ASC']]
        });
        if (!lowestBid) {
            return res.status(404).json({ message: 'No bids found for this auction' });
        }
        return res.status(200).json({ lowestBid });
    } catch (error) {
        console.error('Error in getLowestBidByAuctionId:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getAverageBidByAuctionId = async (req, res) => {
    try {
        const { auctionId } = req.params;
        const averageBid = await Bid.findAll({
            where: { auctionId },
            attributes: [[Bid.sequelize.fn('AVG', Bid.sequelize.col('bidAmount')), 'averageBid']]
        });
        return res.status(200).json({ averageBid: averageBid[0].get('averageBid') });
    } catch (error) {
        console.error('Error in getAverageBidByAuctionId:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getBidCountByAuctionId = async (req, res) => {
    try {
        const { auctionId } = req.params;
        const bidCount = await Bid.count({ where: { auctionId } });
        return res.status(200).json({ bidCount });
    } catch (error) {
        console.error('Error in getBidCountByAuctionId:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getUserBidHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const bidHistory = await Bid.findAll({ where: { userId } });
        return res.status(200).json({ bidHistory });
    } catch (error) {
        console.error('Error in getUserBidHistory:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const createBidWithValidation = async (req, res) => {
    try {
        const { auctionId, bidAmount } = req.body;
        if (!auctionId || !bidAmount) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const highestBid = await Bid.findOne({ 
            where: { auctionId },
            order: [['bidAmount', 'DESC']]
        });
        if (highestBid && parseFloat(bidAmount) <= parseFloat(highestBid.bidAmount)) {
            return res.status(400).json({ message: 'Bid amount must be higher than the current highest bid' });
        }
        const newBid = await Bid.create({
            auctionId,
            userId: req.user.id,
            bidAmount
        });
        return res.status(201).json({ bid: newBid });
    }
    catch (error) {
        console.error('Error in createBidWithValidation:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
