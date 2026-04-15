import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { AuctionCategory } from "@/features/auction/types/auction";
import { useFilterStore } from "@/features/auction/stores/auctionStore";

const categories: AuctionCategory[] = ['All', 'Art', 'Electronics', 'Fashion', 'Jewelry', 'Media', 'Vehicles', 'Real Estates', 'Sports']

const SearchBar = () => {
    const { search, setSearch, setCategory } = useFilterStore()
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
    const [selectedSearchCategory, setSelectedSearchCategory] = useState('All')


    const handleCategorySelect = (cat: AuctionCategory) => {
        setSelectedSearchCategory(cat)
        setCategory(cat)
        setShowCategoryDropdown(false)
    }
    return (
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="flex w-full items-center rounded-lg border border-border bg-background transition-all focus-within:border-bid focus-within:ring-2 focus-within:ring-bid/20">
                {/* Category Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        className="flex items-center gap-1 border-r border-border px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {selectedSearchCategory}
                        <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    {showCategoryDropdown && (
                        <div className="absolute left-0 top-full mt-1 w-40 rounded-lg border border-border bg-card py-1 shadow-lg z-50">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategorySelect(cat)}
                                    className="flex w-full items-center px-3 py-2 text-sm text-card-foreground hover:bg-accent transition-colors"
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {/* Search Input */}
                <div className="flex flex-1 items-center gap-2 px-3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search auctions..."
                        className="w-full bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                </div>
            </div>
        </div>
    );
}

export default SearchBar;