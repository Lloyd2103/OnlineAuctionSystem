
export type AuctionCategory = 'All' | 'Art' | 'Electronics' | 'Fashion' | 'Jewelry' | 'Media' | 'Vehicles' | 'Real Estates' | 'Sports'
export type AuctionStatus = 'ALL' | 'ACTIVE' | 'UPCOMING' | 'ENDED'

export interface Bid {
    id: string;
    auctionId: string;
    bidderId: string;
    bidAmount: number;
    createdAt: Date;
    updatedAt: Date;
    isWinningBid?: boolean;
    userName?: string;
    bidder?: {
        userName: string;
    }
}

export interface Auction {
    id: number
    itemId: number
    ownerId: number | string
    title: string
    description: string
    currentPrice?: number;
    bids?: Bid[];
    auctionTitle: string
    startTime: Date
    endTime: Date
    auctionStatus: AuctionStatus
    startingPrice: number
    incrementPrice: number
    instantBuyPrice: number
    mandatoryDeposit: number
    createdAt: string
    updatedAt: string
    item?: {
        itemName: string;
        itemImage: string;
        itemDescription: string;
        itemStatus: string;
        category: string;
        attributes: Record<string, string>;
    };
}
