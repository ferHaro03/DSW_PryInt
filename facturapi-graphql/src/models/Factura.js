const mongoose = require("mongoose");

const facturaSchema = new mongoose.Schema({
  cliente: {
    legal_name: String,
    tax_id: String,
    email: String,
  },
  productos: [
    {
      description: String,
      price: Number,
      quantity: Number,
    },
  ],
  total: Number,
  pdf_url: String,
  resumen: String,
  status: String,
  fecha: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Factura", facturaSchema);
