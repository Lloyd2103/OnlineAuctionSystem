import { Search, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { MarketplaceFilters } from '../types';

interface FilterSidebarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    filters: MarketplaceFilters;
    onFiltersChange: (filters: MarketplaceFilters | ((prev: MarketplaceFilters) => MarketplaceFilters)) => void;
    onSearch: (e: React.FormEvent) => void;
    onClear: () => void;
}

export function FilterSidebar({
    searchQuery,
    onSearchChange,
    filters,
    onFiltersChange,
    onSearch,
    onClear
}: FilterSidebarProps) {
    return (
        <Card className="sticky top-24">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Filter size={20} /> Filters
                    </span>
                    <Button variant="ghost" size="sm" onClick={onClear} className="text-xs h-8">
                        Reset
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={onSearch} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="search">Search</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                            <Input
                                id="search"
                                placeholder="Item name..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                            value={filters.status}
                            onValueChange={(v) => onFiltersChange(prev => ({ ...prev, status: v as any }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="HAPPENING">Live Now</SelectItem>
                                <SelectItem value="UPCOMING">Upcoming</SelectItem>
                                <SelectItem value="FINISHED">Ended</SelectItem>
                                <SelectItem value="ALL">All Status</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Sort By</Label>
                        <Select
                            value={filters.sortBy}
                            onValueChange={(v) => onFiltersChange(prev => ({ ...prev, sortBy: v }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ending-soon">Ending Soon</SelectItem>
                                <SelectItem value="newest">Recently Listed</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                                <SelectItem value="most-bids">Most Popular</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Price Range</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={filters.minPrice}
                                onChange={(e) => onFiltersChange(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                            />
                            <Input
                                type="number"
                                placeholder="Max"
                                value={filters.maxPrice}
                                onChange={(e) => onFiltersChange(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Apply Filters
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
