import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { auctionService } from '../api/auctionService';
import type { Auction } from '../types';

export function useAuctionManagementLogic() {
    const { isAuthenticated } = useAuthStore();
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);

    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Auction | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Auction | null>(null);

    const fetchAuctions = async () => {
        try {
            const data = await auctionService.fetchAuctionsByOwnerId();
            const list: Auction[] = Array.isArray(data) ? data : (data?.auctions ?? data?.data ?? []);
            setAuctions(list);
        } catch {
            toast.error('Failed to load auctions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchAuctions();
        }
    }, [isAuthenticated]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await auctionService.deleteAuction(deleteTarget.id);
            toast.success('Auction deleted');
            setDeleteTarget(null);
            fetchAuctions();
        } catch {
            toast.error('Failed to delete auction');
        }
    };

    return {
        auctions,
        loading,
        createOpen,
        setCreateOpen,
        editTarget,
        setEditTarget,
        deleteTarget,
        setDeleteTarget,
        fetchAuctions,
        handleDelete,
        isAuthenticated
    };
}
