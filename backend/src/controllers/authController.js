import authService from '../services/authService.js';

export const signUp = async (req, res) => {
    try {
        // Service chỉ thực hiện logic, không nhận 'res'
        const result = await authService.signUp(req.body); 
        return res.status(201).json({ message: 'User registered successfully', data: result });
    } catch (error) {
        console.error('Error during sign up:', error);
        return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
};

export const signIn = async (req, res) => {
    try {
        // Get tokens from service
        const { accessToken, refreshToken } = await authService.signIn(req.body);
        // Set refresh token cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
        });
        // Send response
        return res.status(200).json({
            message: 'Sign in successful',
            accessToken
        });
    } catch (error) {
        console.error('Error during sign in:', error);
        return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
};

export const signOut = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        await authService.signOut(refreshToken);
        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        return res.status(200).json({ message: 'Sign out successful' });
    } catch (error) {
        console.error('Error during sign out:', error);
        return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { accessToken } = await authService.refreshToken(req);
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Error during token refresh:', error);
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
};