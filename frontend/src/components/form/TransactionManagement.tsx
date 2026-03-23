import { useState, useEffect, useCallback } from 'react';
import {
    Wallet, TrendingUp, TrendingDown, ArrowDownToLine, ArrowUpFromLine,
    RefreshCw, Loader2, CreditCard, Gavel, DollarSign, Search,
    CheckCircle, Clock, XCircle, ChevronLeft, ChevronRight, Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { transactionService } from '@/services/transactionService';
import type { Transaction } from '@/types/transaction';

// ─── helpers ────────────────────────────────────────────────────────────────

function fmtPrice(n: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);
}
function fmtDate(s: string) {
    return new Date(s).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const TX_TYPES = ['All', 'DEPOSIT', 'WITHDRAWAL', 'AUCTION_PAYMENT', 'REFUND'];
const TX_STATUSES = ['All', 'COMPLETED', 'PENDING', 'FAILED'];
const PAYMENT_METHODS = ['Bank Transfer', 'Credit Card', 'Crypto', 'PayPal'];

// ─── sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { cls: string; icon: React.ReactNode }> = {
        COMPLETED: { cls: 'bg-green-500/10 text-green-600 border-green-500/20', icon: <CheckCircle size={11} /> },
        PENDING: { cls: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: <Clock size={11} /> },
        FAILED: { cls: 'bg-red-500/10 text-red-600 border-red-500/20', icon: <XCircle size={11} /> },
    };
    const { cls, icon } = map[status] ?? { cls: 'bg-muted text-muted-foreground border-border', icon: null };
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}>
            {icon} {status}
        </span>
    );
}

function TypeIcon({ type }: { type: string }) {
    const map: Record<string, React.ReactNode> = {
        DEPOSIT: <TrendingUp size={14} className="text-green-500" />,
        REFUND: <TrendingUp size={14} className="text-emerald-500" />,
        WITHDRAWAL: <TrendingDown size={14} className="text-red-500" />,
        AUCTION_PAYMENT: <Gavel size={14} className="text-blue-500" />,
    };
    return <span className="inline-flex">{map[type] ?? <DollarSign size={14} className="text-muted-foreground" />}</span>;
}

function isIncoming(type: string) { return ['DEPOSIT', 'REFUND'].includes(type); }

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
    return (
        <div className={`rounded-2xl border p-5 bg-card flex items-start gap-4 hover:shadow-md transition-shadow`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
            <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-xl font-bold mt-0.5">{value}</p>
            </div>
        </div>
    );
}

// ─── Quick Amount buttons ─────────────────────────────────────────────────────

const QUICK_AMOUNTS = [50, 100, 250, 500, 1000];

// ═══════════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════════

type Tab = 'overview' | 'transactions' | 'payments' | 'deposit';

