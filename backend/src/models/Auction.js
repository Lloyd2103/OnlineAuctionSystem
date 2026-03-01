import { DataTypes } from 'sequelize';
import sequelize from '../libs/db.js';

const Auction = sequelize.define('Auction', {
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'items',
            key: 'id'
        }
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    extendedUntil: {
        type: DataTypes.DATE,
        allowNull: true
    },
    auctionStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'UPCOMING'
    },
    startingPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    incrementPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    instantBuyPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    mandatoryDeposit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: true 
});

export default Auction;