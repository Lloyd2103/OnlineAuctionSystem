export interface Transaction {
    id: number;
    userId: number;
    auctionId: number;
    type: string;
    amount: number;
    transactionStatus: string;
    paymentMethod: string;
    paymentStatus: string;
    walletBalance: number;
    externalId: string;
    createdAt: string;
    updatedAt: string;
}

export interface TransactionResponse {
    data: Transaction[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}
