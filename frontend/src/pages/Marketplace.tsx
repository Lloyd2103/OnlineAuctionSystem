import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router'
import { auctionService } from '@/services/auctionService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { formatPrice, formatRelativeTime, truncateText } from '@/lib/utils'
import { Search, Filter, Clock, LayoutGrid, List } from 'lucide-react'
import { toast } from 'sonner'

interface Auction {
  auctionId: string
  itemId: string
  itemName: string
  itemImage: string
  sellerName: string
  sellerId: string
  sellerRating: number
  startingPrice: number
  currentHighestBid: number
  bidIncrement: number
  endTime: string
  status: string
  bidCount: number
}

export default function MarketplacePage() {
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''

  const [auctions, setAuctions] = useState<Auction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000,
    status: 'HAPPENING',
    sortBy: 'ending-soon' as const,
  })

  const fetchAuctions = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await auctionService.fetchAuctions({
        search: searchQuery,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        status: filters.status as any,
        sortBy: filters.sortBy,
        page,
        limit: 12,
      })
      setAuctions(data.data || [])
      setHasMore(data.hasMore || false)
    } catch (error) {
      console.error('Failed to fetch auctions:', error)
      toast.error('Failed to load auctions')
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, filters, page])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, filters])

  useEffect(() => {
    fetchAuctions()
  }, [fetchAuctions])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilters({
      minPrice: 0,
      maxPrice: 10000,
      status: 'HAPPENING',
      sortBy: 'ending-soon',
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
        <p className="text-gray-600">Browse and bid on thousands of items</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Filter size={18} />
                Filters
              </h3>
              {(searchQuery || filters.status !== 'HAPPENING') && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="space-y-2">
              <Label className="text-sm font-medium">Search</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm"
                />
                <button type="submit" className="text-blue-600 hover:text-blue-700">
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Price Range</Label>
              <Slider
                min={0}
                max={50000}
                step={100}
                value={[filters.minPrice, filters.maxPrice]}
                onValueChange={(values) =>
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: values[0],
                    maxPrice: values[1],
                  }))
                }
                className="w-full"
              />
              <div className="flex gap-2 text-sm">
                <span>{formatPrice(filters.minPrice)}</span>
                <span>-</span>
                <span>{formatPrice(filters.maxPrice)}</span>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HAPPENING">Live Now</SelectItem>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, sortBy: value as any }))
                }
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ending-soon">Ending Soon</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price Low to High</SelectItem>
                  <SelectItem value="price-high">Price High to Low</SelectItem>
                  <SelectItem value="most-bids">Most Bids</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">{auctions.length} auctions found</p>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
                  }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
                  }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Auctions Grid/List */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(12)].map((_, idx) => (
                <div key={idx} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : auctions.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {auctions.map((auction) => (
                    <Link key={auction.auctionId} to={`/auction/${auction.auctionId}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                        <div className="relative">
                          <img
                            src={auction.itemImage || '/placeholder.png'}
                            alt={auction.itemName}
                            className="w-full h-48 object-cover"
                          />
                          <Badge className="absolute top-3 right-3 bg-red-500">
                            {auction.status}
                          </Badge>
                        </div>
                        <CardContent className="p-4 space-y-3">
                          <div>
                            <h3 className="font-semibold line-clamp-2">{auction.itemName}</h3>
                            <p className="text-sm text-gray-600">by {auction.sellerName}</p>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-gray-500">Current Bid</p>
                              <p className="text-2xl font-bold text-blue-600">
                                {formatPrice(auction.currentHighestBid)}
                              </p>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {auction.bidCount} {auction.bidCount === 1 ? 'bid' : 'bids'}
                              </span>
                              <span className="font-semibold text-red-500 flex items-center gap-1">
                                <Clock size={14} />
                                {formatRelativeTime(new Date(auction.endTime))}
                              </span>
                            </div>
                          </div>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            Place Bid
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {auctions.map((auction) => (
                    <Link key={auction.auctionId} to={`/auction/${auction.auctionId}`}>
                      <Card className="hover:shadow-lg transition cursor-pointer">
                        <CardContent className="p-4 flex gap-4">
                          <img
                            src={auction.itemImage || '/placeholder.png'}
                            alt={auction.itemName}
                            className="w-24 h-24 rounded object-cover"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{truncateText(auction.itemName, 60)}</h3>
                              <p className="text-sm text-gray-600">by {auction.sellerName}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge>{auction.status}</Badge>
                                <span className="text-xs text-gray-500">
                                  {auction.bidCount} bids
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Current Bid</p>
                              <p className="text-2xl font-bold text-blue-600">
                                {formatPrice(auction.currentHighestBid)}
                              </p>
                              <p className="text-sm text-red-500 mt-2">
                                {formatRelativeTime(new Date(auction.endTime))}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => setPage((p) => p + 1)}
                    variant="outline"
                    disabled={isLoading}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No auctions found</p>
              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
