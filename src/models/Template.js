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
        allowNull: false
    },
    template_wpp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    components: {
        type: DataTypes.JSON,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
        model: User,
        key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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