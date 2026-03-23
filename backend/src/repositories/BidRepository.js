import Bid from '../models/Bid.js';

class BidRepository {
  async create(data, options = {}) {
    return await Bid.create(data, options);
  }

  async findHighestByAuctionId(auctionId, options = {}) {
    return await Bid.findOne({
      where: { auctionId },
      order: [['bidAmount', 'DESC']],
      ...options,
    });
  }

  async findAllByAuctionId(auctionId, options = {}) {
    return await Bid.findAll({
      where: { auctionId },
      order: [['bidAmount', 'DESC']],
      ...options,
    });
  }

  async findAllByBidderId(bidderId, options = {}) {
    // Align with Bid model field name (bidderId)
    return await Bid.findAll({
      where: { bidderId },
      order: [['createdAt', 'DESC']],
      ...options,
    });
  }
}

export default new BidRepository();

