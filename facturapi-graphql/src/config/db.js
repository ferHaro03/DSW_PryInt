// Importa la librería Mongoose, que permite conectar y trabajar con MongoDB en Node.js
const mongoose = require('mongoose');

// Importa la configuración de variables de entorno desde un archivo personalizado
const dotenvXConfig = require('./dotenvXConfig');

// Función asincrónica para conectar a la base de datos MongoDB
const connectDB = async () => {
  try {
    // Intenta establecer la conexión utilizando la cadena de conexión y el nombre de la base de datos desde dotenvXConfig
    const db = await mongoose.connect(dotenvXConfig.CONNECTION_STRING, {
      dbName: dotenvXConfig.DATABASE, // Nombre de la base de datos a usar
    });

    // Si la conexión es exitosa, imprime el nombre de la base de datos conectada
    console.log('Database is connected to: ', db.connection.name);
  } catch (error) {
    // Si ocurre un error al conectar, lo muestra en consola y finaliza el proceso
    console.error('❌ Error de conexión a MongoDB:', error);
    process.exit(1); // Sale del proceso con error
  }
};

// Exporta la función para que pueda ser utilizada en otras partes del proyecto
module.exports = connectDB;
