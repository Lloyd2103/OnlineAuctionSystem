import { X, Search, Package, Loader2, ImageIcon } from 'lucide-react';
import type { Item } from '@/features/item/types/item';

interface ItemPickerProps {
    isOpen: boolean;
    onClose: () => void;
    search: string;
    onSearchChange: (search: string) => void;
    items: Item[];
    loading: boolean;
    selectedItemId?: string | number;
    onSelect: (item: Item) => void;
}

export function ItemPicker({
    isOpen,
    onClose,
    search,
    onSearchChange,
    items,
    loading,
    selectedItemId,
    onSelect
}: ItemPickerProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 bg-card rounded-2xl shadow-2xl w-full max-w-lg border overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h3 className="font-bold text-base">Select Item</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
                        <X size={16} />
                    </button>
                </div>
                <div className="px-4 py-3 border-b">
                    <div className="relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search your items..."
                            className="w-full pl-9 pr-3 py-2 rounded-lg border bg-muted/30 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>
                <div className="overflow-y-auto max-h-[50vh] p-3 space-y-2">
                    {loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={28} /></div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center py-8 text-muted-foreground gap-2">
                            <ImageIcon size={32} className="opacity-30" />
                            <p className="text-sm">No items found</p>
                        </div>
                    ) : (
                        items.map(item => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onSelect(item)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all text-left ${selectedItemId === String(item.id) ? 'ring-2 ring-primary bg-primary/5' : 'border'}`}
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
                                {selectedItemId === String(item.id) && (
                                    <span className="text-xs font-semibold text-primary flex-shrink-0">Selected</span>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
