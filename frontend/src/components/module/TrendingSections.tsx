import { Flame, Sparkles } from 'lucide-react'
import { AuctionCard } from '../module/AuctionCard'
import { useAuctionStore } from '@/features/auction/stores/auctionStore'
import type { Auction } from '@/features/auction/types/auction';


// module/TrendingSections.tsx
export function TrendingSections() {
  const { endingSoonAuctions, newlyListedAuctions, loading } = useAuctionStore();

  if (loading && newlyListedAuctions.length === 0) {
    return <div className="py-10 text-center">Loading trends...</div>;
  }

  return (
    <div className="pb-14">
      {/* Ending Soon Section */}
      {endingSoonAuctions.length > 0 && (
        <section className="py-10 sm:py-14 bg-destructive/[0.03] border-y border-destructive/10">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center rounded-lg bg-red-100 p-2">
                <Flame className="h-5 w-5 text-red-600 animate-bounce" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Ending Soon</h2>
                <p className="text-sm text-red-600 font-medium">Closing fast - last chance to bid!</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {endingSoonAuctions.map((auction: Auction) => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  urgent={true} // Truyền prop để Card đổi màu đỏ cảnh báo
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newly Listed Section */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center rounded-lg bg-blue-100 p-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Newly Listed</h2>
              <p className="text-sm text-muted-foreground">Fresh additions to our marketplace</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {newlyListedAuctions.length > 0 ? (
              newlyListedAuctions.map((auction: Auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))
            ) : (
              // Fallback nếu không có hàng mới, hiện mảng auctions gốc
              useAuctionStore.getState().auctions.slice(0, 4).map((auction: Auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}