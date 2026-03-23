import { useState, useRef, useCallback } from 'react';
import { X, Plus, Upload, ImageIcon, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { itemService } from '@/services/itemService';
import type { Item } from '@/types/item';

const CATEGORIES = ['Electronics', 'Art', 'Fashion', 'Jewelry', 'Media', 'Vehicles', 'Real Estates', 'Sports', 'Collectibles', 'Other'];
const STATUSES = ['Available', 'Pending', 'In Auction', 'Sold'];

type AttributeEntry = { key: string; value: string };

interface ItemCreateFormProps {
    mode: 'create' | 'edit';
    item?: Item;
    onSuccess: () => void;
    onCancel: () => void;
}

export function ItemCreateForm({ mode, item, onSuccess, onCancel }: ItemCreateFormProps) {
    const [loading, setLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        itemName: item?.itemName ?? '',
        itemDescription: item?.itemDescription ?? '',
        itemAddress: item?.itemAddress ?? '',
        itemStatus: item?.itemStatus ?? 'Available',
        price: item?.price ?? 0,
        category: item?.category ?? 'Electronics',
    });

    const [imageFile, setImageFile] = useState<File | string>(item?.itemImage ?? '');
    const [imagePreview, setImagePreview] = useState<string>(item?.itemImage ?? '');

    const initAttributes = (): AttributeEntry[] => {
        let rawAttributes = item?.attributes;

        // 1. Kiểm tra nếu attributes là chuỗi JSON thì parse nó ra
        if (typeof rawAttributes === 'string') {
            try {
                rawAttributes = JSON.parse(rawAttributes);
            } catch (e) {
                console.error("Failed to parse attributes string:", e);
                return [{ key: '', value: '' }];
            }
        }

        // 2. Nếu không có dữ liệu hoặc không phải object, trả về dòng trống
        if (!rawAttributes || typeof rawAttributes !== 'object') {
            return [{ key: '', value: '' }];
        }

        // 3. Chuyển đổi Object thành mảng [{key, value}]
        const entries = Object.entries(rawAttributes);
        return entries.length > 0
            ? entries.map(([k, v]) => ({ key: k, value: String(v) }))
            : [{ key: '', value: '' }];
    };
    const [attributes, setAttributes] = useState<AttributeEntry[]>(initAttributes);

    const handleFieldChange = (field: keyof typeof form, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleImageFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleImageFile(file);
    }, []);

    const handleAttrChange = (index: number, field: 'key' | 'value', value: string) => {
        setAttributes(prev => prev.map((a, i) => i === index ? { ...a, [field]: value } : a));
    };

    const addAttribute = () => setAttributes(prev => [...prev, { key: "", value: "" }]);
    const removeAttribute = (index: number) => {
        setAttributes(prev => prev.filter((_, i) => i !== index));
    };

    const buildAttributes = (): Record<string, string> => {
        const result: Record<string, string> = {};
        attributes.forEach(({ key, value }) => {
            if (key.trim()) {
                result[key] = value;
                console.log(result);
            }
        });
        return result;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.itemName.trim()) { toast.error('Item name is required'); return; }
        if (form.price <= 0) { toast.error('Price must be greater than 0'); return; }

        try {
            setLoading(true);
            const attrs = buildAttributes();

            if (mode === 'create') {
                await itemService.createItem(
                    form.itemName, 
                    form.itemDescription, 
                    form.itemAddress,
                    form.itemStatus, 
                    imageFile,
                    form.price, 
                    form.category, 
                    attrs
                );
                toast.success('Item created successfully!');
            } else if (item) {
                await itemService.updateItem({
                    id: item.id,
                    itemName: form.itemName,
                    itemDescription: form.itemDescription,
                    itemAddress: form.itemAddress,
                    itemStatus: form.itemStatus,
                    price: form.price,
                    category: form.category,
                    attributes: attrs,
                    ...(imageFile ? { itemImage: imageFile } : {}),
                });
                toast.success('Item updated successfully!');
            }
            onSuccess();
        } catch (error: unknown) {
            const msg = error && typeof error === 'object' && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
                : undefined;
            toast.error(msg ?? (mode === 'create' ? 'Failed to create item' : 'Failed to update item'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Package className="text-primary w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">{mode === 'create' ? 'Add New Item' : 'Edit Item'}</h2>
                        <p className="text-xs text-muted-foreground">
                            {mode === 'create' ? 'Fill in the details for your new item' : 'Update your item information'}
                        </p>
                    </div>
                </div>
                <button onClick={onCancel} className="p-2 rounded-full hover:bg-muted transition-colors">
                    <X size={18} />
                </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
                <form id="item-form" onSubmit={handleSubmit} className="space-y-6">

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Item Image</label>
                        <div
                            className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer 
                                ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}
                                ${imagePreview ? 'h-48' : 'h-36'}`}
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-end justify-center pb-3 opacity-0 hover:opacity-100 transition-opacity">
                                        <span className="text-white text-sm font-medium flex items-center gap-1">
                                            <Upload size={14} /> Change Image
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setImagePreview(''); setImageFile(''); }}
                                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full text-white flex items-center justify-center hover:bg-black/80"
                                    >
                                        <X size={13} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                                    <ImageIcon size={28} />
                                    <p className="text-sm font-medium">Drag & drop or click to upload</p>
                                    <p className="text-xs">PNG, JPG, WEBP up to 10MB</p>
                                </div>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} />
                    </div>

                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-1.5">Item Name <span className="text-destructive">*</span></label>
                            <input
                                type="text"
                                value={form.itemName}
                                onChange={(e) => handleFieldChange('itemName', e.target.value)}
                                placeholder="e.g. Vintage Rolex Submariner"
                                className="w-full px-3.5 py-2.5 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-1.5">Description</label>
                            <textarea
                                value={form.itemDescription}
                                onChange={(e) => handleFieldChange('itemDescription', e.target.value)}
                                placeholder="Describe your item in detail..."
                                rows={3}
                                className="w-full px-3.5 py-2.5 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => handleFieldChange('category', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                            >
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Status</label>
                            <select
                                value={form.itemStatus}
                                onChange={(e) => handleFieldChange('itemStatus', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                            >
                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Starting Price (USD) <span className="text-destructive">*</span></label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => handleFieldChange('price', parseFloat(e.target.value) || 0)}
                                    placeholder="0.00"
                                    min={0}
                                    step={0.01}
                                    className="w-full pl-7 pr-3.5 py-2.5 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Location / Address</label>
                            <input
                                type="text"
                                value={form.itemAddress}
                                onChange={(e) => handleFieldChange('itemAddress', e.target.value)}
                                placeholder="e.g. Ho Chi Minh City, VN"
                                className="w-full px-3.5 py-2.5 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* JSONB Attributes */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <label className="block text-sm font-medium">Custom Attributes</label>
                                <p className="text-xs text-muted-foreground mt-0.5">Add extra metadata as key-value pairs (stored as JSONB)</p>
                            </div>
                            <button
                                type="button"
                                onClick={addAttribute}
                                className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                            >
                                <Plus size={13} /> Add Field
                            </button>
                        </div>
                        <div className="space-y-2">
                            {attributes.map((attr, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={attr.key}
                                        onChange={(e) => handleAttrChange(index, 'key', e.target.value)}
                                        placeholder="Key (e.g. brand)"
                                        className="flex-1 px-3 py-2 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                                    />
                                    <input
                                        type="text"
                                        value={attr.value}
                                        onChange={(e) => handleAttrChange(index, 'value', e.target.value)}
                                        placeholder="Value (e.g. Rolex)"
                                        className="flex-1 px-3 py-2 rounded-lg border bg-card focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeAttribute(index)}
                                        disabled={attributes.length === 1}
                                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30"
                                    >
                                        <X size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </form>
            </div>

            {/* Footer Actions */}
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
                    form="item-form"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
                >
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : (mode === 'create' ? 'Create Item' : 'Save Changes')}
                </button>
            </div>
        </div>
    );
}
