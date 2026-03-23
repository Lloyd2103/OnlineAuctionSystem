import sequelize from '../libs/db.js';
import transactionRepository from '../repositories/TransactionRepository.js';
import userRepository from '../repositories/UserRepository.js';

class TransactionService {
    // Nạp tiền
    async deposit(userInstance, amount) {
        userInstance.walletBalance = parseFloat(userInstance.walletBalance) + parseFloat(amount);
        await userRepository.save(userInstance);
        
        // Tạo bản ghi giao dịch (tùy chọn nhưng nên có)
        await transactionRepository.create({
            userId: userInstance.id,
            amount,
            type: 'DEPOSIT',
            transactionStatus: 'COMPLETED',
            paymentMethod: 'WALLET',
            paymentStatus: 'COMPLETED',
            walletBalance: userInstance.walletBalance
        });
        
        return userInstance.walletBalance;
    }

    // Rút tiền
    async withdraw(userInstance, amount) {
        if (parseFloat(userInstance.walletBalance) < parseFloat(amount)) {
            throw new Error('Insufficient wallet balance');
        }
        userInstance.walletBalance = parseFloat(userInstance.walletBalance) - parseFloat(amount);
        await userRepository.save(userInstance);
        
        await transactionRepository.create({
            userId: userInstance.id,
            amount,
            type: 'WITHDRAWAL',
            transactionStatus: 'COMPLETED',
            paymentMethod: 'WALLET',
            paymentStatus: 'COMPLETED',
            walletBalance: userInstance.walletBalance
        });
        
        return userInstance.walletBalance;
    }

    // Chuyển tiền (Sử dụng Database Transaction để đảm bảo an toàn)
    async transfer(senderInstance, recipientUsername, amount) {
        if (parseFloat(senderInstance.walletBalance) < parseFloat(amount)) {
            throw new Error('Insufficient wallet balance');
        }

        const t = await sequelize.transaction();
        try {
            const recipient = await userRepository.findByUsername(recipientUsername, { transaction: t });

            if (!recipient) throw new Error('Recipient user not found');

            // Trừ tiền người gửi, cộng tiền người nhận
            senderInstance.walletBalance = parseFloat(senderInstance.walletBalance) - parseFloat(amount);
            recipient.walletBalance = parseFloat(recipient.walletBalance) + parseFloat(amount);

            await userRepository.save(senderInstance, { transaction: t });
            await userRepository.save(recipient, { transaction: t });

            // Lưu lịch sử giao dịch cho cả 2
            await transactionRepository.bulkCreate([
                { 
                    userId: senderInstance.id, 
                    amount: -amount, 
                    type: 'TRANSFER_OUT', 
                    transactionStatus: 'COMPLETED',
                    paymentMethod: 'WALLET',
                    paymentStatus: 'COMPLETED',
                    walletBalance: senderInstance.walletBalance
                },
                { 
                    userId: recipient.id, 
                    amount: amount, 
                    type: 'TRANSFER_IN', 
                    transactionStatus: 'COMPLETED',
                    paymentMethod: 'WALLET',
                    paymentStatus: 'COMPLETED',
                    walletBalance: recipient.walletBalance
                }
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
        return await transactionRepository.findAllByUserId(userId);
    }

    async findTransaction(id, userId) {
        const transaction = await transactionRepository.findOneByIdAndUserId(id, userId);
        if (!transaction) throw new Error('Transaction not found');
        return transaction;
    }
}

export default new TransactionService();