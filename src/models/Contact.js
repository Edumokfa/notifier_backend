const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Contact = sequelize.define('Contact', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  recebeEmail: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  recebeWhatsapp: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
});

User.hasMany(Contact, { foreignKey: 'userId' });
Contact.belongsTo(User, { foreignKey: 'userId' });

module.exports = Contact;