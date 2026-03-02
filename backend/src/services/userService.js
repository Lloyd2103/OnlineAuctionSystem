import User from '../models/User.js';

class UserService {
    async findUserById(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async updateProfile(userInstance, updateData) {
        const user = await this.findUserById(userInstance.id);
        const {userName, userEmail, userPhone, userAddress, userStatus, userImage} = updateData;
        
        if (userName) user.userName = userName;
        if (userEmail) user.userEmail = userEmail;
        if (userPhone) user.userPhone = userPhone;
        if (userAddress) user.userAddress = userAddress;
        if (userStatus) user.userStatus = userStatus;
        if (userImage) user.userImage = userImage;
        
        return await userInstance.save();
    }

    async updateUserRating(userId, newRating) {
        const user = await this.findUserById(userId);
        user.rating = newRating;
        return await user.save();
    }

    async getBalance(userInstance) {
        return userInstance.walletBalance;
    }
}

export default new UserService();