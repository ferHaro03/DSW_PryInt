// Importa la librería Twilio para enviar mensajes SMS y WhatsApp
const twilio = require('twilio');
// Importa SendGrid para correo electrónico
const sgMail = require('@sendgrid/mail');
// Importa el módulo de sistema de archivos, por si se necesita leer adjuntos o plantillas
const fs = require('fs');
// Carga variables de entorno desde el archivo .env
require('dotenv').config();
// Configura SendGrid con la API Key de tu cuenta
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Crea una instancia del cliente de Twilio usando las credenciales del .env
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Envía un mensaje de WhatsApp a un número especificado
 * @param {string} to - Número de destino (ej. '5213221234567')
 * @param {string} message - Contenido del mensaje
 * @returns {Promise<object>} - Respuesta del API de Twilio
 */
async function sendWhatsApp(to, message) {
  try {
    const res = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`
    });
    return res;
  } catch (err) {
    console.error("Error enviando WhatsApp:", err);
    throw err;
  }
}

/**
 * Envía un mensaje SMS a un número especificado
 * @param {string} to - Número de destino (ej. '+5213221234567')
 * @param {string} message - Contenido del mensaje
 * @returns {Promise<object>} - Respuesta del API de Twilio
 */
async function sendSMS(to, message) {
  return await client.messages.create({
    body: message,
    from: process.env.TWILIO_SMS_NUMBER,
    to
  });
}

// Exporta ambas funciones para uso externo
module.exports = {
  sendWhatsApp,
  sendSMS
};