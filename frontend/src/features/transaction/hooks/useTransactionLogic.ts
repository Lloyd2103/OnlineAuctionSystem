import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { transactionService } from '@/features/transaction/api/transactionService';
import type { Transaction } from '@/features/transaction/types';

export type TransactionTab = 'overview' | 'transactions' | 'payments' | 'deposit';

export interface UseTransactionLogicReturn {
    activeTab: TransactionTab;
    setActiveTab: (tab: TransactionTab) => void;
    balance: number;
    transactions: Transaction[];
    loading: boolean;
    refreshing: boolean;
    processing: boolean;
    // Overview statistics
    stats: {
        totalIn: number;
        totalOut: number;
        pendingCount: number;
        totalCount: number;
        recentTransactions: Transaction[];
    };
    // Transaction filtering/pagination
    filter: {
        type: string;
        setType: (type: string) => void;
        status: string;
        setStatus: (status: string) => void;
        search: string;
        setSearch: (search: string) => void;
        page: number;
        setPage: (page: number) => void;
        pageSize: number;
        totalPages: number;
        totalItems: number;
        paginatedTransactions: Transaction[];
    };
    // Forms
    depositAmount: string;
    setDepositAmount: (amt: string) => void;
    withdrawAmount: string;
    setWithdrawAmount: (amt: string) => void;
    payAuctionForm: {
        auctionId: string;
        setAuctionId: (id: string) => void;
        amount: string;
        setAmount: (amt: string) => void;
        method: string;
        setMethod: (method: string) => void;
    };
    // Actions
    fetchData: (silent?: boolean) => Promise<void>;
    handleDeposit: () => Promise<void>;
    handleWithdraw: () => Promise<void>;
    handleAuctionPayment: () => Promise<void>;
    resetFilters: () => void;
    auctionPayments: Transaction[];
    isIncoming: (type: string) => boolean;
}

// const TX_TYPES = ['All', 'DEPOSIT', 'WITHDRAWAL', 'AUCTION_PAYMENT', 'REFUND'];
// const TX_STATUSES = ['All', 'COMPLETED', 'PENDING', 'FAILED'];
const PAYMENT_METHODS = ['Bank Transfer', 'Credit Card', 'Crypto', 'PayPal'];

export function useTransactionLogic(): UseTransactionLogicReturn {
    const { isAuthenticated } = useAuthStore();
    const [searchParams] = useSearchParams();

    const [activeTab, setActiveTab] = useState<TransactionTab>((searchParams.get('tab') as TransactionTab) || 'overview');
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Filters
    const [txType, setTxType] = useState('All');
    const [txStatus, setTxStatus] = useState('All');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 0 });
    const PAGE_SIZE = 10;

    // Deposit / Withdrawal
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');

    // Auction Payment
    const [payAuctionId, setPayAuctionId] = useState(searchParams.get('auctionId') || '');
    const [payAmount, setPayAmount] = useState(searchParams.get('amount') || '');
    const [payMethod, setPayMethod] = useState(PAYMENT_METHODS[0]);

    const fetchData = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            else setRefreshing(true);
            
            const [balData, txData] = await Promise.allSettled([
                transactionService.getWalletBalance(),
                transactionService.getUserTransactions({
                    page,
                    limit: PAGE_SIZE,
                    type: txType === 'All' ? undefined : txType,
                    status: txStatus === 'All' ? undefined : txStatus,
                    search: search || undefined
                }),
            ]);

            if (balData.status === 'fulfilled') setBalance(balData.value?.balance ?? 0);
            if (txData.status === 'fulfilled') {
                const response = txData.value;
                setTransactions(response.data || []);
                setPagination({
                    totalItems: response.totalItems,
                    totalPages: response.totalPages
                });
            }
        } catch {
            toast.error('Failed to load wallet data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [page, txType, txStatus, search]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [fetchData, isAuthenticated]);

    const isIncoming = (type: string) => ['DEPOSIT', 'REFUND'].includes(type);

    // Computed Stats
    const stats = useMemo(() => {
        const totalIn = transactions.filter(t => isIncoming(t.type) && t.transactionStatus === 'COMPLETED')
            .reduce((s, t) => s + Number(t.amount), 0);
        const totalOut = transactions.filter(t => !isIncoming(t.type) && t.transactionStatus === 'COMPLETED')
            .reduce((s, t) => s + Number(t.amount), 0);
        const pendingCount = transactions.filter(t => t.transactionStatus === 'PENDING').length;
        const recentTransactions = [...transactions]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);

        return { totalIn, totalOut, pendingCount, totalCount: transactions.length, recentTransactions };
    }, [transactions]);

    useEffect(() => {
        setPage(1);
    }, [txType, txStatus, search]);

    const paginatedTransactions = transactions; // Already paginated from server

    const auctionPayments = useMemo(() =>
        transactions.filter(t => t.auctionId != null && t.type === 'AUCTION_PAYMENT'),
        [transactions]);

    const resetFilters = () => {
        setTxType('All');
        setTxStatus('All');
        setSearch('');
        setPage(1);
    };

    // Actions
    const handleDeposit = async () => {
        const amt = parseFloat(depositAmount);
        if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return; }
        try {
            setProcessing(true);
            await transactionService.createDeposit(amt);
            toast.success('Deposit successful');
            setDepositAmount('');
            fetchData(true);
        } catch (error) {
            console.error(error);
            toast.error('Deposit failed');
        } finally { setProcessing(false); }
    };

    const handleWithdraw = async () => {
        const amt = parseFloat(withdrawAmount);
        if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return; }
        if (amt > balance) { toast.error('Insufficient balance'); return; }
        try {
            setProcessing(true);
            await transactionService.createWithdrawal(amt);
            toast.success('Withdrawal initiated');
            setWithdrawAmount('');
            fetchData(true);
        } catch (error) {
            console.error(error);
            toast.error('Withdrawal failed');
        } finally { setProcessing(false); }
    };

    const handleAuctionPayment = async () => {
        const auctionId = parseInt(payAuctionId);
        const amount = parseFloat(payAmount);
        if (!auctionId || isNaN(auctionId)) { toast.error('Enter valid auction ID'); return; }
        if (!amount || amount <= 0) { toast.error('Enter valid amount'); return; }
        try {
            setProcessing(true);
            await transactionService.createAuctionPayment(auctionId, amount, payMethod);
            toast.success('Auction payment submitted!');
            setPayAuctionId(''); setPayAmount('');
            fetchData(true);
        } catch (error) {
            console.error(error);
            toast.error('Payment failed');
        } finally { setProcessing(false); }
    };

    return {
        activeTab, setActiveTab,
        balance, transactions,
        loading, refreshing, processing,
        stats,
        filter: {
            type: txType, setType: setTxType,
            status: txStatus, setStatus: setTxStatus,
            search, setSearch,
            page, setPage,
            pageSize: PAGE_SIZE,
            totalPages: pagination.totalPages,
            totalItems: pagination.totalItems,
            paginatedTransactions
        },
        depositAmount, setDepositAmount,
        withdrawAmount, setWithdrawAmount,
        payAuctionForm: {
            auctionId: payAuctionId, setAuctionId: setPayAuctionId,
            amount: payAmount, setAmount: setPayAmount,
            method: payMethod, setMethod: setPayMethod
        },
        fetchData,
        handleDeposit, handleWithdraw, handleAuctionPayment,
        resetFilters,
        auctionPayments,
        isIncoming
    };
}
