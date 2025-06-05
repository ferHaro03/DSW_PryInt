const axios = require("axios");
const Cliente = require("../models/Cliente");

async function crearClienteFacturapi(cliente) {
  try {
    const { data } = await axios.post(
      "https://www.facturapi.io/v2/customers",
      {
        legal_name: cliente.legal_name,
        tax_id: cliente.tax_id,
        email: cliente.email,
        tax_system: "616",
        phone: cliente.phone || "", // "Sin valor" lo puedes dejar como cadena vacía
        address: {
            zip: cliente.address.zip,
            street: cliente.address.street,
            exterior: cliente.address.exterior,
            neighborhood: cliente.address.neighborhood,
            city: cliente.address.city,
            municipality: cliente.address.municipality,
            state: cliente.address.state,
            country: cliente.address.country
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FACTURAPI_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    return data;
  } catch (error) {
    console.error("❌ Error al crear cliente en FacturAPI:", error.response?.data || error.message);
    return null;
  }
}




module.exports = { crearClienteFacturapi };