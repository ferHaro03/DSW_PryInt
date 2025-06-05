const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema({
  facturapi_id: String,      // ID que regresa FacturAPI
  legal_name: String,
  tax_id: String,
  tax_system: String,
  email: String,
  phone: String,
  whatsapp: String,
  address: {
    zip: String,
    street: String,
    exterior: String,
    neighborhood: String,
    city: String,
    municipality: String,
    state: String,
    country: String
  }
});

module.exports = mongoose.model("Cliente", ClienteSchema);
