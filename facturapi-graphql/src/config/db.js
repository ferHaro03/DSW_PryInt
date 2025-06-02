const mongoose = require('mongoose');
const dotenvXConfig = require('./dotenvXConfig');

const connectDB = async () => {
  try {
    const db = await mongoose.connect(dotenvXConfig.CONNECTION_STRING, {
      dbName: dotenvXConfig.DATABASE
    });
    console.log('Database is connected to: ', db.connection.name);
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;