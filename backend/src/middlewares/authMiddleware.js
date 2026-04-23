import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectedRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        // 1. Xác thực token
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
        // 2. Tìm user
        const user = await User.findByPk(decodedUser.userId, { 
            attributes: { exclude: ['hashedPassword'] } 
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // 3. Gán thông tin vào request
        req.user = user; 
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.identifiedStatus === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
};

