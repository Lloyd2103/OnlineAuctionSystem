import { Button } from '@/components/ui/button';
import { MarketplaceItem } from './MarketplaceItem';
import type { AuctionListItem } from '../types';

interface MarketplaceListProps {
    auctions: AuctionListItem[];
    isLoading: boolean;
    viewMode: 'grid' | 'list';
    hasMore: boolean;
    onLoadMore: () => void;
    onReset: () => void;
}

export function MarketplaceList({
    auctions,
    isLoading,
    viewMode,
    hasMore,
    onLoadMore,
    onReset
}: MarketplaceListProps) {
    if (isLoading && auctions.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, idx) => (
                    <div key={idx} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (auctions.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No auctions found</p>
                <Button onClick={onReset} variant="outline">
                    Clear Filters
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-3"
            }>
                {auctions.map((auction) => (
                    <MarketplaceItem 
                        key={auction.auctionId} 
                        auction={auction} 
                        viewMode={viewMode} 
                    />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-8">
                    <Button
                        onClick={onLoadMore}
                        variant="outline"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </Button>
                </div>
            )}
        </>
    );
}
