import { useState, useEffect } from 'react';
import { X, Gavel, Search, Package, Loader2, CalendarDays, DollarSign, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { auctionService } from '@/services/auctionService';
import { itemService } from '@/services/itemService';
import type { Auction } from '@/types/auction';
import type { Item } from '@/types/item';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';

interface AuctionCreateFormProps {
    mode: 'create' | 'edit';
    auction?: Auction;
    preSelectedItem?: Partial<Item>;
    onSuccess: () => void;
    onCancel: () => void;
}

function formatDatetimeLocal(date?: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AuctionCreateForm({ mode, auction, preSelectedItem, onSuccess, onCancel }: AuctionCreateFormProps) {
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

    const fetchPickerItems = async () => {
        try {
            setPickerLoading(true);
            const data = await itemService.fetchItems();
            setPickerItems(Array.isArray(data) ? data : (data?.items ?? data?.data ?? []));
        } catch {
            toast.error('Failed to load your items');
        } finally {
            setPickerLoading(false);
        }
    };

    useEffect(() => {
        if (pickerOpen) fetchPickerItems();
    }, [pickerOpen]);

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
        } catch (error: unknown) {
            const msg = error && typeof error === 'object' && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
                : undefined;
            toast.error(msg ?? (mode === 'create' ? 'Failed to create auction' : 'Failed to update auction'));
        } finally {
            setLoading(false);
        }
    };

    const filteredPickerItems = pickerItems.filter(i =>
        i.itemName?.toLowerCase().includes(pickerSearch.toLowerCase())
    );

    const PriceField = ({ label, field, hint }: { label: string; field: keyof typeof form; hint?: string }) => (
        <div>
            <label className="block text-sm font-medium mb-1.5">{label}</label>
            <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="number"
                    value={form[field] as number}
                    onChange={(e) => handleFieldChange(field, parseFloat(e.target.value) || 0)}
                    min={0} step={0.01}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                />
            </div>
            {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
        </div>
    );

    return (
        <>
            <div className="flex flex-col max-h-[88vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-bid/10 flex items-center justify-center">
                            <Gavel className="text-bid w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{mode === 'create' ? 'Create Auction' : 'Edit Auction'}</h2>
                            <p className="text-xs text-muted-foreground">
                                {mode === 'create' ? 'Schedule an auction for your item' : 'Update your auction details'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-muted transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-6 py-5">
                    <form id="auction-form" onSubmit={handleSubmit} className="space-y-5">

                        {/* Item Selector */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Item for Auction <span className="text-destructive">*</span></label>
                            {selectedItem ? (
                                <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                        {selectedItem.itemImage ? (
                                            <img src={selectedItem.itemImage} alt={selectedItem.itemName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <Package size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{selectedItem.itemName}</p>
                                        <p className="text-xs text-muted-foreground">{selectedItem.category} · ${Number(selectedItem.price).toLocaleString()}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPickerOpen(true)}
                                        className="text-xs text-primary font-medium hover:underline flex-shrink-0"
                                    >
                                        Change
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setPickerOpen(true)}
                                    className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-all text-sm text-muted-foreground"
                                >
                                    <Package size={16} /> Select an item from your inventory
                                </button>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Title <span className="text-destructive">*</span></label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => handleFieldChange('title', e.target.value)}
                                className="w-full px-3 py-2.5 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                placeholder="Enter auction title"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium mb-1.5">Description <span className="text-destructive">*</span></label>
                            <textarea
                                value={form.description}
                                onChange={(e) => handleFieldChange('description', e.target.value)}
                                className="w-full px-3 py-2.5 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                placeholder="Enter auction description"
                            />
                        </div>

                                                <div>
                            <label className="block text-sm font-medium mb-1.5">Auction Status <span className="text-destructive">*</span></label>
                            <input
                                type="text"
                                value={form.auctionStatus}
                                onChange={(e) => handleFieldChange('auctionStatus', e.target.value)}
                                className="w-full px-3 py-2.5 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                placeholder="Enter auction status"
                            />
                        </div>


                        {/* Times */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Start Time Field */}
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
                                    <CalendarDays size={13} /> Start Time <span className="text-destructive">*</span>
                                </label>
                                <DatePicker
                                    selected={form.startTime ? new Date(form.startTime) : null}
                                    onChange={(date: Date | null) => handleFieldChange('startTime', date ? date.toISOString() : '')}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15} // Cho phép chọn cách nhau 15 phút
                                    timeCaption="Giờ"
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    minDate={new Date()} // Không cho chọn ngày quá khứ
                                    placeholderText="Chọn ngày & giờ bắt đầu"
                                    locale={vi} // Bỏ dòng này nếu bạn muốn dùng tiếng Anh
                                    className="w-full px-3.5 py-2.5 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                />
                            </div>

                            {/* End Time Field */}
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
                                    <CalendarDays size={13} /> End Time <span className="text-destructive">*</span>
                                </label>
                                <DatePicker
                                    selected={form.endTime ? new Date(form.endTime) : null}
                                    onChange={(date: Date | null) => handleFieldChange('endTime', date ? date.toISOString() : '')}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    timeCaption="Giờ"
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    minDate={form.startTime ? new Date(form.startTime) : new Date()} // Kết thúc phải sau khi bắt đầu
                                    placeholderText="Chọn ngày & giờ kết thúc"
                                    locale={vi}
                                    className="w-full px-3.5 py-2.5 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        {/* Prices */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <PriceField label="Starting Price *" field="startingPrice" hint="Minimum opening bid" />
                            <PriceField label="Bid Increment" field="incrementPrice" hint="Minimum raise per bid" />
                            <PriceField label="Instant Buy Price" field="instantBuyPrice" hint="Set 0 to disable" />
                            <PriceField label="Mandatory Deposit" field="mandatoryDeposit" hint="Required to join auction" />
                        </div>

                        {/* Preview panel */}
                        {(form.startingPrice > 0 || form.endTime) && (
                            <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-1.5">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Auction Summary</p>
                                {selectedItem && <div className="flex justify-between"><span>Item</span><span className="font-medium">{selectedItem.itemName}</span></div>}
                                {form.startingPrice > 0 && <div className="flex justify-between"><span>Opening bid</span><span className="font-medium">${form.startingPrice.toLocaleString()}</span></div>}
                                {form.incrementPrice > 0 && <div className="flex justify-between"><span>Min increment</span><span className="font-medium">${form.incrementPrice.toLocaleString()}</span></div>}
                                {form.instantBuyPrice > 0 && <div className="flex justify-between"><span>Buy it now</span><span className="font-medium text-bid">${form.instantBuyPrice.toLocaleString()}</span></div>}
                                {form.startTime && form.endTime && (
                                    <div className="flex justify-between">
                                        <span>Duration</span>
                                        <span className="font-medium">
                                            {Math.round((new Date(form.endTime).getTime() - new Date(form.startTime).getTime()) / (1000 * 60 * 60))}h
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t flex justify-end gap-3 bg-muted/20">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl border text-sm font-medium hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="auction-form"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-bid text-bid-foreground text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
                    >
                        {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : (mode === 'create' ? 'Launch Auction' : 'Save Changes')}
                    </button>
                </div>
            </div>

            {/* Item Picker Modal */}
            {pickerOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPickerOpen(false)} />
                    <div className="relative z-10 bg-card rounded-2xl shadow-2xl w-full max-w-lg border overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <h3 className="font-bold text-base">Select Item</h3>
                            <button onClick={() => setPickerOpen(false)} className="p-2 rounded-full hover:bg-muted">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="px-4 py-3 border-b">
                            <div className="relative">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={pickerSearch}
                                    onChange={(e) => setPickerSearch(e.target.value)}
                                    placeholder="Search your items..."
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border bg-muted/30 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                        <div className="overflow-y-auto max-h-[50vh] p-3 space-y-2">
                            {pickerLoading ? (
                                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={28} /></div>
                            ) : filteredPickerItems.length === 0 ? (
                                <div className="flex flex-col items-center py-8 text-muted-foreground gap-2">
                                    <ImageIcon size={32} className="opacity-30" />
                                    <p className="text-sm">No items found</p>
                                </div>
                            ) : (
                                filteredPickerItems.map(item => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => { setSelectedItem(item); setPickerOpen(false); }}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all text-left ${selectedItem?.id === item.id ? 'ring-2 ring-primary bg-primary/5' : 'border'}`}
                                    >
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                            {item.itemImage ? (
                                                <img src={item.itemImage} alt={item.itemName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Package size={18} /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{item.itemName}</p>
                                            <p className="text-xs text-muted-foreground">{item.category} · ${Number(item.price).toLocaleString()}</p>
                                        </div>
                                        {selectedItem?.id === item.id && (
                                            <span className="text-xs font-semibold text-primary flex-shrink-0">Selected</span>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
