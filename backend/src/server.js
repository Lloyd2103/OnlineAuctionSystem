import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { createServer } from 'http'; // Thêm mới
import cron from 'node-cron'; // Thêm mới

import sequelize, { connectToDatabase } from './libs/db.js';
import { initSocket } from './libs/socket.js';
import cors from 'cors';

import './models/index.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import itemRoute from './routes/itemRoute.js';
import auctionRoute from './routes/auctionRoute.js'; // Thêm route auction


import { protectedRoute } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();
const httpServer = createServer(app); // Tạo HTTP Server từ Express App
const IP = process.env.IP || 'localhost';
const PORT = process.env.PORT || 3000;

// 1. Khởi tạo Socket.io
initSocket(httpServer);

// Middlewares
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// Public routes
app.use('/api/auth', authRoute);
app.use('/api/auctions', auctionRoute);
// Private routes
app.use(protectedRoute);
app.use('/api/users', userRoute);
app.use('/api/items', itemRoute);



// // 2. Thiết lập Cron Job (Chạy mỗi phút 1 lần)
// cron.schedule('* * * * *', async () => {
//     console.log('--- Kiểm tra trạng thái đấu giá ---');
//     try {
//         await auctionService.activatePendingAuctions();
//         await auctionService.closeExpiredAuctions();
//     } catch (error) {
//         console.error('Lỗi Cron Job:', error);
//     }
// });

// 3. Kết nối DB và chạy Server
connectToDatabase().then(async () => {
    try {
        // alter: true sẽ cập nhật cấu trúc bảng mà không xóa dữ liệu cũ
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully');

        // Quan trọng: Phải dùng httpServer.listen thay vì app.listen
        httpServer.listen(PORT, () => {
            console.log(`Server is running on http://${IP}:${PORT}`);
        });
    } catch (error) {
        console.error('Lỗi đồng bộ database:', error);
    }
});