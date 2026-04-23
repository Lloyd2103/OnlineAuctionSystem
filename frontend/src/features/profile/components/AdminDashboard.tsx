import { useState, useEffect, useCallback } from 'react';
import { Navigate, Link } from 'react-router';
import { useAuthStore } from '@/features/auth/stores/authStore';
import {
    LayoutDashboard,
    Package,
    Gavel,
    DollarSign,
    Users,
    Plus,
    Eye,
    RefreshCw,
    TrendingUp,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/libs/utils';
import { toast } from 'sonner';
import { useAuctionStore } from '@/features/auction/stores/auctionStore';
import { auctionService } from '../../auction/api/auctionService';
import { userAdminService, type AdminUser } from '../api/userAdminService';
import { itemAdminService } from '../../item/api/itemAdminService';
import { transactionService } from '../../transaction/api/transactionService';
import type { Transaction } from '../../transaction/types';
import type { Item } from '../../item/types/item';
import type { Auction } from '../../auction/types/auction';
import { Pagination } from '@/components/common/Pagination';


type Tab = 'overview' | 'items' | 'auctions' | 'transactions' | 'users';
type IdentifiedStatus = 'unidentified' | 'admin';

export function AdminDashboard() {
    const { user, isAuthenticated } = useAuthStore();
    const { auctions } = useAuctionStore();
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    const [adminUsersPage, setAdminUsersPage] = useState(1);
    const [adminItemsPage, setAdminItemsPage] = useState(1);
    const [adminAuctionsPage, setAdminAuctionsPage] = useState(1);
    const [adminTransactionsPage, setAdminTransactionsPage] = useState(1);

    const [usersMeta, setUsersMeta] = useState({ totalItems: 0, totalPages: 0 });
    const [itemsMeta, setItemsMeta] = useState({ totalItems: 0, totalPages: 0 });
    const [auctionsMeta, setAuctionsMeta] = useState({ totalItems: 0, totalPages: 0 });
    const [transactionsMeta, setTransactionsMeta] = useState({ totalItems: 0, totalPages: 0 });

    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
    const [adminItems, setAdminItems] = useState<Item[]>([]);
    const [adminAuctions, setAdminAuctions] = useState<Auction[]>([]);
    const [adminTransactions, setAdminTransactions] = useState<Transaction[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingItems, setLoadingItems] = useState(false);
    const [loadingAuctions, setLoadingAuctions] = useState(false);
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

    const startProcessing = (id: number) => setProcessingIds(prev => new Set(prev).add(id));
    const stopProcessing = (id: number) => setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
    });

    const loadUsers = useCallback(async (page = adminUsersPage) => {
        setLoadingUsers(true);
        try {
            const result = await userAdminService.getAllUsers({ page, limit: 10 });
            setAdminUsers(result.data);
            setUsersMeta({ totalItems: result.totalItems, totalPages: result.totalPages });
        } catch (error) {
            console.error('Failed to load users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoadingUsers(false);
        }
    }, [adminUsersPage]);

    const loadItems = useCallback(async (page = adminItemsPage) => {
        setLoadingItems(true);
        try {
            const result = await itemAdminService.getAllItems({ page, limit: 10 });
            setAdminItems(result.data);
            setItemsMeta({ totalItems: result.totalItems, totalPages: result.totalPages });
        } catch (error) {
            console.error('Failed to load items:', error);
            toast.error('Failed to load items');
        } finally {
            setLoadingItems(false);
        }
    }, [adminItemsPage]);

    const loadAuctions = useCallback(async (page = adminAuctionsPage) => {
        setLoadingAuctions(true);
        try {
            const result = await auctionService.fetchAuctions({ page, limit: 10 });
            setAdminAuctions(result.data);
            setAuctionsMeta({ totalItems: result.totalItems, totalPages: result.totalPages });
        } catch (error) {
            console.error('Failed to load auctions:', error);
            toast.error('Failed to load auctions');
        } finally {
            setLoadingAuctions(false);
        }
    }, [adminAuctionsPage]);

    const loadTransactions = useCallback(async (page = adminTransactionsPage) => {
        setLoadingTransactions(true);
        try {
            const result = await transactionService.getAllTransactions({ page, limit: 10 });
            setAdminTransactions(result.data);
            setTransactionsMeta({ totalItems: result.totalItems, totalPages: result.totalPages });
        } catch (error) {
            console.error('Failed to load transactions:', error);
            toast.error('Failed to load transactions');
        } finally {
            setLoadingTransactions(false);
        }
    }, [adminTransactionsPage]);

    // Initial load on mount (admin only)
    useEffect(() => {
        if (isAuthenticated && user?.identifiedStatus === 'admin') {
            loadUsers(1);
            loadAuctions(1);
        }
    }, [isAuthenticated, user, loadUsers, loadAuctions]);

    // Lazy-load per tab/page
    useEffect(() => {
        if (activeTab === 'users') loadUsers(adminUsersPage);
        if (activeTab === 'items') loadItems(adminItemsPage);
        if (activeTab === 'auctions') loadAuctions(adminAuctionsPage);
        if (activeTab === 'transactions') loadTransactions(adminTransactionsPage);
    }, [activeTab, adminUsersPage, adminItemsPage, adminAuctionsPage, adminTransactionsPage, loadUsers, loadItems, loadAuctions, loadTransactions]);

    // Guard: only admin can see this page
    if (!isAuthenticated || user?.identifiedStatus !== 'admin') {
        return <Navigate to="/" />;
    }

    const activeAuctions = auctions.filter((a) => a.auctionStatus === 'ACTIVE').length;
    const pendingItems = adminItems.filter((i) => i.itemStatus === 'pending').length;

    const tabs: { key: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
        { key: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
        { key: 'items', label: 'Items', icon: <Package className="w-4 h-4" />, badge: pendingItems },
        { key: 'auctions', label: 'Auctions', icon: <Gavel className="w-4 h-4" /> },
        { key: 'transactions', label: 'Transactions', icon: <DollarSign className="w-4 h-4" /> },
        { key: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm">Logged in as <span className="font-medium text-purple-600">{user?.userName}</span></p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">Admin</span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={<Gavel className="w-5 h-5 text-blue-600" />} bg="bg-blue-50"
                    value={activeAuctions} label="Active Auctions" />
                <StatCard icon={<TrendingUp className="w-5 h-5 text-green-600" />} bg="bg-green-50"
                    value={auctions.length} label="Total Auctions" />
                <StatCard icon={<Package className="w-5 h-5 text-purple-600" />} bg="bg-purple-50"
                    value={loadingItems ? '…' : adminItems.length} label="Total Items"
                    sub={pendingItems > 0 ? `${pendingItems} pending review` : undefined} subColor="text-yellow-600" />
                <StatCard icon={<Users className="w-5 h-5 text-orange-600" />} bg="bg-orange-50"
                    value={loadingUsers ? '…' : adminUsers.length} label="Total Users" />
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="border-b border-gray-100 overflow-x-auto">
                    <nav className="flex min-w-max">
                        {tabs.map(({ key, label, icon, badge }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`relative px-6 py-4 font-medium transition-all flex items-center gap-2 whitespace-nowrap text-sm ${activeTab === key
                                        ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/30'
                                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                {icon}
                                {label}
                                {badge !== undefined && badge > 0 && (
                                    <span className="ml-1 px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-xs rounded-full font-bold">
                                        {badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && (
                        <OverviewTab
                            auctions={auctions}
                            totalUsers={adminUsers.length}
                            totalTransactions={adminTransactions.length}
                            activeAuctions={activeAuctions}
                        />
                    )}
                    {activeTab === 'items' && (
                        <ItemsTab
                            items={adminItems}
                            loading={loadingItems}
                            onRefresh={() => loadItems(adminItemsPage)}
                            processingIds={processingIds}
                            startProcessing={startProcessing}
                            stopProcessing={stopProcessing}
                            pagination={{
                                currentPage: adminItemsPage,
                                totalPages: itemsMeta.totalPages,
                                totalItems: itemsMeta.totalItems,
                                onPageChange: setAdminItemsPage
                            }}
                        />
                    )}
                    {activeTab === 'auctions' && (
                        <AuctionsTab 
                            auctions={adminAuctions}
                            loading={loadingAuctions}
                            onRefresh={() => loadAuctions(adminAuctionsPage)}
                            pagination={{
                                currentPage: adminAuctionsPage,
                                totalPages: auctionsMeta.totalPages,
                                totalItems: auctionsMeta.totalItems,
                                onPageChange: setAdminAuctionsPage
                            }}
                        />
                    )}
                    {activeTab === 'transactions' && (
                        <TransactionsTab 
                            transactions={adminTransactions} 
                            loading={loadingTransactions} 
                            onRefresh={() => loadTransactions(adminTransactionsPage)}
                            pagination={{
                                currentPage: adminTransactionsPage,
                                totalPages: transactionsMeta.totalPages,
                                totalItems: transactionsMeta.totalItems,
                                onPageChange: setAdminTransactionsPage
                            }}
                        />
                    )}
                    {activeTab === 'users' && (
                        <UsersTab
                            users={adminUsers}
                            loading={loadingUsers}
                            onRefresh={() => loadUsers(adminUsersPage)}
                            processingIds={processingIds}
                            startProcessing={startProcessing}
                            stopProcessing={stopProcessing}
                            pagination={{
                                currentPage: adminUsersPage,
                                totalPages: usersMeta.totalPages,
                                totalItems: usersMeta.totalItems,
                                onPageChange: setAdminUsersPage
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─────────────── Stat Card ─────────────── */
function StatCard({ icon, bg, value, label, sub, subColor }: {
    icon: React.ReactNode; bg: string; value: number | string;
    label: string; sub?: string; subColor?: string;
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>{icon}</div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-gray-500 text-sm mt-0.5">{label}</div>
            {sub && <div className={`text-xs mt-1 font-medium ${subColor}`}>{sub}</div>}
        </div>
    );
}

/* ─────────────── Overview Tab ─────────────── */
function OverviewTab({ auctions, totalUsers, totalTransactions, activeAuctions }: {
    auctions: Auction[]; totalUsers: number; totalTransactions: number; activeAuctions: number;
}) {
    const recentAuctions = [...auctions]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="text-sm text-blue-600 font-medium mb-1">Active Auctions</div>
                    <div className="text-3xl font-bold text-blue-700">{activeAuctions}</div>
                </div>
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                    <div className="text-sm text-orange-600 font-medium mb-1">Registered Users</div>
                    <div className="text-3xl font-bold text-orange-700">{totalUsers}</div>
                </div>
                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                    <div className="text-sm text-green-600 font-medium mb-1">All Transactions</div>
                    <div className="text-3xl font-bold text-green-700">{totalTransactions}</div>
                </div>
            </div>

            {/* Recent auctions */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Recent Auctions</h2>
                {recentAuctions.length === 0 ? (
                    <p className="text-gray-400 text-sm">No auctions yet.</p>
                ) : (
                    <div className="space-y-2">
                        {recentAuctions.map((a) => (
                            <div key={a.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                <div>
                                    <div className="font-medium text-sm">{a.auctionTitle}</div>
                                    <div className="text-xs text-black-400">
                                        Ends {formatDate ? formatDate(a.endTime) : new Date(a.endTime).toLocaleDateString()}
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${a.auctionStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                        a.auctionStatus === 'UPCOMING' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-600'
                                    }`}>{a.auctionStatus}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>


        </div>
    );
}

/* ─────────────── Items Tab ─────────────── */
interface ItemsTabProps {
    items: Item[];
    loading: boolean;
    onRefresh: () => void;
    processingIds: Set<number>;
    startProcessing: (id: number) => void;
    stopProcessing: (id: number) => void;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        onPageChange: (page: number) => void;
    };
}

function ItemsTab({ items, loading, onRefresh, processingIds, startProcessing, stopProcessing, pagination }: ItemsTabProps) {
    const handleStatusAction = async (id: number, status: 'pending' | 'approved' | 'rejected' | 'available') => {
        if (!window.confirm(`Change item status to ${status.toUpperCase()}?`)) return;

        startProcessing(id);
        try {
            await itemAdminService.updateItemStatus(id, status);
            toast.success(`Item status updated to ${status}`);
            onRefresh();
        } catch (error) {
            console.error('Error updating item status', error);
            toast.error('Failed to update item status');
        } finally {
            stopProcessing(id);
        }
    };

    const statusBadge = (s: string) => {
        const map: Record<string, string> = {
            approved: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700',
            pending: 'bg-yellow-100 text-yellow-700',
        };
        return map[s] ?? 'bg-gray-100 text-gray-600';
    };

    const pending = items.filter(i => i.itemStatus === 'pending');
    const others = items.filter(i => i.itemStatus !== 'pending');
    const sorted = [...pending, ...others];

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h2 className="text-xl font-semibold">Item Management</h2>
                    {pending.length > 0 && (
                        <p className="text-sm text-yellow-600 mt-0.5">⚠ {pending.length} item(s) awaiting review</p>
                    )}
                </div>
                <button onClick={onRefresh}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading items…</div>
            ) : sorted.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No items found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-3 font-semibold text-gray-700">Item</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Category</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Price</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sorted.map((item) => (
                                <tr key={item.id} className={`hover:bg-gray-50 transition ${item.itemStatus === 'pending' ? 'bg-yellow-50/40' : ''}`}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {item.itemImage && (
                                                <img
                                                    src={Array.isArray(item.itemImage) ? item.itemImage[0] : item.itemImage}
                                                    alt={item.itemName}
                                                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">{item.itemName}</div>
                                                <div className="text-xs text-gray-400">ID #{item.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{item.category ?? '—'}</td>
                                    <td className="px-4 py-3 font-semibold text-green-700">{formatCurrency(item.price)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge(item.itemStatus)}`}>
                                            {(item.itemStatus ?? 'unknown').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={item.itemStatus}
                                            disabled={processingIds.has(item.id)}
                                            onChange={(e) => handleStatusAction(item.id, e.target.value as 'pending' | 'approved' | 'rejected' | 'available')}
                                            className={`text-xs border rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${item.itemStatus === 'pending' ? 'border-yellow-300 text-yellow-700' :
                                                    item.itemStatus === 'approved' ? 'border-green-300 text-green-700' :
                                                        item.itemStatus === 'rejected' ? 'border-red-300 text-red-700' :
                                                            'border-gray-300 text-gray-700'
                                                } ${processingIds.has(item.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="available">Available</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    itemsPerPage={10}
                    onPageChange={pagination.onPageChange}
                />
            )}
        </div>
    );
}

/* ─────────────── Auctions Tab ─────────────── */
interface AuctionsTabProps {
    auctions: Auction[];
    loading: boolean;
    onRefresh: () => void;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        onPageChange: (page: number) => void;
    };
}

function AuctionsTab({ auctions, loading, pagination }: AuctionsTabProps) {
    const statusBadge = (s: string) => {
        const map: Record<string, string> = {
            ACTIVE: 'bg-green-100 text-green-700',
            UPCOMING: 'bg-blue-100 text-blue-700',
            ENDED: 'bg-gray-100 text-gray-600',
            COMPLETED: 'bg-purple-100 text-purple-700',
        };
        return map[s] ?? 'bg-gray-100 text-gray-600';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold">Auction Management</h2>
                <Link to="/auction/create"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm">
                    <Plus className="w-4 h-4" /> Create Auction
                </Link>
            </div>

            {auctions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No auctions found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-3 font-semibold text-gray-700">Auction</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Starting Price</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">End Time</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {auctions.map((auction) => (
                                <tr key={auction.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {auction.item?.itemImage && (
                                                <img
                                                    src={Array.isArray(auction.item.itemImage)
                                                        ? (auction.item.itemImage as string[])[0]
                                                        : auction.item.itemImage}
                                                    alt={auction.auctionTitle}
                                                    className="w-10 h-10 rounded-lg object-cover border flex-shrink-0"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">{auction.auctionTitle}</div>
                                                <div className="text-xs text-gray-400">ID #{auction.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-green-700">
                                        {formatCurrency(auction.startingPrice)}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{formatDate(auction.endTime)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge(auction.auctionStatus)}`}>
                                            {auction.auctionStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link to={`/auction/${auction.id}`}
                                            className="inline-flex items-center gap-1 px-3 py-1 text-xs text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition">
                                            <Eye className="w-3 h-3" /> View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    itemsPerPage={10}
                    onPageChange={pagination.onPageChange}
                />
            )}
        </div>
    );
}

/* ─────────────── Transactions Tab ─────────────── */
interface TransactionsTabProps { 
    transactions: Transaction[]; 
    loading: boolean; 
    onRefresh: () => void;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        onPageChange: (page: number) => void;
    };
}

function TransactionsTab({ transactions, loading, onRefresh, pagination }: TransactionsTabProps) {
    const statusBadge = (s: string) => {
        const map: Record<string, string> = {
            COMPLETED: 'bg-green-100 text-green-700',
            completed: 'bg-green-100 text-green-700',
            PENDING: 'bg-yellow-100 text-yellow-700',
            pending: 'bg-yellow-100 text-yellow-700',
            FAILED: 'bg-red-100 text-red-700',
            failed: 'bg-red-100 text-red-700',
        };
        return map[s] ?? 'bg-gray-100 text-gray-600';
    };

    const typeBadge = (t: string) => {
        const map: Record<string, string> = {
            DEPOSIT: 'bg-blue-100 text-blue-700',
            WITHDRAWAL: 'bg-orange-100 text-orange-700',
            AUCTION_PAYMENT: 'bg-purple-100 text-purple-700',
            AUCTION_DEPOSIT: 'bg-indigo-100 text-indigo-700',
            AUCTION_REFUND: 'bg-teal-100 text-teal-700',
            TRANSFER_IN: 'bg-green-100 text-green-700',
            TRANSFER_OUT: 'bg-red-100 text-red-700',
        };
        return map[t] ?? 'bg-gray-100 text-gray-600';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold">All Transactions</h2>
                <button onClick={onRefresh}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading transactions…</div>
            ) : transactions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No transactions found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-3 font-semibold text-gray-700">ID</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">User</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Type</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Amount</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Method</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 font-mono text-gray-500">#{tx.id}</td>
                                    <td className="px-4 py-3 text-gray-600">#{tx.userId}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeBadge(tx.type)}`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className={`px-4 py-3 font-semibold ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{tx.paymentMethod ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge(tx.transactionStatus ?? tx.paymentStatus)}`}>
                                            {(tx.transactionStatus ?? tx.paymentStatus ?? '—').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                        {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    itemsPerPage={10}
                    onPageChange={pagination.onPageChange}
                />
            )}
        </div>
    );
}

/* ─────────────── Users Tab ─────────────── */
interface UsersTabProps {
    users: AdminUser[];
    loading: boolean;
    onRefresh: () => void;
    processingIds: Set<number>;
    startProcessing: (id: number) => void;
    stopProcessing: (id: number) => void;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        onPageChange: (page: number) => void;
    };
}

function UsersTab({ users, loading, onRefresh, processingIds, startProcessing, stopProcessing, pagination }: UsersTabProps) {
    const [updatingRole, setUpdatingRole] = useState<number | null>(null);

    const handleUserStatusChange = async (userId: number, newStatus: string) => {
        if (!window.confirm(`Change user status to ${newStatus.toUpperCase()}?`)) return;

        startProcessing(userId);
        try {
            const response = await userAdminService.updateUserStatus(userId, newStatus);
            toast.success(response.message);
            onRefresh();
        } catch (error) {
            console.error('Update user status error', error);
            toast.error('Failed to update user status');
        } finally {
            stopProcessing(userId);
        }
    };

    const changeRole = async (userId: number, newRole: IdentifiedStatus) => {
        if (!window.confirm(`Change this user's role to ${newRole}?`)) return;

        setUpdatingRole(userId);
        try {
            const response = await userAdminService.updateUserRole(userId, newRole);
            toast.success(response.message);
            onRefresh();
        } catch (error) {
            console.error('Change role error', error);
            toast.error('Failed to update user role');
        } finally {
            setUpdatingRole(null);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold">User Management</h2>
                <button onClick={onRefresh}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading users…</div>
            ) : users.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No users found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-3 font-semibold text-gray-700">User</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Role</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Joined</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition">
                                    {/* User */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {u.userImage ? (
                                                <img src={u.userImage} className="w-9 h-9 rounded-full object-cover border flex-shrink-0" alt="" />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                                                    {u.userName?.[0]?.toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">{u.userName}</div>
                                                <div className="text-xs text-gray-400">#{u.id}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="px-4 py-3 text-gray-600">{u.userEmail}</td>

                                    {/* Account status */}
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.userStatus === 'active' ? 'bg-green-100 text-green-700' :
                                                u.userStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {u.userStatus.toUpperCase()}
                                        </span>
                                    </td>

                                    {/* Role dropdown */}
                                    <td className="px-4 py-3">
                                        {u.identifiedStatus === 'admin' /* protect primary admin */ ? (
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Admin</span>
                                        ) : (
                                            <select
                                                value={u.identifiedStatus}
                                                disabled={updatingRole === u.id}
                                                onChange={(e) => changeRole(u.id, e.target.value as IdentifiedStatus)}
                                                className={`text-xs border rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${u.identifiedStatus === 'admin'
                                                        ? 'border-purple-300 text-purple-700'
                                                        : 'border-gray-300 text-gray-700'
                                                    } ${updatingRole === u.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                            >
                                                <option value="unidentified">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        )}
                                    </td>

                                    {/* Joined */}
                                    <td className="px-4 py-3 text-gray-500">
                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                                    </td>

                                    {/* Ban / Unban */}
                                    <td className="px-4 py-3">
                                        {u.identifiedStatus === 'admin' ? (
                                            <span className="text-xs text-gray-400 italic">Protected</span>
                                        ) : (
                                            <select
                                                value={u.userStatus}
                                                disabled={processingIds.has(u.id)}
                                                onChange={(e) => handleUserStatusChange(u.id, e.target.value)}
                                                className={`text-xs border rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${u.userStatus === 'active' ? 'border-green-300 text-green-700' :
                                                        u.userStatus === 'pending' ? 'border-yellow-300 text-yellow-700' :
                                                            'border-red-300 text-red-700'
                                                    } ${processingIds.has(u.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="active">Active</option>
                                                <option value="banned">Banned</option>
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    itemsPerPage={10}
                    onPageChange={pagination.onPageChange}
                />
            )}
        </div>
    );
}
