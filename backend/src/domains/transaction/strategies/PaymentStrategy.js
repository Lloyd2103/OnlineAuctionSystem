export class PaymentStrategy {
    async pay(user, amount, t) { 
        throw new Error("Method 'pay' must be implemented."); 
    }
}
