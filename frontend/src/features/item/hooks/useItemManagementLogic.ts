import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { itemService } from '../api/itemService';
import type { Item } from '../types';

export function useItemManagementLogic() {
    const { isAuthenticated } = useAuthStore();
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 0 });

    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);

    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Item | null>(null);
    const [auctionItem, setAuctionItem] = useState<Item | null>(null);
    const [batchAuctionOpen, setBatchAuctionOpen] = useState(false);

    const fetchItems = useCallback(async (targetPage = page) => {
        try {
            setLoading(true);
            const data = await itemService.fetchItems({
                page: targetPage,
                limit: 10,
                search: search || undefined,
                category: categoryFilter === 'All' ? undefined : categoryFilter,
                status: statusFilter === 'All' ? undefined : statusFilter
            });
            setItems(data.data || []);
            setPagination({
                totalItems: data.totalItems,
                totalPages: data.totalPages
            });
        } catch {
            toast.error('Failed to load items');
        } finally {
            setLoading(false);
        }
    }, [page, search, categoryFilter, statusFilter]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchItems(page);
        }
    }, [isAuthenticated, page, fetchItems]);

    useEffect(() => {
        setPage(1);
    }, [search, categoryFilter, statusFilter]);

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

    const toggleSelect = (id: number) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const selectedItems = items.filter(item => selected.has(item.id));

    return {
        isAuthenticated,
        items,
        loading,
        search, setSearch,
        categoryFilter, setCategoryFilter,
        statusFilter, setStatusFilter,
        selected, setSelected,
        deleteTarget, setDeleteTarget,
        createOpen, setCreateOpen,
        editTarget, setEditTarget,
        auctionItem, setAuctionItem,
        batchAuctionOpen, setBatchAuctionOpen,
        fetchItems,
        handleDelete,
        toggleSelect,
        filteredItems: items, // Now server-side filtered
        selectedItems,
        page, setPage,
        pagination
    };
}
