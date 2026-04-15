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

export type ItemCategory = 'All' | 'Electronics' | 'Art' | 'Fashion' | 'Jewelry' | 'Media' | 'Vehicles' | 'Real Estates' | 'Sports' | 'Collectibles' | 'Other';
