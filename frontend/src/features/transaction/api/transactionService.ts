import api from "@/lib/axios";

export const transactionService = {
    getWalletBalance: async (): Promise<{ balance: number }> => {
        const response = await api.get('/transactions/balance');
        return response.data;
    },

    getUserTransactions: async (params?: { page?: number; type?: string; status?: string }) => {
        const response = await api.get('/transactions/history', { params });
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

    payDeposit: async (auctionId: number) => {
        const response = await api.post(`/transactions/auction/deposit/${auctionId}`);
        return response.data;
    },

    createAuctionPayment: async (auctionId: number, amount: number, paymentMethod: string) => {
        const response = await api.post('/transactions', {
            auctionId,
            type: 'AUCTION_PAYMENT',
            amount,
            paymentMethod,
        });
        return response.data;
    },
};
