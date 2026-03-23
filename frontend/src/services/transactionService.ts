import api from "@/lib/axios";
import type { TransactionCreateRequest } from "@/types/transaction";

export const transactionService = {
    getWalletBalance: async (): Promise<{ balance: number }> => {
        const response = await api.get('/transactions/balance');
        return response.data;
    },

    getUserTransactions: async (params?: { page?: number; limit?: number; type?: string; status?: string }) => {
        const response = await api.get('/transactions', { params });
        return response.data;
    },

    createDeposit: async (amount: number) => {
        const response = await api.post('/transactions/deposit', { amount });
        return response.data;
    },

    createWithdrawal: async (amount: number) => {
        const response = await api.post('/transactions/withdraw', { amount });
        return response.data;
    },

    createAuctionPayment: async (auctionId: number, amount: number, paymentMethod: string) => {
        const body: TransactionCreateRequest = {
            auctionId,
            type: 'AUCTION_PAYMENT',
            amount,
            paymentMethod,
        };
        const response = await api.post('/transactions', body);
        return response.data;
    },
};
