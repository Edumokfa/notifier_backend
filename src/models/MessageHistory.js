const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const MessageHistory = sequelize.define('MessageHistory', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id'
        }
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    requestPayload: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    responsePayload: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    statusCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    messageStatus: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    messageId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    channelType: {
        type: DataTypes.ENUM('whatsapp', 'email'),
        allowNull: false,
        defaultValue: 'whatsapp',
    }
}, {
    timestamps: true,
});

MessageHistory.belongsTo(User, { 
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    as: 'user'
});

User.hasMany(MessageHistory, { 
    foreignKey: 'userId',
    as: 'messageHistory'
});


module.exports = MessageHistory;