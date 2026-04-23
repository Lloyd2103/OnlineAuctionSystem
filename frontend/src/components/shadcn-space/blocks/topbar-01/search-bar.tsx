import { Search } from "lucide-react";
import { useFilterStore } from "@/features/auction/stores/auctionStore";
import { useLocation, useNavigate } from 'react-router'


const SearchBar = () => {
    const { search, setSearch } = useFilterStore()

    const location = useLocation()
    const navigate = useNavigate()

    return (
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="flex w-full items-center rounded-lg border border-border bg-background transition-all focus-within:border-bid focus-within:ring-2 focus-within:ring-bid/20">
                {/* Search Input */}
                <div className="flex flex-1 items-center gap-2 px-3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && location.pathname === '/') {
                                navigate('/marketplace')
                            }
                        }}
                        placeholder="Search auctions..."
                        className="w-full bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                </div>
            </div>
        </div>
    );
}

export default SearchBar;