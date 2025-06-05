// Importa path para construir rutas compatibles con el sistema operativo
const path = require('path');
// Importa el cliente de Google GenAI para Vertex AI (Gemini)
const { GoogleGenAI } = require('@google/genai');
// Carga las variables de entorno desde el archivo .env
require('dotenv').config();
// Establece la ruta al archivo de credenciales para autenticarse con Google Cloud
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../../auth/clave-vertex.json');
// Define el ID del proyecto y la ubicación geográfica del recurso en Google Cloud
const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

// Inicializa el cliente de Vertex AI usando el modelo Gemini
const ai = new GoogleGenAI({
  project: GOOGLE_CLOUD_PROJECT,
  location: GOOGLE_CLOUD_LOCATION,
  vertexai: true
});

/**
 * Genera un resumen en lenguaje natural de una compra,
 * utilizando Vertex AI (modelo Gemini de Google Cloud).
 *
 * @param {Object} cliente - Objeto con información del cliente (nombre).
 * @param {Array} items - Lista de productos adquiridos (con cantidad, descripción y precio).
 * @returns {Promise<string>} - Texto generado con un resumen amable de la compra.
 */
async function generarResumen(cliente, items) {
  // Crea una descripción breve de los productos
  const productos = items.map(i => `${i.quantity} x ${i.description} ($${i.price})`).join(', ');
  // Prompt (instrucción) para el modelo de IA
  const prompt = `Redacta un mensaje amable de confirmación de compra de la tienda llamada CyberDoor para ${cliente.legal_name}. Los productos adquiridos son: ${productos}.`;

  try {
    // Llama al modelo Gemini 2.0 Flash para generar contenido
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    // Extrae el texto generado del primer candidato
    const texto = response.candidates[0].content.parts[0].text;
    console.log("Resumen generado desde Gemini:\n", texto);
    return texto;
  } catch (error) {
    // Si ocurre un error, imprime el mensaje y retorna un fallback genérico
    console.error(" Error generando resumen:", error.message);
    return "[FALLBACK] Gracias por tu compra. Pronto recibirás tu factura.";
  }
}

// Exporta la función para ser usada en resolvers u otros módulos
module.exports = { generarResumen };
