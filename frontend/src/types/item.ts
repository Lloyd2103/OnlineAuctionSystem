export interface Item {
    id: string;
    userId: string;
    itemName: string;
    itemDescription: string;
    itemAddress: string;
    itemStatus: string;
    itemImage: string;
    price: number;
    category: string;
    attributes: Record<string, string | number>;
    createdAt: string;
    updatedAt: string;
}

export type ItemCategory = 'All'

export interface ItemState {
    item: Item | null;
    loading: boolean;
    fetchItem: () => Promise<void>;
    createItem: (itemName: string, itemDescription: string, itemAddress: string, itemStatus: string, itemImage: string, price: number, category: string, attributes: Record<string, string | number | boolean | object>) => Promise<void>;
    updateItem: (itemId: string, itemName: string, itemDescription: string, itemAddress: string, itemStatus: string, itemImage: string, price: number, category: string, attributes: Record<string, string | number | boolean | object>) => Promise<void>;
    deleteItem: (itemId: string) => Promise<void>;
    uploadItemImage: (image: File) => Promise<string>;
}
