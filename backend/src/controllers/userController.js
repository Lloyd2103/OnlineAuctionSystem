export const getUserProfile = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({user});
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const user = req.user;
        const { name, email } = req.body;
        if (name) user.name = name;
        if (email) user.email = email;
        await user.save();
        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error in updateUserProfile:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

