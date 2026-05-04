import {sequelize} from '../db.js';
import { DataTypes,Sequelize } from 'sequelize';

export const User = sequelize.define('User',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    account_created: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    account_updated: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    verification_token: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    verification_sent_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    verification_expiry_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    } 
},
{
    createdAt: 'account_created',
    updatedAt: 'account_updated'
  }
);


