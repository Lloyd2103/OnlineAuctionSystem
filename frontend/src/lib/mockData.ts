export interface Item {
  id: string;
  title: string;
  category: string;
  condition: string;
  status: string;
  images: string[];
}

export interface Auction {
  id: string;
  title: string;
  currentPrice: number;
  totalBids: number;
  endTime: string;
  status: string;
  images: string[];
}

export interface Transaction {
  id: string;
  auctionTitle: string;
  winnerName: string;
  totalAmount: number;
  paymentStatus: string;
  shippingStatus: string;
}

export const mockItems: Item[] = [
  { id: '1', title: 'Vintage Watch', category: 'Jewelry', condition: 'Good', status: 'ready', images: [''] }
];

export const mockAuctions: Auction[] = [
  { id: '1', title: 'Vintage Watch', currentPrice: 500, totalBids: 10, endTime: new Date().toISOString(), status: 'active', images: [''] }
];

export const mockTransactions: Transaction[] = [
  { id: 'TX1', auctionTitle: 'Vintage Watch', winnerName: 'John', totalAmount: 500, paymentStatus: 'paid', shippingStatus: 'shipped' }
];
