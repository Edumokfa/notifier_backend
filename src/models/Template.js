const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Template = sequelize.define('Template', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    key_wpp: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    template_wpp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone_number_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    components: {
        type: DataTypes.JSON,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
        model: User,
        key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    type: {
        type: DataTypes.ENUM('whatsapp', 'email'),
        defaultValue: 'whatsapp',
        allowNull: true
    },
    email_body: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    email_subject: {
        type: DataTypes.STRING,
        allowNull: true
    }
    }, {
    sequelize,
    modelName: 'Template',
    tableName: 'Templates',
    timestamps: true
    });

User.hasMany(Template, { foreignKey: 'userId' });
Template.belongsTo(User, { foreignKey: 'userId' });

module.exports = Template;