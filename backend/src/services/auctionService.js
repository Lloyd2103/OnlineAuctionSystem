import Auction from '../models/Auction.js';

class AuctionService {
    async createAuction(userId, auctionData) {
        if (new Date(auctionData.startTime) >= new Date(auctionData.endTime)) {
            throw new Error('Thời gian bắt đầu phải trước thời gian kết thúc');
        }
        const {itemId, startTime, endTime, startingPrice, incrementPrice, instantBuyPrice, mandatoryDeposit} = auctionData;
        return await Auction.create({
            ownerId: userId,
            itemId,
            startTime,
            endTime,
            startingPrice,
            incrementPrice,
            instantBuyPrice,
            mandatoryDeposit
        });
    }

    async getAllAuctions() {
        return await Auction.findAll();
    }

    async getAuctionsByUser(userId) {
        return await Auction.findAll({ where: { userId } });
    }

    async findAuctionAndVerifyOwner(id, userId) {
        const auction = await Auction.findByPk(id);
        if (!auction) throw new Error('Auction not found');
        if (userId && auction.userId !== userId) {
            throw new Error('Forbidden: Bạn không có quyền thực hiện thao tác này');
        }
        return auction;
    }

    async updateAuction(id, userId, updateData) {
        const auction = await this.findAuctionAndVerifyOwner(id, userId);

        if (new Date() > new Date(auction.startTime)) {
            throw new Error('Không thể chỉnh sửa phiên đấu giá đã hoặc đang diễn ra');
        }
        const { startTime, endTime, startingPrice, incrementPrice, instantBuyPrice, mandatoryDeposit } = updateData;

        if (startTime) auction.startTime = startTime;
        if (endTime) auction.endTime = endTime;
        if (startingPrice) auction.startingPrice = startingPrice;
        if (incrementPrice) auction.incrementPrice = incrementPrice;
        if (instantBuyPrice) auction.instantBuyPrice = instantBuyPrice;
        if (mandatoryDeposit) auction.mandatoryDeposit = mandatoryDeposit;
        return await auction.save();
    }

    async deleteAuction(id, userId) {
        const auction = await this.findAuctionAndVerifyOwner(id, userId);
        const bidCount = await auction.countBids();
        if (bidCount > 0) throw new Error('Không thể xóa phiên đã có người đặt giá');
        return await auction.destroy();
    }

    async activatePendingAuctions() {
        const now = new Date();
        return await Auction.update(
            { status: 'ACTIVE' },
            { 
                where: { 
                    status: 'PENDING',
                    startTime: { [Op.lte]: now } // startTime <= hiện tại
                } 
            }
        );
    }

    // 2. Luồng kết thúc phiên (ACTIVE -> ENDED)
    async closeExpiredAuctions() {
        const now = new Date();
        return await Auction.update(
            { status: 'ENDED' },
            { 
                where: { 
                    status: 'ACTIVE',
                    endTime: { [Op.lte]: now } // endTime <= hiện tại
                } 
            }
        );
    }
}



export default new AuctionService();