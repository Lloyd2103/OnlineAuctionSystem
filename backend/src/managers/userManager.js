import userService from '../services/userService.js';

class UserManager {
    async getUserProfile(userId) {
        return await userService.findUserById(userId);
    }

    async updateUserProfile(userInstance, updateData) {
        return await userService.updateProfile(userInstance, updateData);
    }

    async submitUserRating(targetUserId, ratingValue) {
        return await userService.updateUserRating(targetUserId, ratingValue);
    }
}

export default new UserManager();
