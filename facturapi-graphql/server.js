const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const connectDB = require("./src/config/db");
const typeDefs = require("./src/typeDefs");
const resolvers = require("./src/resolvers");
require("dotenv").config();
const path = require("path");

const startServer = async () => {
  connectDB(); // Conectar MongoDB
  const app = express();
  app.use('/facturas', express.static(path.join(__dirname, 'pdfs')));
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  server.applyMiddleware({ app });

  return app;
};

module.exports = startServer;