import fakePaymentService from '../../../services/fakePaymentService.js';
import { PaymentStrategy } from './PaymentStrategy.js';

export class ExternalStrategy extends PaymentStrategy {
    constructor(method) { super(); this.method = method; }
    async pay(user, amount, t) {
        await fakePaymentService.processPayment(amount, this.method);
        return user; // Đối với cổng ngoài, user instance không đổi số dư nội bộ
    }
}