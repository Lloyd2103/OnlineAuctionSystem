import { Search, Filter } from 'lucide-react';
import { TransactionTable } from './TransactionTable';
import type { Transaction } from '../types';

const TX_TYPES = ['All', 'DEPOSIT', 'WITHDRAWAL', 'AUCTION_PAYMENT', 'REFUND'];
const TX_STATUSES = ['All', 'COMPLETED', 'PENDING', 'FAILED'];

interface TransactionsTabProps {
    transactions: Transaction[];
    loading: boolean;
    filter: {
        type: string;
        setType: (type: string) => void;
        status: string;
        setStatus: (status: string) => void;
        search: string;
        setSearch: (search: string) => void;
        page: number;
        setPage: (page: number) => void;
        pageCount: number;
    };
    totalResults: number;
    onReset: () => void;
}

export function TransactionsTab({ 
    transactions, 
    loading, 
    filter, 
    totalResults,
    onReset
}: TransactionsTabProps) {
    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[160px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={filter.search}
                        onChange={(e) => filter.setSearch(e.target.value)}
                        placeholder="Search ID, auction, method…"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <select
                    value={filter.type}
                    onChange={(e) => filter.setType(e.target.value)}
                    className="px-3 py-2.5 rounded-lg border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                    {TX_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select
                    value={filter.status}
                    onChange={(e) => filter.setStatus(e.target.value)}
                    className="px-3 py-2.5 rounded-lg border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                    {TX_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                    onClick={onReset}
                    className="px-3 py-2.5 rounded-lg border bg-card text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1"
                >
                    <Filter size={14} /> Reset
                </button>
            </div>

            <TransactionTable 
                transactions={transactions} 
                loading={loading}
                page={filter.page}
                pageCount={filter.pageCount}
                onPageChange={filter.setPage}
                totalResults={totalResults}
            />
        </div>
    );
}
