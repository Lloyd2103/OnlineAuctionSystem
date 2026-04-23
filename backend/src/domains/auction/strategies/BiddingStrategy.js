export class BiddingStrategy {
    /**
     * Kiểm tra xem số tiền đặt giá có hợp lệ không
     */
    validate(bidAmount, currentPrice, increment) {
        throw new Error("Method 'validate' must be implemented.");
    }

    /**
     * Tính toán giá tiếp theo (nếu cần)
     */
    calculateNextPrice(currentPrice, increment) {
        return currentPrice + increment;
    }
}
