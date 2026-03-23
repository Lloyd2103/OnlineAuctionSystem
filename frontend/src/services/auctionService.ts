import api from "@/lib/axios";
import { useAuthStore } from "@/stores/authStore";

export const auctionService = {

    fetchAuctions: async () => {
        const response = await api.get('/auctions');
        // Trả về mảng đã được backend JOIN sẵn item
        return response.data;
    },

    fetchAuctionsById: async (id: number) => {
        const response = await api.get(`/auctions/${id}`);
        return response.data;
    },

    createAuction: async (itemId: number, title:string, description:string,startTime: Date, endTime: Date, startingPrice: number, incrementPrice: number, instantBuyPrice: number, mandatoryDeposit: number) => {
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

    updateAuction: async (id: number, itemId: number, title:string, description:string, auctionStatus: string, startTime: Date, endTime: Date, startingPrice: number, incrementPrice: number, instantBuyPrice: number, mandatoryDeposit: number) => {
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

    deleteAuction: async (auctionId: number) => {
        const response = await api.delete(`/auctions/${auctionId}`);
        return response.data;
    },

    fetchAuctionById: async (auctionId: string) => {
        const response = await api.get(`/auctions/${auctionId}`);
        return response.data;
    },
}