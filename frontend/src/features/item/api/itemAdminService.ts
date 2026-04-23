import api from "@/libs/axios";
import type { Item } from "@/features/item/types";
import type { PaginatedResponse } from "@/types/pagination";

export const itemAdminService = {
    getAllItems: async (params?: Record<string, string | number | boolean | undefined>): Promise<PaginatedResponse<Item>> => {
        const response = await api.get('/items/all', { params });
        return response.data;
    },

    updateItemStatus: async (itemId: number, status: 'pending' | 'approved' | 'rejected' | 'available'): Promise<{ message: string }> => {
        const response = await api.put(`/items/${itemId}/status`, { status });
        return response.data;
    }
};
