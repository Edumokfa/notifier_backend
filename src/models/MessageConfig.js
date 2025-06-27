const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Template = require('./Template');

const MessageConfig = sequelize.define('MessageConfig', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  
  channelType: {
    type: DataTypes.ENUM('whatsapp', 'email', 'sms'),
    allowNull: false
  },
  
  emailConfig: {
    type: DataTypes.JSON,
    allowNull: true,
    validate: {
      validateEmailConfig(value) {
        if (this.channelType === 'email') {
          if (!value || !value.smtpServer || !value.smtpPort || 
              !value.username || !value.password) {
            throw new Error('Configurações de E-mail são obrigatórias');
          }
        }
      }
    }
  },
  
  executionFrequency: {
    type: DataTypes.ENUM(
      'every_1_hour', 
      'every_6_hours', 
      'every_12_hours', 
      'every_24_hours', 
      'every_7_days', 
      'every_15_days', 
      'every_30_days', 
      'every_60_days', 
      'every_90_days', 
      'every_180_days', 
      'every_1_year'
    ),
    allowNull: false
  },
  
  nextExecutionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Template,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'paused'),
    defaultValue: 'active'
  }
}, {
  hooks: {
    afterCreate: (config) => {
      config.updateNextExecutionDate();
    },
    afterUpdate: (config) => {
      if (config.changed('executionFrequency')) {
        config.updateNextExecutionDate();
      }
    }
  }
});

MessageConfig.prototype.updateNextExecutionDate = function() {
  const now = new Date();
  let nextDate;

  switch(this.executionFrequency) {
    case 'every_1_hour':
      nextDate = new Date(now.setHours(now.getHours() + 1));
      break;
    case 'every_6_hours':
      nextDate = new Date(now.setHours(now.getHours() + 6));
      break;
    case 'every_12_hours':
      nextDate = new Date(now.setHours(now.getHours() + 12));
      break;
    case 'every_24_hours':
      nextDate = new Date(now.setDate(now.getDate() + 1));
      break;
    case 'every_7_days':
      nextDate = new Date(now.setDate(now.getDate() + 7));
      break;
    case 'every_15_days':
      nextDate = new Date(now.setDate(now.getDate() + 15));
      break;
    case 'every_30_days':
      nextDate = new Date(now.setMonth(now.getMonth() + 1));
      break;
    case 'every_60_days':
      nextDate = new Date(now.setMonth(now.getMonth() + 2));
      break;
    case 'every_90_days':
      nextDate = new Date(now.setMonth(now.getMonth() + 3));
      break;
    case 'every_180_days':
      nextDate = new Date(now.setMonth(now.getMonth() + 6));
      break;
    case 'every_1_year':
      nextDate = new Date(now.setFullYear(now.getFullYear() + 1));
      break;
    default:
      nextDate = now;
  }

  this.nextExecutionDate = nextDate;
  return nextDate;
};

MessageConfig.belongsTo(User, { 
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    as: 'user'
});

MessageConfig.belongsTo(Template, { 
    foreignKey: 'templateId',
    as: 'template'
});

User.hasMany(MessageConfig, { 
    foreignKey: 'userId',
    as: 'messageConfigurations'
});

module.exports = MessageConfig;