import { ArrowUpRight, ArrowDownLeft, Clock, Activity } from 'lucide-react';
import { fmtPrice } from '@/libs/utils';
import { StatCard } from './StatCard';
import { TransactionTable } from './TransactionTable';
import type { Transaction } from '../types';

interface OverviewTabProps {
    stats: {
        totalIn: number;
        totalOut: number;
        pendingCount: number;
        totalCount: number;
        recentTransactions: Transaction[];
    };
    loading: boolean;
}

export function OverviewTab({ stats, loading }: OverviewTabProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Inflow"
                    value={fmtPrice(stats.totalIn)}
                    icon={<ArrowDownLeft size={18} />}
                    trend="up"
                    subValue="Deposits & Refunds"
                />
                <StatCard
                    label="Total Outflow"
                    value={fmtPrice(stats.totalOut)}
                    icon={<ArrowUpRight size={18} />}
                    trend="down"
                    subValue="Withdrawals & Payments"
                />
                <StatCard
                    label="Pending Actions"
                    value={String(stats.pendingCount)}
                    icon={<Clock size={18} />}
                    subValue="Awaiting verification"
                />
                <StatCard
                    label="Total Transactions"
                    value={String(stats.totalCount)}
                    icon={<Activity size={18} />}
                    subValue="All wallet activity"
                />
            </div>

            <div className="bg-card rounded-2xl border overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b flex items-center justify-between">
                    <h2 className="font-bold text-base">Recent Activity</h2>
                </div>
                <TransactionTable
                    transactions={stats.recentTransactions}
                    loading={loading}
                    page={1}
                    pageCount={1}
                    onPageChange={() => { }}
                    totalResults={stats.recentTransactions.length}
                />
            </div>
        </div>
    );
}
