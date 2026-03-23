import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import userRepository from '../repositories/UserRepository.js';
import sessionRepository from '../repositories/SessionRepository.js';
import cookieParser from 'cookie-parser';


const ACCESS_TOKEN_TTL = '20m';
const REFRESH_TOKEN_TTL = 14*24*60*60*1000 ; 

class AuthService {
    async signUp(data) {
        try {
            const { userName, userEmail, userPhone, userAddress, password } = data;
            if (!userName || !userEmail || !userPhone || !userAddress || !password) {
                const err = new Error('All fields are required');
                err.status = 400;
                throw err;
            }
            const existingUser = await userRepository.findByEmail(userEmail);
            if (existingUser) {
                const err = new Error('Email already in use');
                err.status = 400;
                throw err;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await userRepository.create({
                userName,
                userEmail,
                userPhone,
                userAddress,
                hashedPassword
            });
            return { message: 'User registered successfully' };
        } catch (error) {
            console.error('Error during sign up:', error);
            if (!error.status) error.status = 500;
            throw error;
        }
    }

    async signIn(data) {
        try {
            const { userEmail, password } = data;
            if (!userEmail || !password) {
                // Throw an error to be handled by controller
                const err = new Error('Email and password are required');
                err.status = 400;
                throw err;
            }
            const user = await userRepository.findByEmail(userEmail);
            if (!user) {
                const err = new Error('Invalid email or password');
                err.status = 401;
                throw err;
            }
            const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
            if (!isPasswordValid) {
                const err = new Error('Invalid email or password');
                err.status = 401;
                throw err;
            }
            if (user.userStatus === 'banned') {
                const err = new Error('Your account has been banned. Please contact support.');
                err.status = 403;
                throw err;
            }
            const accessToken = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: ACCESS_TOKEN_TTL });
            const refreshToken = crypto.randomBytes(64).toString('hex');
            await sessionRepository.create({
                userId: user.id,
                refreshToken,
                expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
            });
            // Return tokens; controller will set cookie and response
            return { accessToken, refreshToken };
        } catch (error) {
            console.error('Error during sign in:', error);
            // Preserve original status if set, otherwise default to 500
            if (!error.status) error.status = 500;
            throw error;
        }
    }

    async signOut(refreshToken) {
        try {
            if (refreshToken) {
                await sessionRepository.deleteByRefreshToken(refreshToken);
            }
            // No response handling here; controller will clear cookie and send response
            return { message: 'Sign out successful' };
        } catch (error) {
            console.error('Error during sign out:', error);
            const err = new Error('Internal server error');
            err.status = 500;
            throw err;
        }
    }

    async refreshToken(req) { // Chỉ nhận vào token chuỗi
        try {

            const token = req.cookies.refreshToken;
            if (!token) {
                const err = new Error('No refresh token provided');
                err.status = 401;
                throw err;
            }

            const session = await sessionRepository.findByRefreshToken(token);
            
            if (!session) {
                const err = new Error('Invalid token or expired');
                err.status = 403;
                throw err;
            }

            if (session.expiresAt < new Date()) {
                await sessionRepository.deleteById(session.id);
                const err = new Error('Token expired');
                err.status = 403;
                throw err;
            }

            const accessToken = jwt.sign(
                { userId: session.userId }, 
                process.env.SECRET_KEY, 
                { expiresIn: ACCESS_TOKEN_TTL }
            );

            return { accessToken }; // Trả về object chứa token
        } catch (error) {
            console.error('Error during token refresh:', error);
            if (!error.status) error.status = 500;
            throw error;
        }
    }
}

export default new AuthService();


