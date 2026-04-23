import api from "@/libs/axios";
import { useAuthStore } from "@/features/auth/stores/authStore";
import type { PaginatedResponse } from "@/types/pagination";
import type { Auction } from "../types/auction";

export const auctionService = {
    fetchAuctions: async (params?: Record<string, string | number | boolean | undefined>): Promise<PaginatedResponse<Auction>> => {
        const response = await api.get('/auctions', { params });
        return response.data;
    },

    fetchAuctionsById: async (id: number) => {
        const response = await api.get(`/auctions/${id}`);
        return response.data;
    },

    fetchAuctionsByOwnerId: async (userId?: string | number, params?: Record<string, string | number | boolean | undefined>): Promise<PaginatedResponse<Auction>> => {
        const idToFetch = userId || useAuthStore.getState().user?.id;
        const response = await api.get(`/auctions/user/${idToFetch}`, { params, withCredentials: true });
        return response.data;
    },

    createAuction: async (itemId: number, title: string, description: string, startTime: Date, endTime: Date, startingPrice: number, incrementPrice: number, instantBuyPrice: number, mandatoryDeposit: number) => {
        const response = await api.post('/auctions', {
            itemId,
            title,
            description,
            startTime,
            endTime,
            startingPrice,
            incrementPrice,
            instantBuyPrice,
            mandatoryDeposit
        });
        return response.data;
    },

    updateAuction: async (id: number, itemId: number, title: string, description: string, auctionStatus: string, startTime: Date, endTime: Date, startingPrice: number, incrementPrice: number, instantBuyPrice: number, mandatoryDeposit: number) => {
        const ownerId = useAuthStore.getState().user?.id;
        const response = await api.put(`/auctions/${id}`, {
            ownerId,
            itemId,
            title,
            description,
            auctionStatus,
            startTime,
            endTime,
            startingPrice,
            incrementPrice,
            instantBuyPrice,
            mandatoryDeposit
        });
        return response.data;
    },

    deleteAuction: async (id: number) => {
        const response = await api.delete(`/auctions/${id}`);
        return response.data;
    },

    fetchAuctionById: async (id: number | string) => {
        const response = await api.get(`/auctions/${id}`);
        return response.data;
    },

    buyNow: async (id: number | string) => {
        const response = await api.post(`/auctions/${id}/buy`);
        return response.data;
    },

    getDepositStatus: async (auctionId: string) => {
        const response = await api.get(`/transactions/auction/${auctionId}/status`);
        return response.data;
    },
}
