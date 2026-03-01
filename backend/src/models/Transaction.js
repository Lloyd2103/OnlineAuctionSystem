import { DataTypes } from 'sequelize';
import sequelize from '../libs/db.js';

const Transaction = sequelize.define('Transaction', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    auctionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'auctions',
            key: 'id'
        }
    },
    type: {
        type: enum('DEPOSIT', 'WITHDRAW','AUCTION_PAYMENT','REFUND'),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    transactionStatus: {
        type: enum('PENDING', 'COMPLETED', 'FAILED'),
        allowNull: false,
        defaultValue: 'PENDING'
    },
    paymentMethod: {
        type: enum('CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER'),
        allowNull: false
    },
    paymentStatus: {
        type: enum('PENDING', 'COMPLETED', 'FAILED'),
        allowNull: false,
        defaultValue: 'PENDING'
    },
    walletBalance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    externalId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
}, {
    tableName: 'transactions',
    timestamps: true
});

export default Transaction;
