import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Trong thực tế hãy thay bằng domain frontend của bạn
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // User join vào room riêng của từng phiên đấu giá
        socket.on('join_auction', (auctionId) => {
            socket.join(`auction_${auctionId}`);
            console.log(`User ${socket.id} joined auction room: ${auctionId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io chưa được khởi tạo!');
    }
    return io;
};