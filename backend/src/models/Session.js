import { DataTypes } from 'sequelize';
import sequelize from '../libs/db.js';

const Session = sequelize.define('Session', {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: false
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'sessions',
    timestamps: true,
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['expiresAt']
        }
    ]
});

export default Session;