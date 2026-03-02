import bidService from '../services/bidService.js';

export const createBid = async (req, res) => {
    try {
        const bid = await bidService.placeBid(req.user.id, req.body);
        return res.status(201).json({ 
            message: 'Đặt giá thầu thành công', 
            bid 
        });
    } catch (error) {
        // Phân loại lỗi để trả về status code phù hợp
        const badRequestErrors = [
            'Auction not found', 
            'Số dư ví không đủ', 
            'Giá thầu phải cao hơn',
            'Phiên đấu giá hiện không diễn ra'
        ];
        const status = badRequestErrors.some(msg => error.message.includes(msg)) ? 400 : 500;
        return res.status(status).json({ message: error.message });
    }
};

export const getBidsByAuctionId = async (req, res) => {
    try {
        const stats = await bidService.getAuctionStats(req.params.auctionId);
        return res.status(200).json(stats);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getUserBidHistory = async (req, res) => {
    try {
        const history = await bidService.getUserHistory(req.user.id);
        return res.status(200).json({ bidHistory: history });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};