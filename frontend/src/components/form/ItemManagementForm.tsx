import { useState, useEffect } from 'react';
import { Package, Plus, Search, Gavel, Edit2, Trash2, CheckSquare, Square, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { itemService } from '@/services/itemService';
import type { Item } from '@/types/item';
import { ItemCreateForm } from './ItemCreateForm';
import { AuctionCreateForm } from '../form/AuctionCreateForm';

const CATEGORIES = ['All', 'Electronics', 'Art', 'Fashion', 'Jewelry', 'Media', 'Vehicles', 'Real Estates', 'Sports', 'Collectibles', 'Other'];
const STATUSES = ['All', 'Available', 'Pending', 'In Auction', 'Sold'];

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        'Available': 'bg-green-500/10 text-green-600 border-green-500/20',
        'In Auction': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        'Pending': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        'Sold': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    };
    return (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm ${map[status] ?? 'bg-muted text-muted-foreground border-border'}`}>
            {status}
        </span>
    );
}

// Simple confirmation dialog
function ConfirmDialog({ open, onConfirm, onCancel, title, message }: {
    open: boolean; onConfirm: () => void; onCancel: () => void; title: string; message: string;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative z-10 bg-card rounded-2xl shadow-2xl p-6 w-full max-w-sm border">
                <h3 className="font-bold text-lg mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground mb-5">{message}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded-xl border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-all">Delete</button>
                </div>
            </div>
        </div>
    );
}

// Modal wrapper
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 bg-card rounded-2xl shadow-2xl w-full max-w-2xl border overflow-hidden">
                {children}
            </div>
        </div>
    );
}

export function ItemManagement() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);

    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Item | null>(null);
    const [auctionItem, setAuctionItem] = useState<Item | null>(null);     // single item → auction form
    const [batchAuctionOpen, setBatchAuctionOpen] = useState(false);       // multiple items

    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await itemService.fetchItems();
            setItems(Array.isArray(data) ? data : (data?.items ?? data?.data ?? []));
        } catch {
            toast.error('Failed to load items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchItems(); }, []);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await itemService.deleteItem(deleteTarget.id);
            toast.success('Item deleted');
            setDeleteTarget(null);
            fetchItems();
        } catch {
            toast.error('Failed to delete item');
        }
    };

    const toggleSelect = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const filteredItems = items.filter(item => {
        const matchSearch = item.itemName?.toLowerCase().includes(search.toLowerCase()) ||
            item.itemDescription?.toLowerCase().includes(search.toLowerCase());
        const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
        const matchStatus = statusFilter === 'All' || item.itemStatus === statusFilter;
        return matchSearch && matchCategory && matchStatus;
    });

    const selectedItems = items.filter(i => selected.has(i.id));

    return (
        <div className="p-6 bg-background min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                        <Package className="w-7 h-7" /> My Inventory
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your items and send them to auction.</p>
                </div>
                <div className="flex items-center gap-2">
                    {selected.size > 0 && (
                        <button
                            onClick={() => setBatchAuctionOpen(true)}
                            className="flex items-center gap-2 bg-bid text-bid-foreground px-5 py-2.5 rounded-xl hover:shadow-lg transition-all font-medium text-sm"
                        >
                            <Gavel size={16} /> Auction {selected.size} Items
                        </button>
                    )}
                    <button
                        onClick={() => setCreateOpen(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:shadow-lg transition-all font-medium"
                    >
                        <Plus size={20} /> Add New Item
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search items..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
            </div>

            {/* Count / selection info */}
            {selected.size > 0 && (
                <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 mb-4 text-sm">
                    <span className="font-medium text-primary">{selected.size} item{selected.size > 1 ? 's' : ''} selected</span>
                    <button onClick={() => setSelected(new Set())} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <X size={13} /> Clear selection
                    </button>
                </div>
            )}

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
                    <Package size={52} className="opacity-20" />
                    <p className="font-medium text-lg">No items found</p>
                    <p className="text-sm">Try adjusting your filters or add a new item.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredItems.map(item => {
                        const isSelected = selected.has(item.id);
                        return (
                            <div
                                key={item.id}
                                className={`group relative bg-card rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 ${isSelected ? 'ring-2 ring-primary' : ''}`}
                            >
                                {/* Select Checkbox */}
                                <button
                                    onClick={() => toggleSelect(item.id)}
                                    className="absolute top-3 left-3 z-10 p-0.5 rounded-md bg-black/30 backdrop-blur-sm text-white hover:scale-110 transition-transform"
                                >
                                    {isSelected ? <CheckSquare size={18} className="text-primary" fill="white" /> : <Square size={18} />}
                                </button>

                                {/* Image */}
                                <div className="relative aspect-square overflow-hidden bg-muted">
                                    {item.itemImage ? (
                                        <img src={item.itemImage} alt={item.itemName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                                            <Package size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <StatusBadge status={item.itemStatus} />
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-4">
                                    <h3 className="font-bold text-base line-clamp-1">{item.itemName}</h3>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.itemDescription}</p>
                                    
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="font-bold text-primary text-sm">${Number(item.price).toLocaleString()}</span>
                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{item.category}</span>
                                    </div>

                                    <div className="mt-4 pt-3 border-t flex items-center justify-between">
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => setEditTarget(item)}
                                                className="p-1.5 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(item)}
                                                className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => setAuctionItem(item)}
                                            className="flex items-center gap-1.5 py-1.5 px-3 bg-bid text-bid-foreground rounded-lg font-semibold text-xs hover:opacity-90 transition-all"
                                        >
                                            <Gavel size={13} /> Start Auction
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Delete Confirm */}
            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Item"
                message={`Are you sure you want to delete "${deleteTarget?.itemName}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            {/* Create Item Modal */}
            <Modal open={createOpen} onClose={() => setCreateOpen(false)}>
                <ItemCreateForm
                    mode="create"
                    onSuccess={() => { setCreateOpen(false); fetchItems(); }}
                    onCancel={() => setCreateOpen(false)}
                />
            </Modal>

            {/* Edit Item Modal */}
            <Modal open={!!editTarget} onClose={() => setEditTarget(null)}>
                {editTarget && (
                    <ItemCreateForm
                        mode="edit"
                        item={editTarget}
                        onSuccess={() => { setEditTarget(null); fetchItems(); }}
                        onCancel={() => setEditTarget(null)}
                    />
                )}
            </Modal>

            {/* Auction Form Modal — single item */}
            <Modal open={!!auctionItem} onClose={() => setAuctionItem(null)}>
                {auctionItem && (
                    <AuctionCreateForm
                        mode="create"
                        preSelectedItem={auctionItem}
                        onSuccess={() => { setAuctionItem(null); fetchItems(); }}
                        onCancel={() => setAuctionItem(null)}
                    />
                )}
            </Modal>

            {/* Auction Form Modal — batch */}
            <Modal open={batchAuctionOpen} onClose={() => setBatchAuctionOpen(false)}>
                <AuctionCreateForm
                    mode="create"
                    preSelectedItem={selectedItems[0]}
                    onSuccess={() => { setBatchAuctionOpen(false); setSelected(new Set()); fetchItems(); }}
                    onCancel={() => setBatchAuctionOpen(false)}
                />
            </Modal>
        </div>
    );
}