import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectedRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        // 1. Xác thực token (Sử dụng trực tiếp để bắt lỗi trong catch)
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
        // 2. Tìm user bằng Primary Key (Sequelize style)
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
        // Kiểm tra nếu là lỗi từ JWT
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token đã hết hạn' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token không hợp lệ' });
        }
        
        // Các lỗi hệ thống khác (như mất kết nối Database) mới dùng 500
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};