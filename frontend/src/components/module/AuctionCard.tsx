import { Users, Clock } from 'lucide-react'
import { useCountdown } from '@/hooks/useCountdown'
import { formatCurrency } from '@/libs/utils'
import type { Auction } from '@/features/auction/types/auction'
import { useNavigate } from 'react-router'

interface AuctionCardProps {
  auction: Auction
  urgent?: boolean
}

export function AuctionCard({ auction, urgent = false }: AuctionCardProps) {
  const navigate = useNavigate()
  const timeLeft = useCountdown(auction.endTime)
  const isEnding = (timeLeft.total ?? 0) > 0 && (timeLeft.total ?? 0) < 6 * 60 * 60 * 1000

  const handlePlaceBid = () => {
    navigate(`/auction/${auction.id}`)
  }

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* 3. SỬA: Lấy ảnh từ auction.item.itemImage */}
        <img
          src={auction.item?.itemImage || '/placeholder.png'}
          alt={auction.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Status Badge */}
        {/* 4. SỬA: Tên field là auctionStatus */}
        {auction.auctionStatus === 'ACTIVE' && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-live px-2.5 py-1 shadow-md">
            <span className="h-1.5 w-1.5 rounded-full bg-live-foreground animate-pulse" />
            <span className="text-[10px] font-bold text-live-foreground uppercase tracking-widest">
              Live
            </span>
          </div>
        )}

        {/* Bid count (nếu bạn chưa làm logic đếm bid, có thể để tạm 0 hoặc ẩn đi) */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-foreground/70 px-2 py-1 backdrop-blur-sm">
          <Users className="h-3 w-3 text-primary-foreground" />
          <span className="text-[10px] font-medium text-primary-foreground">{auction.itemId}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {/* 5. SỬA: Lấy category từ auction.item */}
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
              {auction.item?.category || 'General'}
            </p>
            <h3
              className="mt-1 text-sm font-bold text-card-foreground truncate"
              style={{ fontFamily: 'var(--font-heading)' }}
              title={auction.title}
            >
              {auction.title}
            </h3>
          </div>
        </div>

        {/* Timer Section */}
        <div className={`mt-3 flex items-center gap-1.5 ${(isEnding || urgent) ? 'text-red-500' : 'text-muted-foreground'}`}>
          <Clock className="h-3.5 w-3.5" />
          {(timeLeft.total ?? 0) <= 0 ? (
            <span className="text-xs font-medium text-gray-400">Ended</span>
          ) : (
            <span className={`text-xs font-semibold tabular-nums ${(isEnding || urgent) ? 'animate-pulse' : ''}`}>
              {timeLeft.days > 0 && `${timeLeft.days}d `}
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          )}
          {(isEnding || urgent) && (timeLeft.total ?? 0) > 0 && (
            <span className="text-[10px] font-bold uppercase tracking-wider ml-1">Urgent</span>
          )}
        </div>

        {/* Price & Button Section */}
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Starting Price </p>
            <p
              className="text-lg font-bold text-bid"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {/* 6. SỬA: Dùng startingPrice và ép kiểu Number */}
              {formatCurrency(Number(auction.startingPrice))}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Price </p>
            <p
              className="text-lg font-bold text-bid"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {/* 6. SỬA: Dùng startingPrice và ép kiểu Number */}
              {formatCurrency(Number(auction.highestBid?.bidAmount ?? auction.startingPrice))}
            </p>
          </div>
          <button
            onClick={handlePlaceBid}
            className="rounded-lg bg-bid px-4 py-2 text-xs font-semibold text-bid-foreground transition-all hover:bg-bid/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            View
          </button>
        </div>

      </div>
    </div>
  )
}