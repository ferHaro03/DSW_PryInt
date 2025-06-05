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
  
  
  input FacturaUpdateInput {
  cliente: ClienteInputFactura
  productos: [ProductoFacturaInput]
  total: Float
  pdf_url: String
  resumen: String
  status: String
  fecha: String
  }

  type Query {
    hello: String
    getAllFacturas: [Factura]
    getProductos: [Producto]
    getClientes: [Cliente]
    getFacturaById(id: ID!): Factura
  }
  
  type Producto {
  id: ID!
  description: String!
  price: Float!
  product_key: String!
  facturapi_id: String
  }

  input ProductoFacturaInput {
  description: String
  price: Float
  quantity: Int
  }

  
  input ProductoInputCreacion {
  description: String!
  price: Float!
  product_key: String!
  quantity: Int!      
  }

  type CrearProductoResponse {
  success: Boolean!
  mensaje: String!
  producto: Producto
  }

  input ProductoInput {
  description: String!
  price: Float!
  quantity: Int!
  }

input ClienteInput {
  tax_id: String!          # Solo este es obligatorio para buscar al cliente
  legal_name: String
  tax_system: String
  email: String
  phone: String
  whatsapp: String
  address: DireccionInput
}

  input DireccionInput {
  zip: String!
  street: String!
  exterior: String!
  neighborhood: String!
  city: String!
  municipality: String!
  state: String!
  country: String!
  }

  type CrearClienteResponse {
  success: Boolean!
  mensaje: String!
  cliente: Cliente
  }

  type Cliente {
  id: ID!
  legal_name: String!
  tax_id: String!
  tax_system: String!
  email: String!
  phone: String
  whatsapp: String
  address: Direccion  # 👈 Añadir también en tipo de respuesta
}

  type Direccion {
  zip: String
  street: String
  exterior: String
  neighborhood: String
  city: String
  municipality: String
  state: String
  country: String
  } 

  type CrearClienteResponse {
  success: Boolean!
  mensaje: String!
  cliente: Cliente
}

  input FacturaInput {
  customer: ClienteInput!
  items: [ProductoInput!]!
  }

  input ClienteInputFactura {
  legal_name: String
  tax_id: String
  email: String
  } 

  type Mutation {
  emitirFactura(input: FacturaInput!): Factura
  deleteFactura(id: ID!): Boolean
  getAllFacturas: [Factura]
  getFacturaById(id: ID!): Factura
  crearProducto(input: ProductoInputCreacion!): CrearProductoResponse!
  crearCliente(input: ClienteInput!): CrearClienteResponse
  updateFactura(id: ID!, input: FacturaUpdateInput): Factura
  }
`;

