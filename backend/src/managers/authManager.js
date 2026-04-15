import authService from '../services/authService.js';
import userService from '../services/userService.js';

class AuthManager {
    async signUp(data) {
        const { userName, userEmail, userPhone, userAddress, password } = data;
        if (!userName || !userEmail || !password) {
            const err = new Error('Missing required fields');
            err.status = 400;
            throw err;
        }
        const existingUser = await userService.findByEmail(userEmail);
        if (existingUser) {
            const err = new Error('Email already in use');
            err.status = 400;
            throw err;
        }
        const hashedPassword = await authService.hashPassword(password);
        await userService.createUser({
            userName, userEmail, userPhone, userAddress, hashedPassword
        });
        
        return { message: 'User registered successfully' };
    }

    async signIn(data) {
        const { userEmail, password } = data;
        const user = await userService.findByEmail(userEmail);
        if (!user) {
            const err = new Error('Invalid email or password');
            err.status = 401;
            throw err;
        }
        const isPasswordValid = await authService.comparePassword(password, user.hashedPassword);
        if (!isPasswordValid) {
            const err = new Error('Invalid email or password');
            err.status = 401;
            throw err;
        }
        if (user.userStatus === 'banned') {
            const err = new Error('Account banned');
            err.status = 403;
            throw err;
        }
        const accessToken = authService.generateAccessToken(user.id);
        const refreshToken = authService.generateRefreshToken();
        await authService.createSession(user.id, refreshToken);
        return { accessToken, refreshToken };
    }

    async signOut(refreshToken) {
        if (refreshToken) {
            await authService.deleteSession(refreshToken);
        }
        return { message: 'Sign out successful' };
    }

    async refreshToken(token) {
        if (!token) {
            const err = new Error('No refresh token provided');
            err.status = 401;
            throw err;
        }
        const session = await authService.verifyRefreshToken(token);
        const accessToken = authService.generateAccessToken(session.userId);
        return { accessToken };
    }
}

export default new AuthManager();
