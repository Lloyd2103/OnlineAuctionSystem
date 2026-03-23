import sequelize from '../libs/db.js';
import User from './User.js';
import Item from './Item.js';
import Auction from './Auction.js';
import Bid from './Bid.js';
import Transaction from './Transaction.js';

// --- 1. Quan hệ Seller - Item (own/sell) ---
// Một Seller (User) sở hữu nhiều Item
User.hasMany(Item, { foreignKey: 'userId', as: 'ownedItems' });
Item.belongsTo(User, { foreignKey: 'userId', as: 'seller' });

// --- 2. Quan hệ Seller - Auctions (create) ---
// Một Seller tạo nhiều cuộc đấu giá
User.hasMany(Auction, { foreignKey: 'ownerId', as: 'createdAuctions' });
Auction.belongsTo(User, { foreignKey: 'ownerId', as: 'seller' });

// --- 3. Quan hệ Auctions - Items (Used To) ---
// Một Auction sử dụng một Item (1-1 hoặc 1-N tùy logic, thường là 1 Item cho 1 Auction)
Item.hasMany(Auction, { foreignKey: 'itemId', as: 'auctions' });
Auction.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

// --- 4. Quan hệ Staff - Auctions (Manage) ---
// Một Staff (User) quản lý nhiều Auction
User.hasMany(Auction, { foreignKey: 'staffId', as: 'managedAuctions' });
Auction.belongsTo(User, { foreignKey: 'staffId', as: 'staff' });

// --- 5. Quan hệ Bider - Bid - Auctions (Bid) ---
// Bidder đặt giá
User.hasMany(Bid, { foreignKey: 'bidderId', as: 'bids' });
Bid.belongsTo(User, { foreignKey: 'bidderId', as: 'bidder' });

// Auction có nhiều lượt đặt giá
Auction.hasMany(Bid, { foreignKey: 'auctionId', as: 'bids' });
Bid.belongsTo(Auction, { foreignKey: 'auctionId', as: 'auction' });

// --- 6. Quan hệ Transaction (Giao dịch sau đấu giá) ---
// Một Auction có nhiều Transaction (hoặc 1 tùy hệ thống)
Auction.hasMany(Transaction, { foreignKey: 'auctionId', as: 'transactions' });
Transaction.belongsTo(Auction, { foreignKey: 'auctionId', as: 'auction' });

// Transaction liên quan đến người thắng (Bidder)
User.hasMany(Transaction, { foreignKey: 'bidderId', as: 'purchaseTransactions' });
Transaction.belongsTo(User, { foreignKey: 'bidderId', as: 'bidder' });

export {
    sequelize,
    User,
    Item,
    Auction,
    Bid,
    Transaction
};