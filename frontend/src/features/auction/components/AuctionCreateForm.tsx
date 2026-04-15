import { X, Gavel, Package, Loader2, CalendarDays, DollarSign } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';
import { useAuctionFormLogic } from '../hooks/useAuctionFormLogic';
import { ItemPicker } from './ItemPicker';
import type { Auction } from '../types';
import type { Item } from '@/features/item/types/item';

interface AuctionCreateFormProps {
    mode: 'create' | 'edit';
    auction?: Auction;
    preSelectedItem?: Partial<Item>;
    onSuccess: () => void;
    onCancel: () => void;
}

export function AuctionCreateForm({ mode, auction, preSelectedItem, onSuccess, onCancel }: AuctionCreateFormProps) {
    const {
        loading,
        form,
        selectedItem, setSelectedItem,
        picker,
        handleFieldChange,
        handleSubmit
    } = useAuctionFormLogic({ mode, auction, preSelectedItem, onSuccess });

    const PriceField = ({ label, field, hint }: { label: string; field: keyof typeof form; hint?: string }) => (
        <div>
            <label className="block text-sm font-medium mb-1.5">{label}</label>
            <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="number"
                    value={form[field] as number}
                    onChange={(e) => handleFieldChange(field, parseFloat(e.target.value) || 0)}
                    min={0} step={1}
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
                                        onClick={() => picker.setOpen(true)}
                                        className="text-xs text-primary font-medium hover:underline flex-shrink-0"
                                    >
                                        Change
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => picker.setOpen(true)}
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
                                className="w-full px-3 py-2.5 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm h-24 resize-none"
                                placeholder="Enter auction description"
                            />
                        </div>

                        {/* Times */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
                                    <CalendarDays size={13} /> Start Time <span className="text-destructive">*</span>
                                </label>
                                <DatePicker
                                    selected={form.startTime ? new Date(form.startTime) : null}
                                    onChange={(date: Date | null) => handleFieldChange('startTime', date ? date.toISOString() : '')}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    timeCaption="Giờ"
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    minDate={new Date()}
                                    placeholderText="Chọn ngày & giờ bắt đầu"
                                    locale={vi}
                                    className="w-full px-3.5 py-2.5 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                />
                            </div>

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
                                    minDate={form.startTime ? new Date(form.startTime) : new Date()}
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

            <ItemPicker
                isOpen={picker.isOpen}
                onClose={() => picker.setOpen(false)}
                search={picker.search}
                onSearchChange={picker.setSearch}
                items={picker.items}
                loading={picker.loading}
                selectedItemId={selectedItem?.id}
                onSelect={(item) => { setSelectedItem(item); picker.setOpen(false); }}
            />
        </>
    );
}
