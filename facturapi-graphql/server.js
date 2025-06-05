// Importa Express, el framework HTTP para Node.js
const express = require("express");
// Importa ApolloServer para crear la API GraphQL
const { ApolloServer, gql } = require("apollo-server-express");
// Conexión a la base de datos MongoDB
const connectDB = require("./src/config/db");
// Importa los esquemas y resolvers de GraphQL
const typeDefs = require("./src/typeDefs");
const resolvers = require("./src/resolvers");
// Carga variables de entorno desde .env
require("dotenv").config();
// Módulo para trabajar con rutas del sistema
const path = require("path");
/**
 * Función principal que configura y arranca el servidor con Express + Apollo Server.
 * También expone los archivos PDF generados desde la carpeta `/pdfs`.
 *
 * @returns {Promise<Express.Application>} - Instancia de la aplicación Express configurada.
 */
const startServer = async () => {
  // Conecta a la base de datos MongoDB
  connectDB();
  // Crea una instancia de Express
  const app = express();
  // Sirve archivos PDF desde la ruta `/facturas`
  // Ej: http://localhost:4000/facturas/1234.pdf
  app.use('/facturas', express.static(path.join(__dirname, 'pdfs')));
  // Crea la instancia de Apollo Server con typeDefs y resolvers definidos
  const server = new ApolloServer({ typeDefs, resolvers });

  // Inicializa el servidor de Apollo
  await server.start();
  // Aplica Apollo Server como middleware de Express
  server.applyMiddleware({ app });

  // Retorna la aplicación para que pueda ser usada desde `index.js`
  return app;
};

// Exporta la función para ser ejecutada desde otro archivo
module.exports = startServer;