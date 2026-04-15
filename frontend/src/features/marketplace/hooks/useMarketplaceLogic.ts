import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { auctionService } from '../../auction/api/auctionService'; // Import from auction feature API
import { toast } from 'sonner';
import type { AuctionListItem, MarketplaceFilters } from '../types';

export interface UseMarketplaceLogicReturn {
    auctions: AuctionListItem[];
    isLoading: boolean;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    page: number;
    setPage: (page: number | ((p: number) => number)) => void;
    hasMore: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filters: MarketplaceFilters;
    setFilters: (filters: MarketplaceFilters | ((prev: MarketplaceFilters) => MarketplaceFilters)) => void;
    handleSearch: (e: React.FormEvent) => void;
    handleClearFilters: () => void;
    fetchAuctions: () => Promise<void>;
}

export function useMarketplaceLogic(): UseMarketplaceLogicReturn {
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [auctions, setAuctions] = useState<AuctionListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [filters, setFilters] = useState<MarketplaceFilters>({
        minPrice: 0,
        maxPrice: 10000,
        status: 'HAPPENING',
        sortBy: 'ending-soon',
    });

    const fetchAuctions = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await auctionService.fetchAuctions({
                search: searchQuery,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                status: filters.status as any,
                sortBy: filters.sortBy,
                page,
                limit: 12,
            });
            
            if (page === 1) {
                setAuctions(data.data || []);
            } else {
                setAuctions(prev => [...prev, ...(data.data || [])]);
            }
            setHasMore(data.hasMore || false);
        } catch (error) {
            console.error('Failed to fetch auctions:', error);
            toast.error('Failed to load auctions');
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, filters, page]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, filters]);

    useEffect(() => {
        fetchAuctions();
    }, [fetchAuctions]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setFilters({
            minPrice: 0,
            maxPrice: 10000,
            status: 'HAPPENING',
            sortBy: 'ending-soon',
        });
        setPage(1);
    };

    return {
        auctions,
        isLoading,
        viewMode, setViewMode,
        page, setPage,
        hasMore,
        searchQuery, setSearchQuery,
        filters, setFilters,
        handleSearch,
        handleClearFilters,
        fetchAuctions
    };
}
