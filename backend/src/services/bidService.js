import bidRepository from '../repositories/BidRepository.js';

class BidService {
    // Nghiệp vụ: Validate logic một bước giá
    validateBidAmount(newBidAmount, highestBidAmount, minIncrement) {
        const requiredAmount = highestBidAmount + minIncrement;
        if (newBidAmount < requiredAmount) {
            throw new Error(`Giá thầu phải cao hơn giá hiện tại ít nhất ${minIncrement}`);
        }
    }

    // Nghiệp vụ: Đảm bảo số dư của user
    validateUserBalance(userBalance, requiredDeposit) {
        if (userBalance < requiredDeposit) {
            throw new Error('Số dư không đủ để thực hiện đặt cọc/đặt giá');
        }
    }

    async create(data, options = {}) {
        return await bidRepository.create(data, options);
    }

    async getHighestBid(auctionId, options = {}) {
        return await bidRepository.findOne({ auctionId }, [['bidAmount', 'DESC']], options);
    }

    async getStats(auctionId) {
        const bids = await bidRepository.findAll({ auctionId }, [['bidAmount', 'DESC']]);
        const count = bids.length;
        const highest = bids[0] || null;
        const average = count > 0 
            ? bids.reduce((acc, b) => acc + parseFloat(b.bidAmount), 0) / count 
            : 0;
        return { bids, count, highest, average };
    }

    async getUserHistory(userId) {
        return await bidRepository.findAll({ bidderId: userId }, [['createdAt', 'DESC']]);
    }
}

export default new BidService();
