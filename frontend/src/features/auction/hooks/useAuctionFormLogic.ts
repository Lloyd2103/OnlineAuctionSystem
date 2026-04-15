import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { auctionService } from '@/features/auction/api/auctionService';
import { itemService } from '@/features/item/api/itemService'; // Using global item service for now
import type { Auction } from '@/features/auction/types';
import type { Item } from '@/features/item/types';

interface UseAuctionFormLogicProps {
    mode: 'create' | 'edit';
    auction?: Auction;
    preSelectedItem?: Partial<Item>;
    onSuccess: () => void;
}

function formatDatetimeLocal(date?: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function useAuctionFormLogic({ mode, auction, preSelectedItem, onSuccess }: UseAuctionFormLogicProps) {
    const [loading, setLoading] = useState(false);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerItems, setPickerItems] = useState<Item[]>([]);
    const [pickerLoading, setPickerLoading] = useState(false);
    const [pickerSearch, setPickerSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState<Item>(preSelectedItem as Item);

    const [form, setForm] = useState({
        title: auction?.title ?? '',
        description: auction?.description ?? '',
        auctionStatus: auction?.auctionStatus ?? 'UPCOMING',
        startTime: auction ? formatDatetimeLocal(auction.startTime) : '',
        endTime: auction ? formatDatetimeLocal(auction.endTime) : '',
        startingPrice: auction?.startingPrice ?? 0,
        incrementPrice: auction?.incrementPrice ?? 10,
        instantBuyPrice: auction?.instantBuyPrice ?? 0,
        mandatoryDeposit: auction?.mandatoryDeposit ?? 0,
    });

    const fetchPickerItems = useCallback(async () => {
        try {
            setPickerLoading(true);
            const data = await itemService.fetchItems();
            setPickerItems(Array.isArray(data) ? data : (data?.items ?? data?.data ?? []));
        } catch {
            toast.error('Failed to load your items');
        } finally {
            setPickerLoading(false);
        }
    }, []);

    useEffect(() => {
        if (pickerOpen) fetchPickerItems();
    }, [pickerOpen, fetchPickerItems]);

    const handleFieldChange = (field: keyof typeof form, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) { toast.error('Please select an item for the auction'); return; }
        if (!form.startTime) { toast.error('Start time is required'); return; }
        if (!form.endTime) { toast.error('End time is required'); return; }
        if (new Date(form.endTime) <= new Date(form.startTime)) {
            toast.error('End time must be after start time'); return;
        }
        if (form.startingPrice <= 0) { toast.error('Starting price must be greater than 0'); return; }

        try {
            setLoading(true);
            const startDate = new Date(form.startTime);
            const endDate = new Date(form.endTime);

            if (mode === 'create') {
                await auctionService.createAuction(
                    Number(selectedItem.id),
                    form.title,
                    form.description,
                    startDate, endDate,
                    form.startingPrice, form.incrementPrice,
                    form.instantBuyPrice, 
                    form.mandatoryDeposit
                );
                toast.success('Auction created successfully!');
            } else if (auction) {
                await auctionService.updateAuction(
                    auction.id,
                    auction.itemId,
                    form.title,
                    form.description,
                    form.auctionStatus,
                    startDate, endDate,
                    form.startingPrice, 
                    form.incrementPrice,
                    form.instantBuyPrice, 
                    form.mandatoryDeposit
                );
                toast.success('Auction updated successfully!');
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error('Failed to create auction');
        } finally {
            setLoading(false);
        }
    };

    const filteredPickerItems = pickerItems.filter(i =>
        i.itemName?.toLowerCase().includes(pickerSearch.toLowerCase())
    );

    return {
        loading,
        form,
        selectedItem, setSelectedItem,
        picker: {
            isOpen: pickerOpen,
            setOpen: setPickerOpen,
            items: filteredPickerItems,
            loading: pickerLoading,
            search: pickerSearch,
            setSearch: setPickerSearch
        },
        handleFieldChange,
        handleSubmit
    };
}
