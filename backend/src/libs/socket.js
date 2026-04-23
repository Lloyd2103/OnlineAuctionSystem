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
        const userId = socket.user.userId;
        console.log(`Socket connection: User ${userId} authenticated`);

        registerAuctionHandlers(io, socket);

        socket.on('disconnect', () => {
            console.log(`Socket disconnection: User ${userId}`);
        });
    });

    return io;
};