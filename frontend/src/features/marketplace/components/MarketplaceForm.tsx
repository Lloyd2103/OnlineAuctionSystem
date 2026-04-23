import { useEffect } from 'react';
import { AuctionCard } from '@/components/module/AuctionCard';
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useAuctionStore, useFilterStore } from '@/features/auction/stores/auctionStore';
import type { AuctionCategory, AuctionStatus } from '@/features/auction/types/auction';
import { Pagination } from '@/components/common/Pagination';
import type { Auction } from '@/features/auction/types/auction';


const categories: AuctionCategory[] = ['All', 'Art', 'Electronics', 'Fashion', 'Jewelry', 'Media', 'Vehicles', 'Real Estates', 'Sports'];
const auctionStatuses: AuctionStatus[] = ['ALL', 'ACTIVE', 'UPCOMING', 'ENDED'];

export function Marketplace() {
    const { auctions, fetchAuctionsPaged, totalItems, totalPages, loading: storeLoading } = useAuctionStore();
    const { 
        category, status, priceRange, search, page,
        setCategory, setPriceRange, setSearch, resetFilters, setStatus, setPage
    } = useFilterStore();
    
    useEffect(() => {
        fetchAuctionsPaged({
            category: category === 'All' ? undefined : category,
            status: status === 'ALL' ? undefined : status,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            search: search || undefined,
            page,
            limit: 12
        });
    }, [fetchAuctionsPaged, category, status, priceRange, search, page]);


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">Marketplace</h1>
                <p className="text-muted-foreground">Discover and bid on amazing items from worldwide collectors.</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar Lọc */}
                <aside className="lg:col-span-1">
                    <div className="bg-card rounded-xl shadow-sm p-6 sticky top-24 border border-border">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-primary" />
                                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Filters</h2>
                            </div>
                            <button 
                                onClick={resetFilters}
                                className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <X size={14} /> Reset
                            </button>
                        </div>

                        {/* Search */}
                        <div className="mb-8">
                            <label className="block text-xs font-bold text-muted-foreground uppercase mb-3">Search</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Keywords, brands, items..."
                                    className="w-full pl-9 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                />
                                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="mb-8">
                            <label className="block text-xs font-bold text-muted-foreground uppercase mb-3">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as AuctionCategory)}
                                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm cursor-pointer"
                            >
                                <option value="All">All Categories</option>
                                {categories.filter(c => c !== 'All').map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div className="mb-8">
                            <label className="block text-xs font-bold text-muted-foreground uppercase mb-3">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as AuctionStatus)}
                                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm cursor-pointer"
                            >
                                <option value="ALL">All Statuses</option>
                                {auctionStatuses.filter(s => s !== 'ALL').map((stat) => (
                                    <option key={stat} value={stat}>{stat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range Slider */}
                        <div className="mb-2">
                            <label className="block text-xs font-bold text-muted-foreground uppercase mb-4">
                                Price Range
                            </label>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-mono font-bold text-primary">${priceRange[0].toLocaleString()}</span>
                                <span className="text-muted-foreground px-2">—</span>
                                <span className="text-sm font-mono font-bold text-primary">${priceRange[1].toLocaleString()}</span>
                            </div>
                            
                            <Slider
                                min={0}
                                max={5000000}
                                step={100}
                                value={priceRange}
                                onValueChange={(value) => setPriceRange(value as [number, number])}
                                className="py-4"
                            />
                            
                            <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground/60 mt-2">
                                <span>Min: $0</span>
                                <span>Max: $5M+</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Danh sách đấu giá */}
                <main className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-sm text-muted-foreground">
                            Found <span className="font-bold text-foreground">{totalItems}</span> active auctions
                        </p>
                    </div>

                    {storeLoading ? (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 opacity-50">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-gray-200 rounded-xl aspect-[3/4] animate-pulse" />
                            ))}
                        </div>
                    ) : auctions.length > 0 ? (
                        <>
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {auctions.map((auction: Auction) => (
                                    <AuctionCard key={auction.id} auction={auction} />
                                ))}
                            </div>
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                itemsPerPage={12}
                                onPageChange={setPage}
                            />
                        </>
                    ) : (
                        <div className="bg-card rounded-2xl border-2 border-dashed border-border py-24 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">No matches found</h3>
                            <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
                                Try adjusting your filters or search keywords to find what you're looking for.
                            </p>
                            <button
                                onClick={resetFilters}
                                className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}