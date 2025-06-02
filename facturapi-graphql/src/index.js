const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
require("dotenv").config();
const axios = require("axios");
const { generarResumen } = require("./services/openaiService");


// Definición del esquema GraphQL
const typeDefs = gql`
  type Factura {
    id: String
    status: String
    pdf_url: String
    resumen: String
  }

  input ProductoInput {
    description: String!
    price: Float!
    quantity: Int!
  }

  input ClienteInput {
    legal_name: String!
    tax_id: String!
    email: String!
  }

  input FacturaInput {
    customer: ClienteInput!
    items: [ProductoInput!]!
  }

  type Mutation {
    emitirFactura(input: FacturaInput!): Factura
  }

  type Query {
    hello: String
  }
`;


// Funciones (resolvers) de las operaciones
const resolvers = {
  Query: {
    hello: () => "Hola desde la API GraphQL 🚀",
  },
  Mutation: {
        emitirFactura: async (_, { input }) => {
        const facturaData = {
            payment_form: "08",
            use: "S01",
            customer: {
            legal_name: input.customer.legal_name,
            tax_id: input.customer.tax_id,
            tax_system: "616",
            email: input.customer.email,
            address: { zip: "83240" }
            },
            items: input.items.map(item => ({
            quantity: item.quantity,
            product: {
                description: item.description,
                product_key: "01010101",
                price: item.price,
                taxes: [{ type: "iva", rate: 0.16 }]
            }
            }))
        };

        const url = "https://sandbox.facturapi.io/v2/invoices";

        // Generar resumen primero
        const resumen = await generarResumen(input.customer, input.items);

        try {
            const { data } = await axios.post(url, facturaData, {
            headers: {
                Authorization: `Bearer ${process.env.FACTURAPI_KEY}`,
                "Content-Type": "application/json"
            }
            });

            return {
            id: data.id,
            status: data.status,
            pdf_url: data.pdf_url,
            resumen
            };
        } catch (error) {
            if (error.code === 'ENOTFOUND' || error.message.includes('getaddrinfo')) {
            console.warn("🌐 Sandbox no accesible, usando factura simulada.");
            return {
                id: "simulada_factura_001",
                status: "simulada",
                pdf_url: "https://miapp.com/factura-demo.pdf",
                resumen
            };
            }

            if (error.response) {
            console.error("❌ Error FacturAPI:", JSON.stringify(error.response.data, null, 2));
            } else {
            console.error("❌ Error sin respuesta:", error.message);
            }

            throw new Error("No se pudo emitir la factura.");
        }
    }
  }
};

// Inicializar servidor Express con Apollo
async function start() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}/graphql`);
  });
}

start();
