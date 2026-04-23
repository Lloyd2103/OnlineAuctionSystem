import api from "@/libs/axios";
import type { PaginatedResponse } from "@/types/pagination";

export interface AdminUser {
    id: number;
    userName: string;
    userEmail: string;
    userPhone: string;
    userAddress: string;
    userStatus: 'active' | 'banned' | 'pending';
    identifiedStatus: string;
    userImage: string | null;
    walletBalance: number;
    ratingScore: number;
    ratingCount: number;
    createdAt: string;
}

export const userAdminService = {
    getAllUsers: async (params?: Record<string, string | number | boolean>): Promise<PaginatedResponse<AdminUser>> => {
        const response = await api.get('/users', { params });
        return response.data;
    },

    updateUserStatus: async (userId: number, status: string): Promise<{ userStatus: string; message: string }> => {
        const response = await api.patch(`/users/${userId}/status`, { status });
        return response.data;
    },

    submitRating: async (targetUserId: number, rating: number): Promise<void> => {
        await api.post(`/users/rating/${targetUserId}`, { rating });
    },

    updateUserRole: async (userId: number, role: 'unidentified' | 'admin'): Promise<{ identifiedStatus: string; message: string }> => {
        const response = await api.patch(`/users/${userId}/role`, { role });
        return response.data;
    },
};
