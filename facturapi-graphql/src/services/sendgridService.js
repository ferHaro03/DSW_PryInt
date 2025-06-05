// Importa la biblioteca de SendGrid para envío de correos
const sgMail = require('@sendgrid/mail');
// Importa el módulo para manejar archivos locales
const fs = require('fs');

// Configura la clave de autenticación de SendGrid usando variables de entorno
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Envía una factura por correo electrónico con un archivo PDF adjunto.
 *
 * @param {Object} params - Parámetros necesarios para enviar el correo.
 * @param {string} params.to - Correo del destinatario.
 * @param {string} params.subject - Asunto del correo.
 * @param {string} params.text - Cuerpo del mensaje.
 * @param {string} params.pdfPath - Ruta al archivo PDF a adjuntar.
 */
async function enviarFacturaPorCorreo({ to, subject, text, pdfPath }) {
  console.log("Función enviarFacturaPorCorreo fue llamada");
  console.log("to:", to);
  console.log("pdfPath:", pdfPath);

  // Verifica que el archivo PDF exista en la ruta indicada
  if (!fs.existsSync(pdfPath)) {
    console.error("El archivo PDF no existe en:", pdfPath);
    return;
  }

  // Lee el contenido del PDF como buffer
  const pdfData = fs.readFileSync(pdfPath);
  console.log("Tamaño del PDF:", pdfData.length);

  // Crea el mensaje con el archivo adjunto codificado en base64
  const msg = {
    to,                             // Destinatario
    from: process.env.FROM_EMAIL,   // Correo remitente configurado en SendGrid
    subject,                        // Asunto del correo
    text,                           // Cuerpo del mensaje
    attachments: [
      {
        content: pdfData.toString('base64'), // Contenido codificado en base64
        filename: 'factura.pdf',
        type: 'application/pdf',
        disposition: 'attachment',
      },
    ],
  };

  // Contenido codificado
  try {
    await sgMail.send(msg);
    console.log(`Correo enviado correctamente a ${to}`);
  } catch (err) {
    console.error('Error al enviar correo:', err?.response?.body || err.message || err);
    console.error('Stacktrace:', err);
  }
}

// Exporta la función para que pueda ser utilizada desde otros módulos
module.exports = { enviarFacturaPorCorreo };