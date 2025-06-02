const axios = require("axios");
const { generarResumen } = require('./services/vertexService');
const Factura = require("./models/Factura");
require('dotenv').config();
const { generarFacturaPDF } = require('./services/pdfService');

module.exports = {
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
        taxes: [{ type: "IVA", rate: 0.16 }]
      }
    })),
    
  };

      const resumen = await generarResumen(input.customer, input.items);
      const total = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      try {
        const { data } = await axios.post(
        "https://www.facturapi.io/v2/invoices",
        facturaData,
        {
            headers: {
            Authorization: `Bearer ${process.env.FACTURAPI_KEY}`,
            "Content-Type": "application/json"
            }
        }
        );
        let guardado = false;
        let pdfPath = null; // 👈 Declarado fuera del try
        try {
          await Factura.create({
            cliente: input.customer,
            productos: input.items,
            total,
            pdf_url: data.pdf_url,
            resumen,
            status: data.status
          });
          guardado = true;
           pdfPath = generarFacturaPDF({
            cliente: input.customer,
            productos: input.items,
            total,
            resumen,
            fecha: new Date().toISOString(),
            folio: data.folio_number,
            status: data.status
            }, data.id);
        } catch (error) {
          console.error("❌ Error al guardar en MongoDB:", error.message);
        }

        return {
          id: data.id,
          cliente: input.customer,
          productos: input.items,
          total,
          pdf_local: `http://localhost:3333/facturas/${data.id}.pdf`, 
          resumen,
          status: data.status,
          fecha: new Date().toISOString(),
          mensaje: guardado
            ? "Factura guardada correctamente en la base de datos."
            : "Factura emitida pero NO se guardó en MongoDB."
        };

      } catch (error) {
        console.error("❌ Error al emitir factura en FacturAPI:", error.response?.data || error.message);
        return {
          id: "simulada_factura_001",
          cliente: input.customer,
          productos: input.items,
          total,
          pdf_url: "https://miapp.com/factura-demo.pdf",
          resumen,
          status: "simulada",
          fecha: new Date().toISOString(),
          mensaje: "Sandbox no disponible. Se devolvió una factura simulada y NO se guardó en MongoDB."
        };
      }
    }
  }
};