import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Gavel, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';

import { auctionService } from '@/services/auctionService';
import type { Auction } from '@/types/auction';
import { AuctionCreateForm } from './AuctionCreateForm';


function AuctionStatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        'Live': 'bg-green-500/10 text-green-600 border-green-500/20',
        'ACTIVE': 'bg-green-500/10 text-green-600 border-green-500/20',
        'Upcoming': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        'UPCOMING': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        'Ended': 'bg-gray-400/10 text-gray-500 border-gray-400/20',
        'ENDED': 'bg-gray-400/10 text-gray-500 border-gray-400/20',
        'All': 'bg-muted text-muted-foreground border-border',
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status] ?? 'bg-muted text-muted-foreground border-border'}`}>
            {status}
        </span>
    );
}

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
                    <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90">Delete</button>
                </div>
            </div>
        </div>
    );
}

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

export function AuctionManagement() {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);

    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Auction | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Auction | null>(null);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const data = await auctionService.fetchAuctions();

            const list: Auction[] = Array.isArray(data) ? data : (data?.auctions ?? data?.data ?? []);
            setAuctions(list);
        } catch {
            toast.error('Failed to load auctions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await auctionService.deleteAuction(deleteTarget.id);
            toast.success('Auction deleted');
            setDeleteTarget(null);
            fetchAll();
        } catch {
            toast.error('Failed to delete auction');
        }
    };

    const formatDate = (d: Date | string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="p-6 bg-background min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                        <Gavel className="w-7 h-7" /> My Auctions
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your active and scheduled auction sessions.</p>
                </div>
                <button
                    onClick={() => setCreateOpen(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:shadow-lg transition-all font-medium"
                >
                    <Plus size={20} /> Create New Auction
                </button>
            </div>

            {/* Table */}
            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Item</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Starting Bid</th>
                                <th className="px-6 py-4 font-semibold">Buy Now</th>
                                <th className="px-6 py-4 font-semibold">Duration</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center">
                                        <Loader2 className="animate-spin mx-auto text-primary" size={36} />
                                    </td>
                                </tr>
                            ) : auctions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center text-muted-foreground">
                                        <Gavel size={40} className="mx-auto mb-3 opacity-20" />
                                        <p className="font-medium">No auctions yet</p>
                                        <p className="text-sm">Create your first auction to get started.</p>
                                    </td>
                                </tr>
                            ) : auctions.map(auction => {
                                const item = auction.item;
                                return (
                                    <tr key={auction.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                                    {item?.itemImage ? (
                                                        <img src={item.itemImage} alt={item.itemName} className="object-cover w-full h-full" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                            <Package size={18} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-sm">{item?.itemName ?? `Item #${auction.itemId}`}</div>
                                                    <div className="text-xs text-muted-foreground">Auction #{auction.id}</div>
                                                    {item?.category && <div className="text-xs text-muted-foreground/70">{item.category}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <AuctionStatusBadge status={auction.auctionStatus ?? 'Upcoming'} />
                                        </td>
                                        <td className="px-6 py-4 font-bold text-bid">
                                            ${Number(auction.startingPrice).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {Number(auction.instantBuyPrice) > 0
                                                ? <span className="font-medium">${Number(auction.instantBuyPrice).toLocaleString()}</span>
                                                : <span className="text-muted-foreground">—</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Calendar size={12} />
                                                    {formatDate(auction.startTime)} – {formatDate(auction.endTime)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1.5 justify-end">
                                                <button
                                                    onClick={() => setEditTarget(auction)}
                                                    className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={15} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(auction)}
                                                    className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Dialogs */}
            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Auction"
                message={`Delete auction #${deleteTarget?.id}? This cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            <Modal open={createOpen} onClose={() => setCreateOpen(false)}>
                <AuctionCreateForm
                    mode="create"
                    onSuccess={() => { setCreateOpen(false); fetchAll(); }}
                    onCancel={() => setCreateOpen(false)}
                />
            </Modal>

            <Modal open={!!editTarget} onClose={() => setEditTarget(null)}>
                {editTarget && (
                    <AuctionCreateForm
                        mode="edit"
                        auction={editTarget}
                        preSelectedItem={editTarget.item}
                        onSuccess={() => { setEditTarget(null); fetchAll(); }}
                        onCancel={() => setEditTarget(null)}
                    />
                )}
            </Modal>
        </div>
    );
}