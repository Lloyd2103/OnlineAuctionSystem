import { useState } from 'react';
import { Navigate, Link } from 'react-router';
import { useAuthStore } from '@/features/auth/stores/authStore';
import {
LayoutDashboard,
Package,
Gavel,
DollarSign,
Users,
Plus,
Edit,
Trash2,
Eye,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuctionStore } from '@/features/auction/stores/auctionStore';

type Tab = 'overview' | 'items' | 'auctions' | 'transactions';

export function AdminDashboard() {
    const { user, isAuthenticated } = useAuthStore();
    const { auctions } = useAuctionStore();
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    if (!isAuthenticated || (user?.identifiedStatus !== 'unidentified')) {
        return <Navigate to="/" />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your auction platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                <Gavel className="w-6 h-6 text-blue-600" />
                </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
                {auctions.filter((a) => a.auctionStatus === 'ACTIVE').length}
            </div>
            <div className="text-gray-600 text-sm">Active Auctions</div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
                </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">$284K</div>
            <div className="text-gray-600 text-sm">Total Revenue</div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
                </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{auctions.length}</div>
            <div className="text-gray-600 text-sm">Total Items</div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
                </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">1,234</div>
            <div className="text-gray-600 text-sm">Total Users</div>
            </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="border-b border-gray-200">
            <nav className="flex">
                <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-medium transition ${
                    activeTab === 'overview'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                >
                <LayoutDashboard className="w-5 h-5 inline mr-2" />
                Overview
                </button>
                <button
                onClick={() => setActiveTab('items')}
                className={`px-6 py-4 font-medium transition ${
                    activeTab === 'items'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                >
                <Package className="w-5 h-5 inline mr-2" />
                Items
                </button>
                <button
                onClick={() => setActiveTab('auctions')}
                className={`px-6 py-4 font-medium transition ${
                    activeTab === 'auctions'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                >
                <Gavel className="w-5 h-5 inline mr-2" />
                Auctions
                </button>
                <button
                onClick={() => setActiveTab('transactions')}
                className={`px-6 py-4 font-medium transition ${
                    activeTab === 'transactions'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                >
                <DollarSign className="w-5 h-5 inline mr-2" />
                Transactions
                </button>
            </nav>
            </div>

            <div className="p-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'items' && <ItemsTab />}
            {activeTab === 'auctions' && <AuctionsTab />}
            {activeTab === 'transactions' && <TransactionsTab />}
            </div>
        </div>
        </div>
    );
    }

    function OverviewTab() {
    return (
        <div className="space-y-6">
        <div>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                <div className="font-medium">New auction created</div>
                <div className="text-sm text-gray-600">Vintage Rolex Submariner Watch</div>
                </div>
                <div className="text-sm text-gray-500">2 hours ago</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                <div className="font-medium">Transaction completed</div>
                <div className="text-sm text-gray-600">Gaming PC RTX 4090 - $3,800</div>
                </div>
                <div className="text-sm text-gray-500">5 hours ago</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                <div className="font-medium">New user registered</div>
                <div className="text-sm text-gray-600">john.doe@example.com</div>
                </div>
                <div className="text-sm text-gray-500">1 day ago</div>
            </div>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div>
            <h2 className="text-xl font-semibold mb-4">Top Categories</h2>
            <div className="space-y-2">
                {['Electronics', 'Jewelry', 'Art', 'Fashion'].map((cat, idx) => (
                <div key={cat} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>{cat}</span>
                    <span className="font-semibold">{[45, 32, 28, 24][idx]}%</span>
                </div>
                ))}
            </div>
            </div>

            <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
                <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-left flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Item
                </button>
                <button className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-left flex items-center gap-2">
                <Gavel className="w-5 h-5" />
                Start New Auction
                </button>
            </div>
            </div>
        </div>
        </div>
    );
    }

    function ItemsTab() {
    const handleDelete = (id: string) => {
        console.log('Delete', id);
        toast.success('Item deleted successfully');
    };

    return (
        <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Item Management</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Item
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Item</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Condition</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {auctions.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                        <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="font-medium">{item.title}</div>
                    </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.category}</td>
                    <td className="px-4 py-3 text-gray-600">{item.condition}</td>
                    <td className="px-4 py-3">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'in_auction'
                            ? 'bg-green-100 text-green-600'
                            : item.status === 'ready'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                        {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                    </td>
                    <td className="px-4 py-3">
                    <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                        </button>
                        <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                        <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
    }

function AuctionsTab() {
    return (
        <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Auction Management</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Auction
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Current Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Bids</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">End Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {auctions.map((auction) => (
                <tr key={auction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                        <img
                        src={auction.images[0]}
                        alt={auction.title}
                        className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="font-medium">{auction.title}</div>
                    </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-600">
                    {formatCurrency(auction.currentPrice)}
                    </td>
                    <td className="px-4 py-3">{auction.totalBids}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(auction.endTime)}
                    </td>
                    <td className="px-4 py-3">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        auction.status === 'active'
                            ? 'bg-green-100 text-green-600'
                            : auction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                        {auction.status.toUpperCase()}
                    </span>
                    </td>
                    <td className="px-4 py-3">
                    <div className="flex gap-2">
                        <Link
                        to={`/auction/${auction.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                        <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
    }

    function TransactionsTab() {
    return (
        <div>
        <h2 className="text-xl font-semibold mb-6">Transaction & Payment Management</h2>

        <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Transaction ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Item</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Winner</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Payment</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Shipping</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {mockTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{tx.id}</td>
                    <td className="px-4 py-3 font-medium">{tx.auctionTitle}</td>
                    <td className="px-4 py-3 text-gray-600">{tx.winnerName}</td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(tx.totalAmount)}</td>
                    <td className="px-4 py-3">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        tx.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-600'
                            : tx.paymentStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                    >
                        {tx.paymentStatus.toUpperCase()}
                    </span>
                    </td>
                    <td className="px-4 py-3">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        tx.shippingStatus === 'delivered'
                            ? 'bg-green-100 text-green-600'
                            : tx.shippingStatus === 'shipped'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                        {tx.shippingStatus.toUpperCase()}
                    </span>
                    </td>
                    <td className="px-4 py-3">
                    <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                        Update
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
}
