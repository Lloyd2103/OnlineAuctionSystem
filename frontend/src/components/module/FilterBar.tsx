import { SlidersHorizontal, X } from 'lucide-react'
import { useFilterStore } from '@/features/auction/stores/auctionStore'
import type { AuctionCategory, AuctionStatus } from '@/features/auction/types/auction'

const categories: AuctionCategory[] = ['All', 'Art', 'Electronics', 'Fashion', 'Jewelry', 'Media', 'Vehicles', 'Real Estates', 'Sports']
const statuses: AuctionStatus[] = ['ALL', 'ACTIVE', 'UPCOMING', 'ENDED']

const priceRanges = [
  { label: 'Any Price', min: 0, max: 50000 },
  { label: 'Under $1K', min: 0, max: 1000 },
  { label: '$1K - $5K', min: 1000, max: 5000 },
  { label: '$5K - $15K', min: 5000, max: 15000 },
  { label: '$15K+', min: 15000, max: 50000 },
]

export function FilterBar() {
  const { category, status, priceRange, setCategory, setStatus, setPriceRange, resetFilters } =
    useFilterStore()

  const hasActiveFilters =
    category !== 'All' || status !== 'ALL' || priceRange[0] !== 0 || priceRange[1] !== 5000000

  return (
    <section className="border-b border-border bg-card" id="auctions">
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Filter Auctions
          </h2>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="ml-auto flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" />
              Clear ALL
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-ALL ${category === cat
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-8 w-px bg-border" />

          {/* Status */}
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-ALL ${status === s
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
                  }`}
              >
                {s === 'ACTIVE' && (
                  <span className={`h-1.5 w-1.5 rounded-full ${status === s ? 'bg-primary-foreground' : 'bg-live'} animate-pulse-live`} />
                )}
                {s}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-8 w-px bg-border" />

          {/* Price Range */}
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => setPriceRange([range.min, range.max])}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-ALL ${priceRange[0] === range.min && priceRange[1] === range.max
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
                  }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
