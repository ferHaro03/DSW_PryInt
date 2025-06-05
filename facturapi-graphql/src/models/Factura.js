// Importa mongoose, la biblioteca para modelar objetos y conectarse a MongoDB
const mongoose = require("mongoose");

// Define el esquema de una factura usando mongoose.Schema
const facturaSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente", // referencia al modelo Cliente
    required: true
  },
  productos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto" // referencia al modelo Producto
    }
  ],
  total: Number,
  pdf_url: String,
  resumen: String,
  status: String,
  fecha: {
    type: Date,
    default: Date.now
  }
});
// Exporta el modelo 'Factura', asociado a la colección 'facturas' en MongoDB
module.exports = mongoose.model("Factura", facturaSchema);
