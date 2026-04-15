
export type AuctionCategory = 'All' | 'Art' | 'Electronics' | 'Fashion' | 'Jewelry' | 'Media' | 'Vehicles' | 'Real Estates' | 'Sports'
export type AuctionStatus = 'ALL' | 'ACTIVE' | 'UPCOMING' | 'ENDED'


export interface Auction {
    id: number
    itemId: number
    ownerId: number | string
    title: string
    description: string
    currentPrice?: number;
    bids?: import('../../bid/types/bid').Bid[];
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

export interface AuctionState {
    currentAuction: Auction | null
    auctions: Auction[]
    endingSoonAuctions: Auction[];
    newlyListedAuctions: Auction[];
    loading: boolean
    createAuction: (itemId: number, title: string, description: string, startTime: Date, endTime: Date, startingPrice: number, incrementPrice: number, instantBuyPrice: number, mandatoryDeposit: number) => Promise<void>;
    updateAuction: (id: number, itemId: number, title: string, description: string, auctionStatus: string, startTime: Date, endTime: Date, startingPrice: number, incrementPrice: number, instantBuyPrice: number, mandatoryDeposit: number) => Promise<void>;
    deleteAuction: (auctionId: number) => Promise<void>;
    fetchAllAuctions: () => Promise<void>;
    fetchAuctionById: (id: number) => Promise<void>;
}

export interface FilterState {
    search: string
    category: AuctionCategory
    status: AuctionStatus
    priceRange: [number, number]
    setSearch: (search: string) => void
    setCategory: (category: AuctionCategory) => void
    setStatus: (status: AuctionStatus) => void
    setPriceRange: (range: [number, number]) => void
    resetFilters: () => void
}