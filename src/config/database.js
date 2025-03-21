// src/config/database.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o MySQL estabelecida com sucesso');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };