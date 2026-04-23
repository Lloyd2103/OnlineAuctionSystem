import { BiddingStrategy } from './BiddingStrategy.js';

export class StandardBiddingStrategy extends BiddingStrategy {
    validate(bidAmount, currentPrice, increment) {
        const floatBidAmount = parseFloat(bidAmount);
        const floatCurrentPrice = parseFloat(currentPrice);
        const floatIncrement = parseFloat(increment);

        if (Number.isNaN(floatBidAmount) || floatBidAmount <= 0) {
            throw new Error('Invalid bid amount');
        }

        // Logic chuẩn: Giá mới phải >= Giá hiện tại + Bước giá
        const minimumRequired = floatCurrentPrice + floatIncrement;
        
        if (floatBidAmount < minimumRequired) {
            throw new Error(`Bid amount must be at least ${minimumRequired}`);
        }

        return true;
    }
}
