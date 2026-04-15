import { create } from 'zustand'
import { toast } from 'sonner'
import type { FilterState } from '@/features/auction/types/auction'
import type { AuctionState } from '@/features/auction/types/auction'
import { auctionService } from '@/features/auction/api/auctionService'
import type { Auction } from '@/features/auction/types/auction';



export const useFilterStore = create<FilterState>((set) => ({
    search: '',
    category: 'All',
    status: 'ALL',
    priceRange: [0, 50000],
    setSearch: (search) => set({ search }),
    setCategory: (category) => set({ category }),
    setStatus: (status) => set({ status }),
    setPriceRange: (priceRange) => set({ priceRange }),
    resetFilters: () =>
        set({ search: '', category: 'All', status: 'ALL', priceRange: [0, 50000] }),
}))


export const useAuctionStore = create<AuctionState>((set) => ({
    currentAuction: null,
    auctions: [],
    endingSoonAuctions: [],
    newlyListedAuctions: [],
    loading: false,

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
            const data = await auctionService.fetchAuctions();
            const allAuctions = Array.isArray(data) ? data : (data?.auctions ?? []);

            // 1. Sắp xếp hoặc lọc cho "Ending Soon" (Ví dụ: còn dưới 24h)
            const now = new Date().getTime();
            const endingSoon = allAuctions
                .filter((a: Auction) => {
                    const end = new Date(a.endTime).getTime();
                    return end > now && (end - now) < 24 * 60 * 60 * 1000; // Còn dưới 24 tiếng
                })
                .sort((a: Auction, b: Auction) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());

            // 2. Sắp xếp cho "Newly Listed" (Mới tạo gần đây)
            const newlyListed = [...allAuctions].sort(
                (a: Auction, b: Auction) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ).slice(0, 4); // Lấy 4 cái mới nhất

            set({
                auctions: allAuctions,
                endingSoonAuctions: endingSoon,
                newlyListedAuctions: newlyListed
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to load auctions');
        } finally {
            set({ loading: false });
        }
    },
}))

