import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Session from '../models/Session.js';


const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = 14*24*60*60*1000 ; 
export const signUp = async (req, res) => {
    try {
        const { userName, userEmail, userPhone, userAddress, password } = req.body;
        if (!userName || !userEmail || !userPhone || !userAddress || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = await User.findOne({ where: { userEmail } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            userName,
            userEmail,
            userPhone,
            userAddress,
            hashedPassword
        });
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during sign up:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const signIn = async (req, res) => {
    try {
        const { userEmail, password } = req.body;
        if (!userEmail || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ where: { userEmail } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (user.userStatus === 'banned') {
            return res.status(403).json({ message: 'Your account has been banned. Please contact support.' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: ACCESS_TOKEN_TTL });
        const refreshToken = crypto.randomBytes(64).toString('hex');
        await Session.create({
            userId: user.id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, // Chỉ gửi cookie qua HTTPS
            sameSite: 'none', // Ngăn chặn CSRF
            maxAge: REFRESH_TOKEN_TTL
        });
        return res.status(200).json({ message: 'Sign in successful', token });
    
    } catch (error) {
        console.error('Error during sign up:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const signOut = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            await Session.destroy({ where: { refreshToken } });
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });
        }
        return res.status(200).json({ message: 'Sign out successful' });
    } catch (error) {
        console.error('Error during sign out:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not provided' });
        }
        const session = await Session.findOne({ where: { refreshToken } });
        if (!session || session.expiresAt < new Date()) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }
        const user = await User.findByPk(session.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const newAccessToken = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: ACCESS_TOKEN_TTL });
        return res.status(200).json({ token: newAccessToken });
    } catch (error) {
        console.error('Error during token refresh:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

