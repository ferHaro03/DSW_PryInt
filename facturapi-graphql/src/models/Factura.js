// Importa mongoose, la biblioteca para modelar objetos y conectarse a MongoDB
const mongoose = require("mongoose");

// Define el esquema de una factura usando mongoose.Schema
const facturaSchema = new mongoose.Schema({
  // Información del cliente que recibe la factura
  cliente: {
    legal_name: String,   // Nombre legal del cliente
    tax_id: String,       // RFC u otro identificador fiscal
    email: String,        // Correo electrónico del cliente
  },

  // Lista de productos incluidos en la factura
  productos: [
    {
      description: String, // Descripción del producto
      price: Number,       // Precio unitario del producto
      quantity: Number,    // Cantidad comprada
    },
  ],

  // Total de la factura (suma de subtotales de productos)
  total: Number,

  // URL del archivo PDF generado con los datos de la factura
  pdf_url: String,

  // Resumen generado automáticamente usando OpenAI
  resumen: String,

  // Estado de la factura (por ejemplo: "enviada", "pendiente", "pagada")
  status: String,

  // Fecha de emisión de la factura. Se establece automáticamente a la fecha actual
  fecha: {
    type: Date,
    default: Date.now,
  },
});

// Exporta el modelo 'Factura', asociado a la colección 'facturas' en MongoDB
module.exports = mongoose.model("Factura", facturaSchema);
