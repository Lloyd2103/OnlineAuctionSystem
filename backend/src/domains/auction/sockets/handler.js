import bidManager from '../../../managers/bidManager.js'; 

export const registerAuctionHandlers = (io, socket) => {
    socket.on('join_auction', (auctionId) => {
        const roomName = `Auction: ${auctionId}`;
        socket.join(roomName);
        console.log(`User ${socket.user.userId} joined room: ${roomName}`);
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

            // B. Broadcast cập nhật giá MỚI cho TẤT CẢ mọi người trong phòng
            io.to(`Auction: ${auctionId}`).emit('new_bid', { 
                highestBid: result.currentPrice, 
                bidderName: result.bidderName,
                auctionId: auctionId
            });

            // C. Bắn thông báo bị Outbid cho người giữ giá cao nhất trước đó (nếu có và không phải chính họ)
            if (result.previousHighestBidderId && result.previousHighestBidderId !== userId) {
                io.to(`user_${result.previousHighestBidderId}`).emit('new_notification', {
                    type: 'OUTBID',
                    title: 'Outbid Alert',
                    message: `You have been outbid on auction ${auctionId}. New highest bid is $${result.currentPrice}.`,
                    timestamp: new Date()
                });
            }

        } catch (error) {
            console.error(`Bid Error [User ${userId}]:`, error.message);
            // Gửi lỗi riêng cho người đặt
            socket.emit('bid_error', { message: error.message });
        }
    });

    socket.on('leave_auction', (auctionId) => {
        const roomName = `Auction:${auctionId}`;
        socket.leave(roomName);
        console.log(`User ${socket.user.userId} left room: ${roomName}`);
    });
};