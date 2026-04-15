import { Gavel } from 'lucide-react';
import { AuctionCard } from '@/components/module/AuctionCard'; // Shared component
import type { Auction } from '../../auction/types';

interface ProfileAuctionsProps {
    auctions: Auction[];
}

export function ProfileAuctions({ auctions }: ProfileAuctionsProps) {
    return (
        <main>
            <div className="flex items-center gap-8 border-b mb-6 overflow-x-auto">
                <button className="pb-4 border-b-2 border-primary font-bold text-primary whitespace-nowrap">
                    Active Auctions
                </button>
                <button className="pb-4 text-muted-foreground hover:text-foreground whitespace-nowrap">
                    Past Sales
                </button>
                <button className="pb-4 text-muted-foreground hover:text-foreground whitespace-nowrap">
                    Reviews
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {auctions.length > 0 ? (
                    auctions.map((auction) => (
                        <AuctionCard key={auction.id} auction={auction} />
                    ))
                ) : (
                    <div className="text-center py-20 bg-card rounded-2xl border border-dashed sm:col-span-2">
                        <Gavel size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">Currently no active auctions from this user.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
