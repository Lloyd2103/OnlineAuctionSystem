import { BasePaymentProcessor } from '../BasePaymentProcessor.js';
import { WalletStrategy } from '../strategies/WalletStrategy.js';
import userService from '../../../services/userService.js';
import transactionService from '../../../services/transactionService.js';

export class WalletTransferProcessor extends BasePaymentProcessor {
    async validate(context) {
        const { user: sender, recipientUsername, amount } = context.params;
        
        if (!amount || amount <= 0) throw new Error('Invalid transfer amount');
        if (Number(sender.walletBalance) < Number(amount)) throw new Error('Insufficient wallet balance');

        const recipient = await userService.findByUsername(recipientUsername, { transaction: context.transaction });
        if (!recipient) throw new Error('Recipient user not found');
        if (sender.id === recipient.id) throw new Error('Cannot transfer to yourself');

        context.data.sender = sender;
        context.data.recipient = recipient;
    }

    async performPayment(context) {
        const { sender, amount } = context.params;
        const strategy = new WalletStrategy();
        // Trừ tiền người gửi
        context.data.updatedSender = await strategy.pay(sender, amount, context.transaction);
    }

    async postProcess(context) {
        const { recipient } = context.data;
        const { amount } = context.params;
        // Cộng tiền người nhận
        context.data.updatedRecipient = await userService.updateBalance(recipient, amount, { transaction: context.transaction });
    }

    async recordLogs(context) {
        const { sender, recipient, updatedSender, updatedRecipient } = context.data;
        const { amount } = context.params;

        // Log cho người gửi
        await transactionService.createTransaction({
            userId: sender.id,
            amount: -amount,
            type: 'TRANSFER_OUT',
            walletBalance: updatedSender.walletBalance,
            description: `Transfer to ${recipient.userName}`
        }, { transaction: context.transaction });

        // Log cho người nhận
        await transactionService.createTransaction({
            userId: recipient.id,
            amount: amount,
            type: 'TRANSFER_IN',
            walletBalance: updatedRecipient.walletBalance,
            description: `Receive from ${sender.userName}`
        }, { transaction: context.transaction });

        context.result = {
            message: 'Transfer successful',
            senderBalance: updatedSender.walletBalance
        };
    }
}
