import userRepository from '../repositories/UserRepository.js';

class UserService {
    async findUserById(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async updateProfile(userInstance, updateData) {
        // 1. Tìm user trực tiếp từ Database dựa trên ID của instance truyền vào
        // Điều này đảm bảo bạn đang làm việc với dữ liệu mới nhất
        const user = await this.findUserById(userInstance._id || userInstance.id);
        
        if (!user) {
            throw new Error("User not found");
        }

        // 2. Danh sách các trường cho phép cập nhật
        const allowedUpdates = [
            'userName', 
            'userEmail', 
            'userPhone', 
            'userAddress', 
            'userStatus', 
            'userImage'
        ];

        // 3. Duyệt qua updateData để gán giá trị
        allowedUpdates.forEach((field) => {
            // Chỉ cập nhật nếu frontend có gửi giá trị đó về (tránh ghi đè bằng null/undefined)
            if (updateData[field] !== undefined) {
                user[field] = updateData[field];
            }
        });

        // 4. Lưu đối tượng 'user' (đối tượng vừa được gán giá trị mới)
        return await userRepository.save(user);
    }

    async updateUserRating(userId, newRating) {
        const user = await this.findUserById(userId);
        const ratingValue = parseFloat(newRating);
        if (Number.isNaN(ratingValue)) throw new Error('Invalid rating');

        const currentCount = parseInt(user.ratingCount, 10) || 0;
        const currentScore = parseFloat(user.ratingScore) || 0;
        const nextCount = currentCount + 1;
        const nextScore = (currentScore * currentCount + ratingValue) / nextCount;

        user.ratingCount = nextCount;
        user.ratingScore = nextScore;
        return await userRepository.save(user);
    }

    async getBalance(userInstance) {
        return userInstance.walletBalance;
    }
}

export default new UserService();