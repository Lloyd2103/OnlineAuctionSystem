import { create } from 'zustand'
import { toast } from 'sonner'
import type { FilterState } from '@/features/auction/types/auction'
import type { AuctionState } from '@/features/auction/types/auction'
import { auctionService } from '@/features/auction/api/auctionService'
import type { Auction } from '@/features/auction/types/auction';

export const useFilterStore = create<FilterState & { 
    page: number; 
    setPage: (page: number) => void;
}>((set) => ({
    search: '',
    category: 'All',
    status: 'ALL',
    priceRange: [0, 5000000],
    page: 1,
    setSearch: (search) => set({ search, page: 1 }),
    setCategory: (category) => set({ category, page: 1 }),
    setStatus: (status) => set({ status, page: 1 }),
    setPriceRange: (priceRange: [number, number]) => set({ priceRange, page: 1 }),
    setPage: (page) => set({ page }),
    resetFilters: () => set({ search: '', category: 'All', status: 'ALL', priceRange: [0, 5000000], page: 1 }),
}))


export const useAuctionStore = create<AuctionState & {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    fetchAuctionsPaged: (params?: Record<string, string | number | boolean | undefined>) => Promise<void>;
}>((set) => ({
    currentAuction: null,
    auctions: [],
    endingSoonAuctions: [],
    newlyListedAuctions: [],
    endedAuctions: [],
    liveAuctions: [],
    upcomingAuctions: [],
    loading: false,
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,

    fetchAuctionById: async (id: number) => {
        try {
            set({ loading: true });
            const data = await auctionService.fetchAuctionById(id);

            // Handle possibility of data being wrapped in { auction: ... } or { data: ... }
            const result = data?.auction ?? data?.data ?? data;

            // data ở đây đã bao gồm thông tin item
            set({ currentAuction: result });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch auction details");
        } finally {
            set({ loading: false });
        }
    },

    createAuction: async (itemId: number, title: string, description: string, startTime: Date, endTime: Date, startingPrice: number, incrementPrice: number, instantBuyPrice: number, mandatoryDeposit: number) => {
        try {
            set({ loading: true });
            const { auctions } = await auctionService.createAuction(itemId, title, description, startTime, endTime, startingPrice, incrementPrice, instantBuyPrice, mandatoryDeposit);
            set({ auctions });
            toast.success("Auction created successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Auction creation failed. Please try again.");
        } finally {
            set({ loading: false });
        }
    },

    updateAuction: async (id: number, itemId: number, title: string, description: string, auctionStatus: string, startTime: Date, endTime: Date, startingPrice: number, incrementPrice: number, instantBuyPrice: number, mandatoryDeposit: number) => {
        try {
            set({ loading: true });
            const { auctions } = await auctionService.updateAuction(id, itemId, title, description, auctionStatus, startTime, endTime, startingPrice, incrementPrice, instantBuyPrice, mandatoryDeposit);
            set({ auctions });
            toast.success("Auction updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Auction update failed. Please try again.");
        } finally {
            set({ loading: false });
        }
    },

    deleteAuction: async (id: number) => {
        try {
            set({ loading: true });
            await auctionService.deleteAuction(id);
            toast.success("Auction deleted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Auction deletion failed. Please try again.");
        } finally {
            set({ loading: false });
        }
    },

    // stores/auctionStore.ts
    fetchAllAuctions: async () => {
        try {
            set({ loading: true });
            const result = await auctionService.fetchAuctions();
            const allAuctions = result.data;
            // ... (keeping existing frontend filtering for compatibility if needed)
            const now = new Date().getTime();
            const endingSoon = allAuctions.filter((a: Auction) => {
                const end = new Date(a.endTime).getTime();
                return end > now && (end - now) < 24 * 60 * 60 * 1000;
            }).sort((a: Auction, b: Auction) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());

            const newlyListed = [...allAuctions].sort(
                (a: Auction, b: Auction) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ).slice(0, 4);
            
            const endedAuctions = allAuctions.filter((a: Auction) => new Date(a.endTime).getTime() < now)
                .sort((a: Auction, b: Auction) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime());
            
            const liveAuctions = allAuctions
                .filter((a: Auction) => {
                    const start = new Date(a.startTime).getTime();
                    const end = new Date(a.endTime).getTime();
                    
                    return (
                    a.auctionStatus === 'ACTIVE' && 
                    start < now && 
                    end > now
                    );
                })
                .sort((a: Auction, b: Auction) => 
                    new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
                );
            
            const upcomingAuctions = allAuctions.filter((a: Auction) => new Date(a.startTime).getTime() > now)
                .sort((a: Auction, b: Auction) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

            set({
                auctions: allAuctions,
                endingSoonAuctions: endingSoon,
                newlyListedAuctions: newlyListed,
                endedAuctions: endedAuctions,
                liveAuctions: liveAuctions,
                upcomingAuctions: upcomingAuctions,
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to load auctions');
        } finally {
            set({ loading: false });
        }
    },

    fetchAuctionsPaged: async (params = {}) => {
        try {
            set({ loading: true });
            const result = await auctionService.fetchAuctions(params);
            set({
                auctions: result.data,
                totalItems: result.totalItems,
                totalPages: result.totalPages,
                currentPage: result.currentPage
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to load auctions');
        } finally {
            set({ loading: false });
        }
    }
}))

