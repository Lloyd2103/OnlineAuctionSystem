import { DataTypes } from 'sequelize';
import sequelize from '../libs/db.js';


const User = sequelize.define('User', {
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    userPhone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    userAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
    identifiedStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'unidentified'
    },
    userImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false
    },
    walletBalance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    ratingScore: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    ratingCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'users',
    timestamps: true,
    indexes: [
        { fields: ['userStatus'] }
    ]
});

export default User;