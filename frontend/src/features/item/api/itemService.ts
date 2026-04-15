import api from "@/lib/axios";

export const itemService = {
    fetchItems: async () => {
        const response = await api.get('/items');
        return response.data;
    },
    fetchItemById: async (id: number) => {
        const response = await api.get(`/items/${id}`);
        return response.data;
    },

    async createItem(itemName: string, itemDescription: string, itemAddress: string, itemStatus: string, imageFile: File | string, price: number, category: string, attributes: Record<string, string | number>) {
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

        const response = await api.post('/items', formData, { 
            withCredentials: true 
        });

        return response.data.item;
    },

    updateItem: async (id: number, itemName: string, itemDescription: string, itemAddress: string, itemStatus: string, imageFile: File | string, price: number, category: string, attributes: Record<string, string | number>) =>{
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
        
        const response = await api.put(`/items/${id}`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return response.data;
    },

    deleteItem: async (id: number) => {
        const response = await api.delete(`/items/${id}`);
        return response.data;
    },

    fetchMyItems: async () => {
        const response = await api.get('/items/my');
        return response.data;
    },

}
