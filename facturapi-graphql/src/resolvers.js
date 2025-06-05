const axios = require("axios");
const { generarResumen } = require('./services/vertexService');
const Factura = require("./models/Factura");
require('dotenv').config();
const { generarFacturaPDF } = require('./services/pdfService');
const { enviarFacturaPorCorreo } = require('./services/sendgridService');
const { sendSMS, sendWhatsApp } = require('./services/notificationsService');
const Cliente = require('./models/Cliente');
const Producto = require('./models/Producto');
const { crearProducto } = require('./services/productoService');
const { crearClienteFacturapi } = require('./services/clienteService');



module.exports = {
  Query: {
    hello: () => "Hola desde la API GraphQL 🚀",
  },

  Mutation: {
    emitirFactura: async (_, { input }) => {
      const clienteDb = await Cliente.findOne({
      tax_id: input.customer.tax_id,
      legal_name: input.customer.legal_name
      });

      // 2. Validar si no se encontró
      if (!clienteDb) {
        return {
          success: false,
          mensaje: "Cliente no encontrado en la base de datos",
          cliente: null
        };
      }

        // ✅ Validar stock antes de emitir la factura
      for (const item of input.items) {
        const producto = await Producto.findOne({ description: item.description });

        if (!producto || producto.quantity < item.quantity) {
          return {
            success: false,
            mensaje: `Stock insuficiente para "${item.description}"`,
            cliente: null
          };
        }
      }

      const facturaData = {
            payment_form: "08",
      use: "S01",
      customer: {
      legal_name: clienteDb.legal_name,
      tax_id: clienteDb.tax_id,
      tax_system: clienteDb.tax_system || "616",
      email: clienteDb.email,
      address: {
        zip: clienteDb.address?.zip || "83240",
        country: clienteDb.address?.country || "MEX",
        street: clienteDb.address?.street || "",
        exterior: clienteDb.address?.exterior || "",
        neighborhood: clienteDb.address?.neighborhood || "",
        city: clienteDb.address?.city || "",
        municipality: clienteDb.address?.municipality || "",
        state: clienteDb.address?.state || ""
      }
    },
      items: input.items.map(item => ({
        quantity: item.quantity,
        product: {
          description: item.description,
          product_key: "01010101",
          price: item.price,
          taxes: [{ type: "IVA", rate: 0.16 }]
        }
      }))
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
        const clienteDb = await Cliente.findOne({ tax_id: input.customer.tax_id });
        const productosDb = await Producto.find({ description: { $in: input.items.map(p => p.description) } });

        try {
          await Factura.create({
            cliente: clienteDb._id,
            productos: productosDb.map(p => p._id),
            total,
            pdf_url: data.pdf_url,
            resumen,
            status: data.status,
            fecha: new Date()
          });

          guardado = true;

           // ✅ Descontar stock de productos
          for (const item of input.items) {
            await Producto.updateOne(
              { description: item.description },
              { $inc: { quantity: -item.quantity } }
            );
          }

          pdfPath = await generarFacturaPDF({
            cliente:  clienteDb,
            productos:  input.items,
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
    },

    crearProducto: async (_, { input }) => {
      try {
        const producto = await crearProducto(input);
        return {
          success: true,
          mensaje: "Producto creado correctamente",
          producto,
        };
      } catch (error) {
        console.error("❌ Error al crear producto:", error.message);
        return {
          success: false,
          mensaje: "Error al crear producto",
          producto: null,
        };
      }
    },

      crearCliente: async (_, { input }) => {
      const facturapiData = await crearClienteFacturapi(input);

      if (!facturapiData) {
        return {
          success: false,
          mensaje: "No se pudo crear en FacturAPI",
          cliente: null
        };
      }

      const cliente = await Cliente.create({
        facturapi_id: facturapiData.id,
        legal_name: facturapiData.legal_name,
        tax_id: facturapiData.tax_id,
        tax_system: facturapiData.tax_system,
        email: facturapiData.email,
        phone: facturapiData.phone,
        address: facturapiData.address
      });

      return {
        success: true,
        mensaje: "Cliente creado correctamente",
        cliente
      };
    },

      deleteFactura: async (_, { id }) => {
      try {
        const deleted = await Factura.findByIdAndDelete(id);
        return deleted ? true : false;
      } catch (error) {
        console.error("Error al eliminar factura:", error.message);
        return false;
      }
    },

  updateFactura: async (_, { id, input }) => {
  try {
    const updatedFactura = await Factura.findByIdAndUpdate(id, input, {
      new: true
    });
    return updatedFactura;
  } catch (error) {
    console.error("Error al actualizar factura:", error.message);
    return null;
  }
  },

  },

  //querys
  Query: {
    hello: () => "Hola desde la API GraphQL 🚀",

    getProductos: async () => {
      try {
        const productos = await Producto.find();
        return productos;
      } catch (error) {
        console.error("Error al obtener productos:", error.message);
        return [];
      }
    },

    getClientes: async () => {
      try {
        const clientes = await Cliente.find();
        return clientes;
      } catch (error) {
        console.error("Error al obtener clientes:", error.message);
        return [];
      }
    },
    getAllFacturas: async () => {
    try {
      const facturas = await Factura.find()
        .populate('cliente')
        .populate('productos');
      return facturas;
    } catch (error) {
      console.error("Error al obtener facturas:", error.message);
      return [];
    }
  },

    getFacturaById: async (_, { id }) => {
      try {
        const factura = await Factura.findById(id)
          .populate('cliente')
          .populate('productos');
        return factura;
      } catch (error) {
        console.error("Error al buscar factura por ID:", error.message);
        return null;
      }
      }
    },
    

};
