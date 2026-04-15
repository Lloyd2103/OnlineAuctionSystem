export interface Bid {
    id: string;
    auctionId: string;
    bidderId: string;
    bidAmount: number;
    createdAt: Date;
    updatedAt: Date;
    isWinningBid?: boolean;
    userName?: string;
}