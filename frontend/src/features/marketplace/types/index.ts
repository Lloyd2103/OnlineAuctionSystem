export interface AuctionListItem {
  auctionId: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  sellerName: string;
  sellerId: string;
  sellerRating: number;
  startingPrice: number;
  currentHighestBid: number;
  bidIncrement: number;
  endTime: string;
  status: string;
  bidCount: number;
}

export type SortOption = 'ending-soon' | 'newest' | 'price-low' | 'price-high' | 'most-bids';

export interface MarketplaceFilters {
    minPrice: number;
    maxPrice: number;
    status: string;
    sortBy: SortOption;
}
