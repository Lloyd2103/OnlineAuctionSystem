import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { itemService } from '../api/itemService';
import type { Item } from '../types';

export type AttributeEntry = { key: string; value: string };

interface UseItemFormLogicProps {
    mode: 'create' | 'edit';
    item?: Item;
    onSuccess: () => void;
}

export function useItemFormLogic({ mode, item, onSuccess }: UseItemFormLogicProps) {
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
        if (typeof rawAttributes === 'string') {
            try { rawAttributes = JSON.parse(rawAttributes); } 
            catch { return [{ key: '', value: '' }]; }
        }
        if (!rawAttributes || typeof rawAttributes !== 'object') {
            return [{ key: '', value: '' }];
        }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.itemName.trim()) { toast.error('Item name is required'); return; }
        if (form.price <= 0) { toast.error('Price must be greater than 0'); return; }

        try {
            setLoading(true);
            const attrs: Record<string, string | number> = {};
            attributes.forEach(({ key, value }) => {
                if (key.trim()) attrs[key] = value;
            });

            if (mode === 'create') {
                await itemService.createItem(
                    form.itemName, form.itemDescription, form.itemAddress,
                    form.itemStatus, imageFile, form.price, form.category, attrs
                );
                toast.success('Item created successfully!');
            } else if (item) {
                await itemService.updateItem(
                    item.id, form.itemName, form.itemDescription, form.itemAddress,
                    form.itemStatus, imageFile, form.price, form.category, attrs
                );
                toast.success('Item updated successfully!');
            }
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message ?? (mode === 'create' ? 'Failed to create item' : 'Failed to update item'));
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        form,
        image: {
            preview: imagePreview,
            setPreview: setImagePreview,
            setFile: setImageFile,
            ref: fileInputRef,
            dragOver,
            setDragOver,
            handleFile: handleImageFile,
            handleDrop
        },
        attributes: {
            list: attributes,
            change: handleAttrChange,
            add: addAttribute,
            remove: removeAttribute
        },
        handleFieldChange,
        handleSubmit
    };
}
