import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import sequelize from '../libs/db.js';

class TransactionService {
    // Nạp tiền
    async deposit(userInstance, amount) {
        userInstance.walletBalance += amount;
        await userInstance.save();
        
        // Tạo bản ghi giao dịch (tùy chọn nhưng nên có)
        await Transaction.create({
            userId: userInstance.id,
            amount,
            type: 'DEPOSIT',
            status: 'SUCCESS'
        });
        
        return userInstance.walletBalance;
    }

    // Rút tiền
    async withdraw(userInstance, amount) {
        if (userInstance.walletBalance < amount) {
            throw new Error('Insufficient wallet balance');
        }
        userInstance.walletBalance -= amount;
        await userInstance.save();
        
        await Transaction.create({
            userId: userInstance.id,
            amount,
            type: 'WITHDRAWAL',
            status: 'SUCCESS'
        });
        
        return userInstance.walletBalance;
    }

    // Chuyển tiền (Sử dụng Database Transaction để đảm bảo an toàn)
    async transfer(senderInstance, recipientUsername, amount) {
        if (senderInstance.walletBalance < amount) {
            throw new Error('Insufficient wallet balance');
        }

        const t = await sequelize.transaction();
        try {
            const recipient = await User.findOne({ 
                where: { username: recipientUsername },
                transaction: t 
            });

            if (!recipient) throw new Error('Recipient user not found');

            // Trừ tiền người gửi, cộng tiền người nhận
            senderInstance.walletBalance -= amount;
            recipient.walletBalance += amount;

            await senderInstance.save({ transaction: t });
            await recipient.save({ transaction: t });

            // Lưu lịch sử giao dịch cho cả 2
            await Transaction.bulkCreate([
                { userId: senderInstance.id, amount: -amount, type: 'TRANSFER_OUT', status: 'SUCCESS' },
                { userId: recipient.id, amount: amount, type: 'TRANSFER_IN', status: 'SUCCESS' }
            ], { transaction: t });

            await t.commit();
            return senderInstance.walletBalance;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    // Các hàm xử lý bản ghi giao dịch thuần túy
    async getHistory(userId) {
        return await Transaction.findAll({ 
            where: { userId },
            order: [['createdAt', 'DESC']]
        });
    }

    async findTransaction(id, userId) {
        const transaction = await Transaction.findOne({ where: { id, userId } });
        if (!transaction) throw new Error('Transaction not found');
        return transaction;
    }
}

export default new TransactionService();