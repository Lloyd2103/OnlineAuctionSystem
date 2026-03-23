import { create } from "zustand";
import { toast } from "sonner";
import type { ItemState } from "@/types/item";
import { itemService } from "@/services/itemService";


export const useItemStore = create<ItemState>((set) => ({
    item: null,
    loading: false,

    fetchItem: async () => {
        try {
            set({ loading: true });
            const item = await itemService.fetchItems();
            set({ item });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch item. Please try again.");
        } finally {
            set({ loading: false });
        }
    },

    createItem: async (itemName: string, itemDescription: string, itemAddress: string, itemStatus: string, itemImage: string, price: number, category: string, attributes: Record<string, string | number | boolean | object>) => {
        try {
            set({ loading: true });
            const item = await itemService.createItem(itemName, itemDescription, itemAddress, itemStatus, itemImage, price, category, attributes);
            set({ item });
            toast.success("Item created successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Item creation failed. Please try again.");
        } finally {
            set({ loading: false });
        }
    },

    updateItem: async (itemId: string, itemName: string, itemDescription: string, itemAddress: string, itemStatus: string, itemImage: string, price: number, category: string, attributes: Record<string, string | number | boolean | object>) => {
        try {
            set({ loading: true });
            const item = await itemService.updateItem(itemId, itemName, itemDescription, itemAddress, itemStatus, itemImage, price, category, attributes);
            set({ item });
            toast.success("Item updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Item update failed. Please try again.");
        } finally {
            set({ loading: false });
        }
    },

    deleteItem: async (itemId: string) => {
        try {
            set({ loading: true });
            await itemService.deleteItem(itemId);
            toast.success("Item deleted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Item deletion failed. Please try again.");
        } finally {
            set({ loading: false });
        }
    },

    uploadItemImage: async (image: File) => {
        try {
            set({ loading: true });
            const imageUrl = await itemService.uploadItemImage(image);
            return imageUrl;
        } catch (error) {
            console.error(error);
            toast.error("Image upload failed. Please try again.");
            return "";
        } finally {
            set({ loading: false });
        }
    },
}));