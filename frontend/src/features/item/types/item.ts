export interface Item {
    id: number;
    userId: number;
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
    createItem: (itemName: string, itemDescription: string, itemAddress: string, itemStatus: string, itemImage: string, price: number, category: string, attributes: Record<string, string | number>) => Promise<void>;
    updateItem: (id: number, itemName: string, itemDescription: string, itemAddress: string, itemStatus: string, itemImage: string, price: number, category: string, attributes: Record<string, string | number>) => Promise<void>;
    deleteItem: (id: number) => Promise<void>;

}
