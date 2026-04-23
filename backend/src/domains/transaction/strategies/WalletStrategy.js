import userService from '../../../services/userService.js';
import { PaymentStrategy } from './PaymentStrategy.js';

export class WalletStrategy extends PaymentStrategy {
    async pay(user, amount, t) {
        if (Number(user.walletBalance) < Number(amount)) {
            throw new Error('Số dư ví không đủ');
        }
        // Cập nhật số dư trong DB
        await userService.updateBalance(user, -amount, { transaction: t });
        // Reload để lấy số dư mới nhất trong bộ nhớ
        return await user.reload({ transaction: t });
    }
}