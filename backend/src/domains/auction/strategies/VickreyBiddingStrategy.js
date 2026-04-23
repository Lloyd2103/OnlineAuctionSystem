import { BiddingStrategy } from './BiddingStrategy.js';

/**
 * Vickrey Auction Strategy:
 * Người đặt giá cao nhất thắng, nhưng chỉ phải trả giá của người đặt cao thứ 2 + bước giá.
 * (Đây là bản demo logic validate cho Strategy này)
 */
export class VickreyBiddingStrategy extends BiddingStrategy {
    validate(bidAmount, currentPrice, increment) {
        const floatBidAmount = parseFloat(bidAmount);
        const floatCurrentPrice = parseFloat(currentPrice);
        
        if (Number.isNaN(floatBidAmount) || floatBidAmount <= floatCurrentPrice) {
            throw new Error(`In Vickrey Auction, your bid must be higher than current highest bid (${floatCurrentPrice})`);
        }
        
        return true;
    }

    // Trong Vickrey, giá hiển thị thường là giá người thắng sẽ phải trả (giá cao thứ 2)
    calculateNextPrice(highestBid, secondHighestBid, increment) {
        return secondHighestBid + increment;
    }
}
