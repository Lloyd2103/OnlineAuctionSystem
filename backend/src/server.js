import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import cors from 'cors';
import compression from 'compression';

import sequelize, { connectToDatabase } from './libs/db.js';
import { initSocket } from './libs/socket.js';

import './models/index.js';
import './domains/auction/events/AuctionEventEmitter.js';
import { initSystemJobs } from './domains/auction/jobs/cron.js';

import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import itemRoute from './routes/itemRoute.js';
import auctionRoute from './routes/auctionRoute.js';
import transactionRoute from './routes/transactionRoute.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const IP = process.env.IP;
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

initSocket(httpServer);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        CLIENT_URL
    ],
    credentials: true
}));

app.use(compression());

// Performance Logger Middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        if (duration > 500) {
            console.warn(`[Slow Request] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
        } else {
            console.log(`[Perf] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
        }
    });
    next();
});


// Public routes
app.use('/api/auth', authRoute);
app.use('/api/auctions', auctionRoute);
// Private routes
app.use('/api/users', userRoute);
app.use('/api/items', itemRoute);
app.use('/api/transactions', transactionRoute);


connectToDatabase().then(async () => {
    try {
        // Đồng bộ schema với database
        // await sequelize.sync({ alter: true });
        // console.log('Database synchronized successfully');

        httpServer.listen(PORT, IP, async () => {
            console.log(`Server is running on http://${IP}:${PORT}`);
            await initSystemJobs();
        });
    } catch (error) {
        console.error('Database synchronization error:', error);
    }
});