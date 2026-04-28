import userService from '../services/userService.js';
import { IUserManager } from './interfaces/IUserManager.js';

class UserManager extends IUserManager {
    async getUserProfile(userId) {
        return await userService.findUserById(userId);
    }

    async updateUserProfile(userInstance, updateData) {
        return await userService.updateProfile(userInstance, updateData);
    }

    async submitUserRating(targetUserId, ratingValue) {
        return await userService.updateUserRating(targetUserId, ratingValue);
    }

    async getAllUsers(options = {}) {
        return await userService.getAllUsers(options);
    }

    async updateUserStatus(userId, status) {
        return await userService.updateUserStatus(userId, status);
    }

    async updateUserRole(userId, role) {
        return await userService.updateUserRole(userId, role);
    }
}

export default new UserManager();
