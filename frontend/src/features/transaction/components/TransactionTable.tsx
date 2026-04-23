import { ExternalLink } from 'lucide-react';
import { fmtDate, fmtPrice } from '@/libs/utils';
import { TypeIcon } from './TypeIcon';
import { StatusBadge } from './StatusBadge';
import type { Transaction } from '../types';
import { Pagination } from '@/components/common/Pagination';

interface TransactionTableProps {
    transactions: Transaction[];
    loading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
}

export function TransactionTable({ transactions, loading, page, totalPages, onPageChange, totalItems }: TransactionTableProps) {
    if (loading) {
        return (
            <div className="p-8 space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 w-full bg-muted/50 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="py-20 text-center flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground/30"><ExternalLink size={30} /></div>
                <div>
                    <p className="font-bold text-lg">No transactions found</p>
                    <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or making some activity.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-bold tracking-widest border-b">
                            <th className="px-5 py-4">Transaction</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4">Method</th>
                            <th className="px-5 py-4">Date</th>
                            <th className="px-5 py-4 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {transactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-muted/20 transition-colors group">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <TypeIcon type={tx.type} />
                                        <div>
                                            <p className="font-bold text-foreground">TX-{tx.externalId?.slice(-8) || tx.id}</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">{tx.type.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4"><StatusBadge status={tx.transactionStatus} /></td>
                                <td className="px-5 py-4">
                                    <p className="font-medium">{tx.paymentMethod || 'Wallet'}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{tx.paymentStatus}</p>
                                </td>
                                <td className="px-5 py-4 text-muted-foreground">{fmtDate(tx.createdAt)}</td>
                                <td className="px-5 py-4 text-right">
                                    <p className={`font-bold text-base ${['DEPOSIT', 'REFUND'].includes(tx.type) ? 'text-green-600' : 'text-foreground'}`}>
                                        {['DEPOSIT', 'REFUND'].includes(tx.type) ? '+' : '-'}{fmtPrice(tx.amount)}
                                    </p>
                                    {tx.walletBalance != null && <p className="text-[10px] text-muted-foreground mt-0.5">Balance: {fmtPrice(tx.walletBalance)}</p>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={10}
                onPageChange={onPageChange}
            />
        </div>
    );
}
