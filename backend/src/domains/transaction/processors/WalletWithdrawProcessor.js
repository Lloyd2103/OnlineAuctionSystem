import { BasePaymentProcessor } from '../BasePaymentProcessor.js';
import { WalletStrategy } from '../strategies/WalletStrategy.js';
import transactionService from '../../../services/transactionService.js';

export class WalletWithdrawProcessor extends BasePaymentProcessor {
    async validate(context) {
        const { user, amount } = context.params;
        if (!amount || amount <= 0) throw new Error('Invalid withdrawal amount');
        if (Number(user.walletBalance) < Number(amount)) {
            throw new Error('Insufficient wallet balance');
        }
    }

    async performPayment(context) {
        const { user, amount } = context.params;
        const strategy = new WalletStrategy();
        context.data.updatedUser = await strategy.pay(user, amount, context.transaction);
    }

    async recordLogs(context) {
        const { user, amount } = context.params;
        const { updatedUser } = context.data;

        await transactionService.createTransaction({
            userId: user.id,
            amount: -amount,
            type: 'WITHDRAWAL',
            walletBalance: updatedUser.walletBalance
        }, { transaction: context.transaction });


        context.result = {
            message: 'Withdrawal successful',
            walletBalance: updatedUser.walletBalance
        };
    }
}
