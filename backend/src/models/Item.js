import { DataTypes } from 'sequelize';
import sequelize from '../libs/db.js';

const Item = sequelize.define('Item', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    itemName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    itemDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    itemAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    itemStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending' // pending, approved, rejected, available
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