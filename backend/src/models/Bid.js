import { DataTypes } from 'sequelize';
import sequelize from '../libs/db.js';

const Bid = sequelize.define('Bid', {
    auctionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'auctions',
            key: 'id'
        }
    },
    bidderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    bidTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    isWinningBid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'bids',
    timestamps: true 
});

export default Bid;