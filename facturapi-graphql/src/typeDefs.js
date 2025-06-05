// Importa la función gql de apollo-server-express para definir el schema
const { gql } = require("apollo-server-express");

// Exporta el schema GraphQL usando la plantilla de cadena
module.exports = gql`
"""Representa la información de un cliente que recibe una factura"""
  type Cliente {
  """Nombre legal del cliente"""
    legal_name: String
     """RFC o identificador fiscal del cliente"""
    tax_id: String
     """Correo electrónico del cliente"""
    email: String
    """Número telefónico para notificaciones SMS"""
    phone: String       
     """Número de WhatsApp para notificaciones"""
    whatsapp: String     
  }

  """Información de un producto incluido en una factura"""
  type Producto {
  """Descripción del producto"""
    description: String
    """Precio unitario del producto"""
    price: Float
    """Cantidad del producto adquirida"""
    quantity: Int
  }

 """Factura generada, incluyendo cliente, productos, totales y resumen"""
  type Factura {
   """ID único de la factura (proporcionado por FacturAPI)"""
    id: ID
     """Datos del cliente que recibe la factura"""
    cliente: Cliente
    """Lista de productos incluidos en la factura"""
    productos: [Producto]
    """Monto total de la factura"""
    total: Float
    """Resumen natural generado con IA (OpenAI) sobre la compra"""
    resumen: String
    """URL del PDF generado por FacturAPI"""
    pdf_url: String
    """Ruta local del PDF generado en el servidor"""
    pdf_local: String
    """Estado actual de la factura (ej. 'emitida', 'pendiente')"""
    status: String
    """Fecha de emisión de la factura"""
    fecha: String
    """Mensaje adicional o estado del proceso"""
    mensaje: String   
  }

 """Consultas disponibles en la API"""
  type Query {
  """Prueba de conexión: devuelve un saludo"""
    hello: String
    """Obtiene todas las facturas almacenadas"""
    getFacturas: [Factura]
  }

"""Input para los productos incluidos en una factura"""
  input ProductoInput {
    description: String!
    price: Float!
    quantity: Int!
  }

"""Input con los datos del cliente"""
  input ClienteInput {
    legal_name: String!
    tax_id: String!
    email: String!
    phone: String         
    whatsapp: String      
  }

 """Input general para emitir una nueva factura"""
  input FacturaInput {
    customer: ClienteInput!
    items: [ProductoInput!]!
  }

 """Mutaciones disponibles para gestionar facturas"""
  type Mutation {
  """Emite una nueva factura y genera notificaciones"""
    emitirFactura(input: FacturaInput!): Factura
    """Elimina una factura existente por ID"""
    deleteFactura(id: ID!): Boolean
    """Actualiza los datos de una factura existente"""
    updateFactura(id: ID!, input: FacturaInput!): Factura
    getAllFacturas: [Factura]
    getFacturaById(id: ID!): Factura
  }
`;

