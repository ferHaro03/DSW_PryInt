// src/services/vertexService.js
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../../auth/clave-vertex.json');
const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

const ai = new GoogleGenAI({
  project: GOOGLE_CLOUD_PROJECT,
  location: GOOGLE_CLOUD_LOCATION,
  vertexai: true
});

async function generarResumen(cliente, items) {
  const productos = items.map(i => `${i.quantity} x ${i.description} ($${i.price})`).join(', ');
  const prompt = `Redacta un mensaje amable de confirmación de compra para ${cliente.legal_name}. Los productos adquiridos son: ${productos}.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const texto = response.candidates[0].content.parts[0].text;
    console.log("🟢 Resumen generado desde Gemini:\n", texto);
    return texto;
    } catch (error) {
    console.error("❌ Error generando resumen:", error.message);
    return "[FALLBACK] Gracias por tu compra. Pronto recibirás tu factura.";
    }
}
module.exports = { generarResumen };
