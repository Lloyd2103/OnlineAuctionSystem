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

export interface TransactionState {
    transactions: Transaction[];
    loading: boolean;
    fetchTransactions: () => Promise<void>;
    createTransaction: (transaction: Transaction) => Promise<void>;
    updateTransaction: (transaction: Transaction) => Promise<void>;
    deleteTransaction: (transaction: Transaction) => Promise<void>;
}

export interface TransactionResponse {
    data: Transaction[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

export interface TransactionCreateRequest {
    auctionId: number;
    type: string;
    amount: number;
    paymentMethod: string;
}

export interface TransactionUpdateRequest {
    id: number;
    auctionId: number;
    type: string;
    amount: number;
    paymentMethod: string;
    paymentStatus: string;
}

export interface TransactionDeleteRequest {
    id: number;
}