export function TransactionManagement() {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Filters (transactions tab)
    const [txType, setTxType] = useState('All');
    const [txStatus, setTxStatus] = useState('All');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;

    // Deposit / Withdrawal
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [processing, setProcessing] = useState(false);

    // Auction Payment
    const [payAuctionId, setPayAuctionId] = useState('');
    const [payAmount, setPayAmount] = useState('');
    const [payMethod, setPayMethod] = useState(PAYMENT_METHODS[0]);

    const fetchData = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            else setRefreshing(true);
            const [balData, txData] = await Promise.allSettled([
                transactionService.getWalletBalance(),
                transactionService.getUserTransactions({ limit: 100 }),
            ]);
            if (balData.status === 'fulfilled') setBalance(balData.value?.balance ?? 0);
            if (txData.status === 'fulfilled') {
                const list = txData.value;
                setTransactions(Array.isArray(list) ? list : (list?.data ?? list?.transactions ?? []));
            }
        } catch {
            toast.error('Failed to load wallet data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ── Computed stats ──
    const totalIn = transactions.filter(t => isIncoming(t.type) && t.transactionStatus === 'COMPLETED')
        .reduce((s, t) => s + Number(t.amount), 0);
    const totalOut = transactions.filter(t => !isIncoming(t.type) && t.transactionStatus === 'COMPLETED')
        .reduce((s, t) => s + Number(t.amount), 0);
    const pending = transactions.filter(t => t.transactionStatus === 'PENDING').length;

    // ── Filtered transactions ──
    const filtered = transactions.filter(t => {
        const matchType = txType === 'All' || t.type === txType;
        const matchStatus = txStatus === 'All' || t.transactionStatus === txStatus;
        const matchSearch = !search || String(t.id).includes(search) ||
            String(t.auctionId ?? '').includes(search) ||
            (t.paymentMethod ?? '').toLowerCase().includes(search.toLowerCase());
        return matchType && matchStatus && matchSearch;
    });

    const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Auction payments only
    const auctionPayments = transactions.filter(t => t.auctionId != null && t.type === 'AUCTION_PAYMENT');

    // recent 5 for overview
    const recent5 = [...transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

    // ── Actions ──
    const handleDeposit = async () => {
        const amt = parseFloat(depositAmount);
        if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return; }
        try {
            setProcessing(true);
            await transactionService.createDeposit(amt);
            toast.success(`Deposited ${fmtPrice(amt)} successfully`);
            setDepositAmount('');
            fetchData(true);
        } catch (e: unknown) {
            const msg = e && typeof e === 'object' && 'response' in e
                ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
                : undefined;
            toast.error(msg ?? 'Deposit failed');
        } finally { setProcessing(false); }
    };

    const handleWithdraw = async () => {
        const amt = parseFloat(withdrawAmount);
        if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return; }
        if (amt > balance) { toast.error('Insufficient balance'); return; }
        try {
            setProcessing(true);
            await transactionService.createWithdrawal(amt);
            toast.success(`Withdrawal of ${fmtPrice(amt)} initiated`);
            setWithdrawAmount('');
            fetchData(true);
        } catch (e: unknown) {
            const msg = e && typeof e === 'object' && 'response' in e
                ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
                : undefined;
            toast.error(msg ?? 'Withdrawal failed');
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
        } catch (e: unknown) {
            const msg = e && typeof e === 'object' && 'response' in e
                ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
                : undefined;
            toast.error(msg ?? 'Payment failed');
        } finally { setProcessing(false); }
    };

    const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
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

            {/* ═══════════════════════════════════════════════
                TAB: OVERVIEW
            ═══════════════════════════════════════════════ */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Total In" value={fmtPrice(totalIn)} color="bg-green-500/10"
                            icon={<TrendingUp size={18} className="text-green-600" />} />
                        <StatCard label="Total Out" value={fmtPrice(totalOut)} color="bg-red-500/10"
                            icon={<TrendingDown size={18} className="text-red-600" />} />
                        <StatCard label="Pending" value={`${pending} tx`} color="bg-yellow-500/10"
                            icon={<Clock size={18} className="text-yellow-600" />} />
                        <StatCard label="Total Transactions" value={String(transactions.length)} color="bg-blue-500/10"
                            icon={<ArrowDownToLine size={18} className="text-blue-600" />} />
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-card rounded-2xl border p-5">
                        <h2 className="font-bold text-base mb-4">Recent Activity</h2>
                        {loading ? (
                            <div className="space-y-3">{[...Array(4)].map((_, i) => (
                                <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
                            ))}</div>
                        ) : recent5.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <Wallet size={36} className="mx-auto mb-2 opacity-20" />
                                <p>No transactions yet</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {recent5.map(tx => (
                                    <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isIncoming(tx.type) ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                            <TypeIcon type={tx.type} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold capitalize">{tx.type.replace(/_/g, ' ').toLowerCase()}</p>
                                            <p className="text-xs text-muted-foreground">{fmtDate(tx.createdAt)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-sm ${isIncoming(tx.type) ? 'text-green-600' : 'text-red-600'}`}>
                                                {isIncoming(tx.type) ? '+' : '-'}{fmtPrice(Number(tx.amount))}
                                            </p>
                                            <StatusBadge status={tx.transactionStatus} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════
                TAB: TRANSACTIONS
            ═══════════════════════════════════════════════ */}
            {activeTab === 'transactions' && (
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                        <div className="relative flex-1 min-w-[160px]">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search ID, auction, method…"
                                className="w-full pl-9 pr-3 py-2.5 rounded-lg border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <select
                            value={txType}
                            onChange={(e) => { setTxType(e.target.value); setPage(1); }}
                            className="px-3 py-2.5 rounded-lg border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            {TX_TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <select
                            value={txStatus}
                            onChange={(e) => { setTxStatus(e.target.value); setPage(1); }}
                            className="px-3 py-2.5 rounded-lg border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            {TX_STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <button
                            onClick={() => { setTxType('All'); setTxStatus('All'); setSearch(''); setPage(1); }}
                            className="px-3 py-2.5 rounded-lg border bg-card text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1"
                        >
                            <Filter size={14} /> Reset
                        </button>
                    </div>

                    <div className="bg-card rounded-2xl border overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold">ID</th>
                                        <th className="px-6 py-4 text-left font-semibold">Type</th>
                                        <th className="px-6 py-4 text-left font-semibold">Amount</th>
                                        <th className="px-6 py-4 text-left font-semibold">Status</th>
                                        <th className="px-6 py-4 text-left font-semibold">Method</th>
                                        <th className="px-6 py-4 text-left font-semibold">Auction</th>
                                        <th className="px-6 py-4 text-left font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {loading ? (
                                        <tr><td colSpan={7} className="py-12 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={32} /></td></tr>
                                    ) : paginated.length === 0 ? (
                                        <tr><td colSpan={7} className="py-16 text-center text-muted-foreground">
                                            <ArrowDownToLine size={36} className="mx-auto mb-2 opacity-20" />
                                            <p>No transactions found</p>
                                        </td></tr>
                                    ) : paginated.map(tx => (
                                        <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">#{tx.id}</td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <TypeIcon type={tx.type} />
                                                    <span className="capitalize font-medium">{tx.type.replace(/_/g, ' ').toLowerCase()}</span>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-3.5 font-bold ${isIncoming(tx.type) ? 'text-green-600' : 'text-red-600'}`}>
                                                {isIncoming(tx.type) ? '+' : '-'}{fmtPrice(Number(tx.amount))}
                                            </td>
                                            <td className="px-6 py-3.5"><StatusBadge status={tx.transactionStatus} /></td>
                                            <td className="px-6 py-3.5 text-muted-foreground">{tx.paymentMethod || '—'}</td>
                                            <td className="px-6 py-3.5 text-muted-foreground font-mono text-xs">{tx.auctionId ? `#${tx.auctionId}` : '—'}</td>
                                            <td className="px-6 py-3.5 text-muted-foreground text-xs">{fmtDate(tx.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        {pageCount > 1 && (
                            <div className="px-6 py-3 border-t flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {filtered.length} result{filtered.length !== 1 ? 's' : ''} · Page {page} of {pageCount}
                                </span>
                                <div className="flex gap-1">
                                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                        className="p-2 rounded-lg border hover:bg-muted disabled:opacity-40 transition-colors">
                                        <ChevronLeft size={15} />
                                    </button>
                                    <button onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page === pageCount}
                                        className="p-2 rounded-lg border hover:bg-muted disabled:opacity-40 transition-colors">
                                        <ChevronRight size={15} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════
                TAB: AUCTION PAYMENTS
            ═══════════════════════════════════════════════ */}
            {activeTab === 'payments' && (
                <div className="space-y-5">
                    {/* Payment Form */}
                    <div className="bg-card rounded-2xl border p-5">
                        <h2 className="font-bold text-base mb-4 flex items-center gap-2"><Gavel size={16} className="text-bid" /> Create Auction Payment</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Auction ID</label>
                                <input
                                    type="number"
                                    value={payAuctionId}
                                    onChange={(e) => setPayAuctionId(e.target.value)}
                                    placeholder="e.g. 42"
                                    className="w-full px-3.5 py-2.5 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Amount (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                    <input
                                        type="number"
                                        value={payAmount}
                                        onChange={(e) => setPayAmount(e.target.value)}
                                        placeholder="0.00" min="0" step="0.01"
                                        className="w-full pl-7 pr-3.5 py-2.5 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Payment Method</label>
                                <select
                                    value={payMethod}
                                    onChange={(e) => setPayMethod(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={handleAuctionPayment}
                            disabled={processing}
                            className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bid text-bid-foreground text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
                        >
                            {processing ? <Loader2 size={14} className="animate-spin" /> : <Gavel size={14} />}
                            Submit Payment
                        </button>
                    </div>

                    {/* Auction payments table */}
                    <div className="bg-card rounded-2xl border overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b flex items-center justify-between">
                            <h2 className="font-bold text-base">Auction Payment History</h2>
                            <span className="text-xs text-muted-foreground">{auctionPayments.length} payment{auctionPayments.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold">TX ID</th>
                                        <th className="px-6 py-3 text-left font-semibold">Auction</th>
                                        <th className="px-6 py-3 text-left font-semibold">Amount</th>
                                        <th className="px-6 py-3 text-left font-semibold">Method</th>
                                        <th className="px-6 py-3 text-left font-semibold">Status</th>
                                        <th className="px-6 py-3 text-left font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {loading ? (
                                        <tr><td colSpan={6} className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={28} /></td></tr>
                                    ) : auctionPayments.length === 0 ? (
                                        <tr><td colSpan={6} className="py-14 text-center text-muted-foreground">
                                            <Gavel size={32} className="mx-auto mb-2 opacity-20" />
                                            <p>No auction payments yet</p>
                                        </td></tr>
                                    ) : auctionPayments.map(tx => (
                                        <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">#{tx.id}</td>
                                            <td className="px-6 py-3.5">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-bid/10 text-bid text-xs font-semibold">
                                                    <Gavel size={11} /> #{tx.auctionId}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 font-bold text-red-600">-{fmtPrice(Number(tx.amount))}</td>
                                            <td className="px-6 py-3.5 text-muted-foreground">{tx.paymentMethod || '—'}</td>
                                            <td className="px-6 py-3.5"><StatusBadge status={tx.transactionStatus} /></td>
                                            <td className="px-6 py-3.5 text-muted-foreground text-xs">{fmtDate(tx.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════
                TAB: DEPOSIT / WITHDRAW
            ═══════════════════════════════════════════════ */}
            {activeTab === 'deposit' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Deposit Card */}
                    <div className="bg-card rounded-2xl border p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <ArrowDownToLine size={18} className="text-green-600" />
                            </div>
                            <div>
                                <h2 className="font-bold text-base">Deposit Money</h2>
                                <p className="text-xs text-muted-foreground">Add funds to your wallet</p>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Amount (USD)</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <input
                                    type="number"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    placeholder="0.00" min="0" step="0.01"
                                    className="w-full pl-8 pr-4 py-3 rounded-xl border bg-background text-lg font-medium outline-none focus:ring-2 focus:ring-green-500/20"
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">Quick amounts</p>
                            <div className="flex flex-wrap gap-2">
                                {QUICK_AMOUNTS.map(a => (
                                    <button
                                        key={a}
                                        onClick={() => setDepositAmount(String(a))}
                                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${depositAmount === String(a) ? 'bg-green-500 text-white border-green-500' : 'hover:bg-muted'}`}
                                    >
                                        ${a}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleDeposit}
                            disabled={processing || !depositAmount}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
                        >
                            {processing ? <Loader2 size={16} className="animate-spin" /> : <ArrowDownToLine size={16} />}
                            Confirm Deposit
                        </button>
                    </div>

                    {/* Withdraw Card */}
                    <div className="bg-card rounded-2xl border p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <ArrowUpFromLine size={18} className="text-red-600" />
                            </div>
                            <div>
                                <h2 className="font-bold text-base">Withdraw Money</h2>
                                <p className="text-xs text-muted-foreground">Available: <span className="font-semibold text-foreground">{fmtPrice(balance)}</span></p>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Amount (USD)</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <input
                                    type="number"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder="0.00" min="0" step="0.01" max={balance}
                                    className="w-full pl-8 pr-4 py-3 rounded-xl border bg-background text-lg font-medium outline-none focus:ring-2 focus:ring-red-500/20"
                                />
                            </div>
                            {parseFloat(withdrawAmount) > balance && (
                                <p className="text-xs text-red-600 mt-1.5">Exceeds available balance</p>
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">Quick amounts</p>
                            <div className="flex flex-wrap gap-2">
                                {QUICK_AMOUNTS.map(a => (
                                    <button
                                        key={a}
                                        onClick={() => setWithdrawAmount(String(Math.min(a, balance)))}
                                        disabled={a > balance}
                                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all disabled:opacity-30 ${withdrawAmount === String(Math.min(a, balance)) ? 'bg-red-500 text-white border-red-500' : 'hover:bg-muted'}`}
                                    >
                                        ${a}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setWithdrawAmount(String(balance))}
                                    disabled={balance === 0}
                                    className="px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-muted disabled:opacity-30 transition-all"
                                >
                                    Max
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={handleWithdraw}
                            disabled={processing || !withdrawAmount || parseFloat(withdrawAmount) > balance}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-300 text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-60"
                        >
                            {processing ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpFromLine size={16} />}
                            Request Withdrawal
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
