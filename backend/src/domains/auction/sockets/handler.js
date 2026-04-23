import bidManager from '../../../managers/bidManager.js'; 

export const registerAuctionHandlers = (io, socket) => {
    socket.on('join_auction', (auctionId) => {
        const roomName = `auction_${auctionId}`;
        socket.join(roomName);
        console.log(`User ${socket.user.userId} joined auction room: ${roomName}`);
    });

    socket.on('place_bid', async (data) => {
        const { auctionId, bidAmount } = data;
        const userId = socket.user.userId;

        try {
            // Gọi Manager xử lý nghiệp vụ
            const result = await bidManager.placeBid(userId, { auctionId, bidAmount });
            
            // A. Gửi phản hồi thành công RIÊNG cho người đặt
            socket.emit('bid_success', { 
                message: 'You have placed a bid successfully!', 
                bid: result.bid 
            });

            // B. Broadcast cập nhật giá MỚI cho TẤT CẢ mọi người trong phòng đấu giá
            io.to(`auction_${auctionId}`).emit('new_bid', { 
                highestBid: result.currentPrice, 
                bidderName: result.bidderName,
                auctionId: auctionId
            });

        } catch (error) {
            console.error(`Bid Error [User ${userId}]:`, error.message);
            // Gửi lỗi riêng cho người đặt
            socket.emit('bid_error', { message: error.message });
        }
    });

    socket.on('leave_auction', (auctionId) => {
        const roomName = `auction_${auctionId}`;
        socket.leave(roomName);
        console.log(`User ${socket.user.userId} left auction room: ${roomName}`);
    });
};