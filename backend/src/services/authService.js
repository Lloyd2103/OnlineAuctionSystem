import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sessionRepository from '../repositories/SessionRepository.js';
class AuthService {
    constructor() {
        this.ACCESS_TOKEN_TTL = '20m';
        this.REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;
    }

    hashPassword(password) {
        return bcrypt.hash(password, 10);
    }

    comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

    generateAccessToken(userId) {
        return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: this.ACCESS_TOKEN_TTL });
    }

    generateRefreshToken() {
        return crypto.randomBytes(64).toString('hex');
    }

    async createSession(userId, refreshToken) {
        return await sessionRepository.create({ userId, refreshToken, expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_TTL) });
    }

    async deleteSession(refreshToken) {
        return await sessionRepository.deleteByRefreshToken(refreshToken);
    }

    async verifyRefreshToken(token) {
        const session = await sessionRepository.findByRefreshToken(token);
        if (!session || session.expiresAt < new Date()) {
            if (session) await sessionRepository.deleteById(session.id);
            const err = new Error('Invalid or expired token');
            err.status = 403;
            throw err;
        }
        return session;
    }
}

export default new AuthService();
