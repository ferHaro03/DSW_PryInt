// Importa la librería dotenv para cargar variables de entorno desde un archivo .env
const dotenv = require('dotenv');

// Ejecuta el método config() para que las variables de entorno definidas en .env estén disponibles en process.env
dotenv.config();

// Exporta un objeto con las variables de configuración del entorno.
// Si alguna variable no está definida en el archivo .env, se asigna un valor por defecto.
module.exports = {
  // Dirección del servidor, por defecto 'localhost'
  HOST: process.env.HOST || 'localhost',

  // Puerto en el que se ejecuta la aplicación, por defecto 3333
  PORT: process.env.PORT || 3333,

  // Ruta base para la API, por defecto '/api/v1'
  API_URL: process.env.API_URL || '/api/v1',

  // Cadena de conexión a MongoDB, requerida para conectarse a la base de datos
  CONNECTION_STRING: process.env.CONNECTION_STRING || 'SIN_CADENA_MONGO',

  // Nombre de la base de datos a usar, por defecto 'db_default'
  DATABASE: process.env.DATABASE || 'db_default',

  // Usuario de la base de datos, por defecto 'admin'
  DB_USER: process.env.DB_USER || 'admin',

  // Contraseña de la base de datos, por defecto 'admin'
  DB_PASSWORD: process.env.DB_PASSWORD || 'admin'
};
