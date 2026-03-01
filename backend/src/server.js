import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

import sequelize, { connectToDatabase } from './libs/db.js';

import User from './models/User.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';

import { protectedRoute } from './middlewares/authMiddleware.js';


dotenv.config();

const app = express();
const IP = process.env.IP;
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser()); 


// Public routes
app.use('/api/auth', authRoute);

// Private routes
app.use(protectedRoute);
app.use('/api/user', userRoute);


connectToDatabase().then(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on http://${IP}:${PORT}`);
        });
    } catch (error) {
        console.error('Lỗi đồng bộ database:', error);
    }
});