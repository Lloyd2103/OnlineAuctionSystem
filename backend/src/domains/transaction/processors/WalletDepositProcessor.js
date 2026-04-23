import { BasePaymentProcessor } from '../BasePaymentProcessor.js';
import userService from '../../../services/userService.js';
import transactionService from '../../../services/transactionService.js';

export class WalletDepositProcessor extends BasePaymentProcessor {
    async validate(context) {
        const { amount } = context.params;
        if (!amount || amount <= 0) throw new Error('Invalid deposit amount');
        context.data.user = context.params.user;
    }

    async performPayment(context) {
        const { user, amount } = context.params;
        // Nạp tiền: Cộng vào ví (Ở đây giả định nạp trực tiếp, sau này có thể dùng ExternalStrategy)
        context.data.updatedUser = await userService.updateBalance(user, amount, { transaction: context.transaction });
    }

    async recordLogs(context) {
        const { user, amount } = context.params;
        const { updatedUser } = context.data;

        await transactionService.createTransaction({
            userId: user.id,
            amount: amount,
            type: 'DEPOSIT',
            walletBalance: updatedUser.walletBalance
        }, { transaction: context.transaction });


        context.result = {
            message: 'Deposit successful',
            walletBalance: updatedUser.walletBalance
        };
    }
}
