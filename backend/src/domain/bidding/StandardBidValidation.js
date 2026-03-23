import { BidValidationStrategy } from './BidValidationStrategy.js';

export class StandardBidValidation extends BidValidationStrategy {
  validate({ auction, highestBid, bidder, bidAmount, now }) {
    if (!auction) throw new Error('Auction not found');

    const start = new Date(auction.startTime);
    const end = new Date(auction.endTime);
    if (now < start || now > end) {
      throw new Error('Phiên đấu giá hiện không diễn ra');
    }

    const bidderBalance = parseFloat(bidder.walletBalance);
    const amount = parseFloat(bidAmount);
    if (bidderBalance < amount) {
      throw new Error('Số dư ví không đủ để đặt giá');
    }

    const current = highestBid
      ? parseFloat(highestBid.bidAmount)
      : parseFloat(auction.startingPrice);

    if (amount <= current) {
      throw new Error(`Giá thầu phải cao hơn giá hiện tại (${current})`);
    }
  }
}

