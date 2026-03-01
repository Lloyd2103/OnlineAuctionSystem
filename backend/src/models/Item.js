import { DataTypes } from 'sequelize';
import sequelize from '../libs/db.js';

const Item = sequelize.define('Item', {
    itemName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    itemDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    itemAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    itemStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'available'
    },
    itemImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    category: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    attributes: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Lưu các thuộc tính động tùy theo category'
    }
}, {
    tableName: 'items',
    timestamps: true
});

export default Item;