const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generarResumen(cliente, items) {
  const descripcionProductos = items
    .map(i => `${i.quantity} x ${i.description} ($${i.price})`)
    .join(", ");

  const prompt = `Redacta un mensaje amable de confirmación de compra para ${cliente.legal_name}. Los productos adquiridos son: ${descripcionProductos}.`;

  try {
    const respuesta = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo"
    });

    return respuesta.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ Error al generar resumen:", error.message);
    return "Gracias por tu compra. Pronto recibirás tu factura.";
  }
}

module.exports = { generarResumen };
