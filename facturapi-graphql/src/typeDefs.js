const { gql } = require("apollo-server-express");

module.exports = gql`
  type Cliente {
    legal_name: String
    tax_id: String
    email: String
    phone: String        # ✅ nuevo
    whatsapp: String     # ✅ nuevo
  }

  type Producto {
    description: String
    price: Float
    quantity: Int
  }

  type Factura {
    id: ID
    cliente: Cliente
    productos: [Producto]
    total: Float
    resumen: String
    pdf_url: String
    pdf_local: String
    status: String
    fecha: String
    mensaje: String   
  }

  type Query {
    hello: String
    getFacturas: [Factura]
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
    phone: String         # ✅ nuevo
    whatsapp: String      # ✅ nuevo
  }

  input FacturaInput {
    customer: ClienteInput!
    items: [ProductoInput!]!
  }

    type Mutation {
    emitirFactura(input: FacturaInput!): Factura
    deleteFactura(id: ID!): Boolean
    getAllFacturas: [Factura]
    getFacturaById(id: ID!): Factura
    updateFactura(id: ID!, input: FacturaInput!): Factura
  }
`;

