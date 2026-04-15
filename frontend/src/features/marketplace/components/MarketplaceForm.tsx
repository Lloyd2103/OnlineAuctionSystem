import { useState, useMemo, useEffect } from 'react';
import { AuctionCard } from '@/components/module/AuctionCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { useAuctionStore } from '@/features/auction/stores/auctionStore';

const categories = ['Art', 'Electronics', 'Fashion', 'Jewelry', 'Media', 'Vehicles', 'Real Estates', 'Sports'];

export function Marketplace() {
    const { auctions, fetchAllAuctions } = useAuctionStore();

    useEffect(() => {
        fetchAllAuctions();
    }, [fetchAllAuctions]);
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
    const [sortBy, setSortBy] = useState('ending-soon');

    const filteredAuctions = useMemo(() => {
        let filtered = auctions

        // Search filter
        if (searchQuery) {
        filtered = filtered.filter((auction) =>
            auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            auction.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        }

        // Category filter
        if (selectedCategory !== 'All') {
        filtered = filtered.filter((auction) => auction.item?.category === selectedCategory);
        }

        // Price filter
        filtered = filtered.filter(
        (auction) =>
            (auction.currentPrice || 0) >= priceRange[0] && (auction.currentPrice || 0) <= priceRange[1]
        );

        // Sorting
        switch (sortBy) {
        case 'ending-soon':
            filtered.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
            break;
        case 'price-low':
            filtered.sort((a, b) => (a.currentPrice || 0) - (b.currentPrice || 0));
            break;
        case 'price-high':
            filtered.sort((a, b) => (b.currentPrice || 0) - (a.currentPrice || 0));
            break;
        case 'most-bids':
            filtered.sort((a, b) => (b.bids?.length || 0) - (a.bids?.length || 0));
            break;
        }

        return filtered;
    }, [auctions, searchQuery, selectedCategory, priceRange, sortBy]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Marketplace</h1>
            <p className="text-gray-600">Discover and bid on amazing items</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
                <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                </div>

                {/* Search */}
                <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                </label>
                <div className="relative">
                    <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search auctions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                </div>

                {/* Category */}
                <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                </label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="All">All Categories</option>
                    {categories.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                    ))}
                </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                </label>
                <div className="space-y-2">
                    <input
                    type="range"
                    min="0"
                    max="100000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                    />
                    <div className="text-sm text-gray-600">
                    Up to ${priceRange[1].toLocaleString()}
                    </div>
                </div>
                </div>

                {/* Sort By */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                </label>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="ending-soon">Ending Soon</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="most-bids">Most Bids</option>
                </select>
                </div>

                {/* Reset Filters */}
                <button
                onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setPriceRange([0, 100000]);
                    setSortBy('ending-soon');
                }}
                className="w-full mt-6 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                Reset Filters
                </button>
            </div>
            </div>

            {/* Auctions Grid */}
            <div className="lg:col-span-3">
            <div className="mb-4 text-gray-600">
                {filteredAuctions.length} auctions found
            </div>
            {filteredAuctions.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAuctions.map((auction) => (
                    <AuctionCard key={auction.id} auction={auction} />
                ))}
                </div>
            ) : (
                <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No auctions found matching your criteria</p>
                <button
                    onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setPriceRange([0, 100000]);
                    }}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                >
                    Clear filters
                </button>
                </div>
            )}
            </div>
        </div>
        </div>
    );
}
