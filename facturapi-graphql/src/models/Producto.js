const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  description: String,
  price: Number,
  product_key: String,
  facturapi_id: String, // ID que devuelve FacturAPI
  quantity: Number       // ✅ Campo faltante para que coincida con el input
});

module.exports = mongoose.model('Producto', ProductoSchema);