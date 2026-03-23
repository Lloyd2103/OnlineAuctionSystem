
import { PackageOpen } from 'lucide-react'
import { AuctionCard } from '../module/AuctionCard'

import { useAuctionStore } from '@/stores/auctionStore'

export function AuctionGrid() {
  const { auctions } = useAuctionStore()


  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              All Auctions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {auctions.length} {auctions.length === 1 ? 'item' : 'items'} found
            </p>
          </div>
        </div>

        {auctions.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex items-center justify-center rounded-full bg-muted p-4 mb-4">
              <PackageOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3
              className="text-lg font-semibold text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              No auctions found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              Try adjusting your filters or search terms to discover more items.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
