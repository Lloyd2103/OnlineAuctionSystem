import { ArrowRight, Users, TrendingUp, Shield, Loader2 } from 'lucide-react'
import { useCountdown } from '@/hooks/useCountdown'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { useAuctionStore } from '@/features/auction/stores/auctionStore'
import { formatCurrency } from '@/libs/utils'

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="text-2xl sm:text-3xl font-bold tabular-nums text-foreground"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{label}</span>
    </div>
  )
}

export function Hero() {
  const navigate = useNavigate()
  const liveAuctions = useAuctionStore((state) => state.liveAuctions);
  const upcomingAuctions = useAuctionStore((state) => state.upcomingAuctions);
  const auctions = useAuctionStore((state) => state.auctions);
  const loading = useAuctionStore((state) => state.loading);
  const fetchAllAuctions = useAuctionStore((state) => state.fetchAllAuctions);

  useEffect(() => {
    if (auctions.length === 0) {
      fetchAllAuctions();
    }
  }, [fetchAllAuctions, auctions.length]);

  // 1. Ưu tiên lấy cái đầu tiên của LIVE (đã được store lọc và sort theo sắp kết thúc)
  // 2. Nếu không có LIVE, lấy cái đầu tiên của UPCOMING (đã được store lọc và sort theo sắp bắt đầu)
  // 3. Cuối cùng fallback về cái đầu tiên trong list auctions bất kỳ
  const featuredAuction = liveAuctions[0] || upcomingAuctions[0] || auctions[0] || null;

  // Countdown đến thời điểm kết thúc (nếu live) hoặc mục tiêu khác tùy ý
  const timeLeft = useCountdown(featuredAuction?.endTime ?? new Date());

  if (loading && auctions.length === 0) {
    return (
      <div className="h-[500px] flex flex-col items-center justify-center bg-primary text-white gap-4">
        <Loader2 className="animate-spin w-10 h-10" />
        <p className="animate-pulse">Fetching latest auctions...</p>
      </div>
    )
  }

  if (!featuredAuction) return null;

  if (loading) {
    return <div className="h-[500px] flex items-center justify-center bg-primary text-white">Loading Featured Auction...</div>
  }

  const handleJoinBidding = () => {
    if (featuredAuction) {
      navigate(`/auction/${featuredAuction.id}`)
    }
  }
  return (
    <section className="relative overflow-hidden bg-primary">

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left: Featured Auction Item */}
          <div className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-2xl bg-card shadow-2xl">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={featuredAuction.item?.itemImage}
                  alt={featuredAuction.title}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
                {/* Status badge */}
                <div className={`absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-lg ${
                  featuredAuction.auctionStatus === 'ACTIVE' 
                    ? 'bg-live text-live-foreground' 
                    : featuredAuction.auctionStatus === 'UPCOMING'
                    ? 'bg-blue-600 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {featuredAuction.auctionStatus === 'ACTIVE' && (
                    <span className="h-2 w-2 rounded-full bg-live-foreground animate-pulse-live" />
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {featuredAuction.auctionStatus === 'ACTIVE' ? 'Live' : featuredAuction.auctionStatus}
                  </span>
                </div>
                {/* Bid count overlay */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-foreground/80 px-3 py-1.5 backdrop-blur-sm">
                  <Users className="h-3.5 w-3.5 text-primary-foreground" />
                  <span className="text-xs font-medium text-primary-foreground">
                    {featuredAuction.bids?.length ?? 0} bids
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 sm:p-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Featured Auction
                </p>
                <h3
                  className="mt-1.5 text-xl font-bold text-card-foreground text-balance"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {featuredAuction.title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {featuredAuction.description}
                </p>

                {/* Price & Timer */}
                <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Bid</p>
                    <p
                      className="text-2xl sm:text-3xl font-bold text-bid"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {formatCurrency(featuredAuction.startingPrice)}
                    </p>

                  </div>
                  <div className="flex items-center gap-3">
                    <CountdownUnit value={timeLeft.days} label="Days" />
                    <span className="text-xl font-bold text-muted-foreground mb-4">:</span>
                    <CountdownUnit value={timeLeft.hours} label="Hrs" />
                    <span className="text-xl font-bold text-muted-foreground mb-4">:</span>
                    <CountdownUnit value={timeLeft.minutes} label="Min" />
                    <span className="text-xl font-bold text-muted-foreground mb-4">:</span>
                    <CountdownUnit value={timeLeft.seconds} label="Sec" />
                  </div>
                </div>

                <button
                  onClick={handleJoinBidding}
                  className="mt-5 w-full rounded-lg bg-bid py-3 text-sm font-semibold text-bid-foreground hover:bg-bid/90 transition-colors"
                >
                  Place a Bid
                </button>
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1.5 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wider">
                Live Auctions
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary-foreground text-balance"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Discover. Bid.{' '}
              <span className="text-bid">Win.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-primary-foreground/70">
              Join thousands of collectors and enthusiasts in our premium auction marketplace. Rare art, cutting-edge tech, and timeless collectibles - all verified and secured.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={handleJoinBidding}
                className="flex items-center gap-2 rounded-lg bg-bid px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-bid/25 hover:bg-bid/90 transition-all hover:shadow-bid/40"
              >
                Join the Bidding
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate('/marketplace')}
                className="rounded-lg border border-primary-foreground/20 px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                Browse Catalog
              </button>

            </div>

            {/* Trust indicators */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-bid" />
                  <span className="text-lg font-bold text-primary-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                    12K+
                  </span>
                </div>
                <span className="text-xs text-primary-foreground/50">Active Auctions</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-success" />
                  <span className="text-lg font-bold text-primary-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                    85K+
                  </span>
                </div>
                <span className="text-xs text-primary-foreground/50">Verified Users</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gold" />
                  <span className="text-lg font-bold text-primary-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                    100%
                  </span>
                </div>
                <span className="text-xs text-primary-foreground/50">Secure Escrow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
