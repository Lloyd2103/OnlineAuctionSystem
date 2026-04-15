import { Wallet, RefreshCw } from 'lucide-react';
import { fmtPrice } from '@/lib/utils';
import { OverviewTab } from './OverviewTab';
import { TransactionsTab } from './TransactionsTab';
import { DepositWithdrawCard } from './DepositWithdrawCard';
import { AuctionPaymentForm } from './AuctionPaymentForm';
import { Gavel, CreditCard, ArrowDownToLine } from 'lucide-react';
import { TransactionTable } from './TransactionTable';
import { useTransactionLogic, type TransactionTab } from '../hooks/useTransactionLogic';

export function TransactionManagement() {
    const {
        activeTab, setActiveTab,
        balance,
        loading, refreshing, processing,
        stats,
        filter,
        depositAmount, setDepositAmount,
        withdrawAmount, setWithdrawAmount,
        payAuctionForm,
        fetchData,
        handleDeposit, handleWithdraw, handleAuctionPayment,
        resetFilters,
        auctionPayments
    } = useTransactionLogic();

    const TABS: { id: TransactionTab; label: string; icon: React.ReactNode }[] = [
        { id: 'overview', label: 'Overview', icon: <Wallet size={15} /> },
        { id: 'transactions', label: 'Transactions', icon: <ArrowDownToLine size={15} /> },
        { id: 'payments', label: 'Auction Payments', icon: <Gavel size={15} /> },
        { id: 'deposit', label: 'Deposit / Withdraw', icon: <CreditCard size={15} /> },
    ];

    return (
        <div className="p-6 bg-background min-h-screen max-w-7xl mx-auto">
            {/* ── Page Header ────────────────────────────────── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                        <Wallet className="w-7 h-7" /> Wallet & Transactions
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your balance, deposits, withdrawals, and payments.</p>
                </div>
                <button
                    onClick={() => fetchData(true)}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium hover:bg-muted transition-colors"
                >
                    <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            {/* ── Balance Banner ────────────────────────────── */}
            <div className="relative rounded-2xl overflow-hidden mb-6 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
                <div className="relative px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-white/70 text-sm font-medium uppercase tracking-wider">Available Balance</p>
                        {loading ? (
                            <div className="mt-2 h-10 w-48 rounded-lg bg-white/10 animate-pulse" />
                        ) : (
                            <p className="text-4xl font-bold text-white mt-1">{fmtPrice(balance)}</p>
                        )}
                        <p className="text-white/60 text-xs mt-1.5">Ready for bidding and payments</p>
                    </div>
                    <Wallet className="w-20 h-20 text-white/10" />
                </div>
            </div>

            {/* ── Tabs ─────────────────────────────────────── */}
            <div className="flex gap-1.5 bg-muted/50 rounded-xl p-1 mb-6 overflow-x-auto">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                            activeTab === tab.id
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && <OverviewTab stats={stats} loading={loading} />}

            {activeTab === 'transactions' && (
                <TransactionsTab 
                    transactions={filter.paginatedTransactions}
                    loading={loading}
                    filter={filter}
                    totalResults={stats.totalCount}
                    onReset={resetFilters}
                />
            )}

            {activeTab === 'payments' && (
                <div className="space-y-5">
                    <AuctionPaymentForm 
                        auctionId={payAuctionForm.auctionId}
                        onAuctionIdChange={payAuctionForm.setAuctionId}
                        amount={payAuctionForm.amount}
                        onAmountChange={payAuctionForm.setAmount}
                        method={payAuctionForm.method}
                        onMethodChange={payAuctionForm.setMethod}
                        onSubmit={handleAuctionPayment}
                        processing={processing}
                    />
                    <div className="bg-card rounded-2xl border overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b flex items-center justify-between">
                            <h2 className="font-bold text-base">Auction Payment History</h2>
                            <span className="text-xs text-muted-foreground">{auctionPayments.length} payment{auctionPayments.length !== 1 ? 's' : ''}</span>
                        </div>
                        <TransactionTable 
                            transactions={auctionPayments}
                            loading={loading}
                            page={1}
                            pageCount={1}
                            onPageChange={() => {}}
                            totalResults={auctionPayments.length}
                        />
                    </div>
                </div>
            )}

            {activeTab === 'deposit' && (
                <DepositWithdrawCard 
                    balance={balance}
                    depositAmount={depositAmount}
                    onDepositAmountChange={setDepositAmount}
                    withdrawAmount={withdrawAmount}
                    onWithdrawAmountChange={setWithdrawAmount}
                    onDeposit={handleDeposit}
                    onWithdraw={handleWithdraw}
                    processing={processing}
                />
            )}
        </div>
    );
}
