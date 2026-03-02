import Bid from '../models/Bid.js';
import Auction from '../models/Auction.js';
import User from '../models/User.js';
import sequelize from '../libs/db.js';

class BidService {
    // Đặt giá thầu với đầy đủ validation
    async placeBid(userId, { auctionId, bidAmount }) {
        const t = await sequelize.transaction();

        try {
            // 1. Kiểm tra phiên đấu giá tồn tại và đang diễn ra
            const auction = await Auction.findByPk(auctionId, { transaction: t });
            if (!auction) throw new Error('Auction not found');
            
            const now = new Date();
            if (now < auction.startTime || now > auction.endTime) {
                throw new Error('Phiên đấu giá hiện không diễn ra');
            }

            // 2. Kiểm tra số dư ví người dùng
            const user = await User.findByPk(userId, { transaction: t });
            if (user.walletBalance < bidAmount) {
                throw new Error('Số dư ví không đủ để đặt giá');
            }

            // 3. Kiểm tra giá thầu cao nhất hiện tại
            const highestBid = await Bid.findOne({
                where: { auctionId },
                order: [['bidAmount', 'DESC']],
                transaction: t
            });

            const minBidRequired = highestBid 
                ? parseFloat(highestBid.bidAmount) 
                : parseFloat(auction.startingPrice);

            if (parseFloat(bidAmount) <= minBidRequired) {
                throw new Error(`Giá thầu phải cao hơn giá hiện tại (${minBidRequired})`);
            }

            // 4. Tạo giá thầu mới
            const newBid = await Bid.create({
                auctionId,
                userId,
                bidAmount
            }, { transaction: t });

            // Lưu ý: Tùy logic dự án, bạn có thể trừ tiền hoặc tạm giữ tiền ở đây
            // user.walletBalance -= bidAmount; 
            // await user.save({ transaction: t });

            await t.commit();
            return newBid;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    // Lấy thông tin thống kê
    async getAuctionStats(auctionId) {
        const bids = await Bid.findAll({
            where: { auctionId },
            order: [['bidAmount', 'DESC']]
        });

        const count = bids.length;
        const highest = bids[0] || null;
        const average = count > 0 
            ? bids.reduce((acc, b) => acc + parseFloat(b.bidAmount), 0) / count 
            : 0;

        return { bids, count, highest, average };
    }

    async getUserHistory(userId) {
        return await Bid.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
    }
}

export default new BidService();