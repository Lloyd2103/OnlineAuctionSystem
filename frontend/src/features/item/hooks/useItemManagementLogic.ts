import { useState, useEffect } from 'react';
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

    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);

    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Item | null>(null);
    const [auctionItem, setAuctionItem] = useState<Item | null>(null);
    const [batchAuctionOpen, setBatchAuctionOpen] = useState(false);

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

    useEffect(() => {
        if (isAuthenticated) {
            fetchItems();
        }
    }, [isAuthenticated]);

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

    const filteredItems = items.filter(item => {
        const matchSearch = item.itemName?.toLowerCase().includes(search.toLowerCase()) ||
            item.itemDescription?.toLowerCase().includes(search.toLowerCase());
        const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
        const matchStatus = statusFilter === 'All' || item.itemStatus === statusFilter;
        return matchSearch && matchCategory && matchStatus;
    });

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
        filteredItems,
        selectedItems
    };
}
