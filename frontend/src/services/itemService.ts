import api from "@/lib/axios";
import type { Item } from "@/types/item";

export const itemService = {
    fetchItems: async () => {
        const response = await api.get('/items');
        return response.data;
    },
    fetchItemById: async (itemId: string) => {
        const response = await api.get(`/items/${itemId}`);
        return response.data;
    },

    async createItem(itemName: string, itemDescription: string, itemAddress: string, itemStatus: string, imageFile: File | string, price: number, category: string, attributes: Record<string, string>) {
        const formData = new FormData();
        formData.append('itemName', itemName);
        formData.append('itemDescription', itemDescription);
        formData.append('itemAddress', itemAddress);
        formData.append('itemStatus', itemStatus);
        formData.append('price', price.toString());
        formData.append('category', category);
        formData.append('attributes', JSON.stringify(attributes));
        
        if (imageFile) {
            formData.append('image', imageFile); 
        }
        const res = await api.post('/items', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return res.data;
    },

    updateItem: async (data: Omit<Partial<Item>, 'itemImage'> & { itemImage?: File | string }) => {
        const { id, ...rest } = data;
        const formData = new FormData();

        Object.entries(rest).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (value instanceof File) {
                    formData.append(key, value);
                } 
                else if (key === 'attributes' && typeof value === 'object') {
                    formData.append(key, JSON.stringify(value));
                } 
                else {
                    formData.append(key, String(value));
                }
            }
        });
        
        const response = await api.put(`/items/${id}`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return response.data;
    },

    deleteItem: async (itemId: string) => {
        const response = await api.delete(`/items/${itemId}`);
        return response.data;
    },

    fetchMyItems: async () => {
        const response = await api.get('/items/my');
        return response.data;
    },

}
