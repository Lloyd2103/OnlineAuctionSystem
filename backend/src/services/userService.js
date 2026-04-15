import userRepository from '../repositories/UserRepository.js';

class UserService {
    async findUserById(userId, options = {}) {
        const user = await userRepository.findById(userId, options);
        return user;
    }

    async findByEmail(email, options = {}) {
        const user = await userRepository.findOne({ userEmail: email }, options);
        return user;
    }
    
    async findByUsername(userName, options = {}) {
        const user = await userRepository.findOne({ userName }, options);
        return user;
    }

    async createUser(userData, options = {}) {
        return await userRepository.create(userData, options);
    }

    calculateNewRating(currentCount, currentScore, newRatingValue) {
        const ratingValue = parseFloat(newRatingValue);
        if (Number.isNaN(ratingValue)) throw new Error('Invalid rating');
        const count = parseInt(currentCount, 10) || 0;
        const score = parseFloat(currentScore) || 0;
        const nextCount = count + 1;
        const nextScore = (score * count + ratingValue) / nextCount;
        
        return { ratingCount: nextCount, ratingScore: nextScore };
    }

    async updateUserRating(userId, newRating, options = {}) {
        const user = await this.findUserById(userId, options);
        const { ratingCount, ratingScore } = this.calculateNewRating(user.ratingCount, user.ratingScore, newRating);
        
        user.ratingCount = ratingCount;
        user.ratingScore = ratingScore;
        return await userRepository.save(user, options);
    }

    async updateBalance(userInstance, amount, options = {}) {
        let currentBalance = Number(userInstance.walletBalance);
        if (Number.isNaN(currentBalance)) currentBalance = 0;
        
        let addAmount = Number(amount);
        if (Number.isNaN(addAmount)) addAmount = 0;
        
        userInstance.walletBalance = currentBalance + addAmount;
        return await userRepository.save(userInstance, options);
    }

    async updateProfile(userInstance, updateData, options = {}) {
        const allowedUpdates = ['userName', 'userEmail', 'userPhone', 'userAddress', 'userStatus', 'userImage'];
        allowedUpdates.forEach((field) => {
            if (updateData[field] !== undefined) {
                userInstance[field] = updateData[field];
            }
        });
        return await userRepository.save(userInstance, options);
    }

    async getBalance(userInstance) {
        return userInstance.walletBalance;
    }
}

export default new UserService();