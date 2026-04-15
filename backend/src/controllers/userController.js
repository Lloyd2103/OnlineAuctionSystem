import userManager from '../managers/userManager.js';

export const getUserProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userManager.getUserProfile(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.file) {
            updateData.userImage = req.file.path;
        } else {
            delete updateData.userImage;
        }

        await userManager.updateUserProfile(req.user, updateData);

        return res.status(200).json({ message: 'User profile updated successfully'});
    } catch (error) {
        console.error("Lỗi Controller:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

export const submitUserRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        
        const updatedUser = await userManager.submitUserRating(id, rating);
        
        return res.status(200).json({ 
            message: 'Rating submitted successfully', 
            rating: updatedUser.rating 
        });
    } catch (error) {
        const status = error.message === 'User not found' ? 404 : 500;
        return res.status(status).json({ message: error.message });
    }
};