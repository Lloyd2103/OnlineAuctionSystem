export class IUserManager {
    async getUserProfile(userId) {
        throw new Error('Not implemented');
    }

    async updateUserProfile(userInstance, updateData) {
        throw new Error('Not implemented');
    }

    async getWalletBalance(userId) {
        throw new Error('Not implemented');
    }

    async submitUserRating(targetUserId, ratingValue) {
        throw new Error('Not implemented');
    }

    async getUserRating(userId) {
        throw new Error('Not implemented');
    }

}