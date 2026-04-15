import { Server } from 'socket.io';
import { socketAuthMiddleware } from '../middlewares/socketMiddleware.js';
import { registerAuctionHandlers } from '../domains/auction/sockets/handler.js';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.use(socketAuthMiddleware);

    io.on('connection', (socket) => {
        console.log(`User: ${socket.user.userId} authenticated and connected`);

        socket.join(`User: ${socket.user.userId}`);
        registerAuctionHandlers(io, socket);

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};