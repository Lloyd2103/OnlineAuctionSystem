import authManager from '../managers/authManager.js';

export const signUp = async (req, res) => {
    try {
        await authManager.signUp(req.body); 
        return res.status(201).json({ message: 'User registered successfully'});
    } catch (error) {
        console.error('Error during sign up:', error);
        return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
};

export const signIn = async (req, res) => {
    try {
        const { accessToken, refreshToken } = await authManager.signIn(req.body);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 14 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ message: 'Sign in successful', accessToken });
    } catch (error) {
        console.error('Error during sign in:', error);
        return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
};

export const signOut = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        await authManager.signOut(refreshToken);
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
        const refreshToken = req.cookies?.refreshToken;
        const { accessToken } = await authManager.refreshToken(refreshToken);
        return res.status(200).json({ accessToken });
    } catch (error) {
        // console.error('Error during token refresh:', error);
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
};