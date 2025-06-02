const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3333,
  API_URL: process.env.API_URL || '/api/v1',
  CONNECTION_STRING: process.env.CONNECTION_STRING || 'SIN_CADENA_MONGO',
  DATABASE: process.env.DATABASE || 'db_default',
  DB_USER: process.env.DB_USER || 'admin',
  DB_PASSWORD: process.env.DB_PASSWORD || 'admin'
};
