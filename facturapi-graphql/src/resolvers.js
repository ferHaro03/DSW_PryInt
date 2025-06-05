const axios = require("axios");
const { generarResumen } = require('./services/vertexService');
const Factura = require("./models/Factura");
require('dotenv').config();
const { generarFacturaPDF } = require('./services/pdfService');
const { enviarFacturaPorCorreo } = require('./services/sendgridService');
const { sendSMS, sendWhatsApp } = require('./services/notificationsService');

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
        let pdfPath = null;

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

          pdfPath = await generarFacturaPDF({
            cliente: input.customer,
            productos: input.items,
            total,
            resumen,
            fecha: new Date().toISOString(),
            folio: data.folio_number,
            status: data.status
          }, data.id);

          //  SMS y WhatsApp 
          try {
            if (input.customer.phone) {
              await sendSMS(
                input.customer.phone,
                `Hola ${input.customer.legal_name}, gracias por tu compra. Tu factura fue enviada al correo. Total: $${total}`
              );
              console.log(" SMS enviado correctamente");
            }
          } catch (error) {
            console.error(" Error enviando SMS:", error.message);
          }

          try {
            if (input.customer.whatsapp) {
              await sendWhatsApp(
                input.customer.whatsapp,
                `Hola ${input.customer.legal_name}, gracias por tu compra. Tu factura fue enviada al correo. Total: $${total}`
              );
              console.log(" WhatsApp enviado correctamente");
            }
          } catch (error) {
            console.error(" Error enviando WhatsApp:", error.message);
          }


          // Correo con PDF
          await enviarFacturaPorCorreo({
            to: input.customer.email,
            subject: 'Gracias por tu compra – Tu factura electrónica',
            text: resumen,
            pdfPath
          });

        } catch (error) {
          console.error("Error al guardar en MongoDB o enviar notificaciones:", error.message);
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
            ? "Factura y notificaciones enviadas correctamente."
            : "Factura emitida pero no guardada en base de datos."
        };

      } catch (error) {
        console.error(" Error al emitir factura en FacturAPI:", error.response?.data || error.message);
        return {
          id: "simulada_factura_001",
          cliente: input.customer,
          productos: input.items,
          total,
          pdf_url: "https://miapp.com/factura-demo.pdf",
          resumen,
          status: "simulada",
          fecha: new Date().toISOString(),
          mensaje: "Factura simulada. No se guardó ni notificó."
        };
      }
    }
  }
};
