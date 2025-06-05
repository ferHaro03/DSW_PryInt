// Importa axios para realizar peticiones HTTP
const axios = require("axios");
// Servicio que genera un resumen natural del contenido de la compra usando OpenAI
const { generarResumen } = require('./services/vertexService');
// Modelo de Mongoose para almacenar facturas en la base de datos
const Factura = require("./models/Factura");
// Carga las variables de entorno desde .env
require('dotenv').config();
// Servicio para generar el archivo PDF de la factura
const { generarFacturaPDF } = require('./services/pdfService');
// Servicio para enviar la factura por correo con SendGrid
const { enviarFacturaPorCorreo } = require('./services/sendgridService');
// Servicios para enviar SMS y mensajes de WhatsApp con Twilio
const { sendSMS, sendWhatsApp } = require('./services/notificationsService');

// Exporta los resolvers de GraphQL
module.exports = {
  // Resolvers para las queries
  Query: {
    // Endpoint de prueba para verificar que la API está activa
    hello: () => "Hola desde la API GraphQL 🚀",
  },
  // Resolvers para las mutaciones
  Mutation: {
    // Mutación que permite emitir una factura completa
    emitirFactura: async (_, { input }) => {
      // Construye el objeto requerido por FacturAPI
      const facturaData = {
        payment_form: "08", // Transferencia
        use: "S01", // Uso fiscal
        customer: {
          legal_name: input.customer.legal_name,
          tax_id: input.customer.tax_id,
          tax_system: "616", // RIF genérico
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
      // Genera el resumen con OpenAI
      const resumen = await generarResumen(input.customer, input.items);
      // Calcula el total de la factura
      const total = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      try {
        // Llama a FacturAPI para emitir la factura real
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
          // Guarda la factura en MongoDB
          await Factura.create({
            cliente: input.customer,
            productos: input.items,
            total,
            pdf_url: data.pdf_url,
            resumen,
            status: data.status
          });

          guardado = true;
          // Genera el PDF local
          pdfPath = await generarFacturaPDF({
            cliente: input.customer,
            productos: input.items,
            total,
            resumen,
            fecha: new Date().toISOString(),
            folio: data.folio_number,
            status: data.status
          }, data.id);

          // Envía SMS si el número está presente
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
          // Envía WhatsApp si el número está presente
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

          // Envía el PDF por correo electrónico
          await enviarFacturaPorCorreo({
            to: input.customer.email,
            subject: 'Gracias por tu compra – Tu factura electrónica',
            text: resumen,
            pdfPath
          });

        } catch (error) {
          console.error("Error al guardar en MongoDB o enviar notificaciones:", error.message);
        }
        // Retorna la respuesta a GraphQL
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
        // Si ocurre un error al emitir la factura en FacturAPI
        console.error(" Error al emitir factura en FacturAPI:", error.response?.data || error.message);
        // Retorna una factura simulada
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
