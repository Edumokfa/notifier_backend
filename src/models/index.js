const User = require('./User');
const Contact = require('./Contact');
const Template = require('./Template');
const { sequelize } = require('../config/database');

const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados com o banco de dados');
  } catch (error) {
    console.error('Erro ao sincronizar modelos:', error);
    process.exit(1);
  }
};

module.exports = {
  User,
  Contact,
  Template,
  syncModels
};