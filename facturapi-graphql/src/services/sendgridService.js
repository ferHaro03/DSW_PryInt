const sgMail = require('@sendgrid/mail');
const fs = require('fs');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function enviarFacturaPorCorreo({ to, subject, text, pdfPath }) {
  console.log("Función enviarFacturaPorCorreo fue llamada");
  console.log("to:", to);
  console.log("pdfPath:", pdfPath);

  // Validar que el PDF exista
  if (!fs.existsSync(pdfPath)) {
    console.error("El archivo PDF no existe en:", pdfPath);
    return;
  }

  const pdfData = fs.readFileSync(pdfPath);
  console.log("Tamaño del PDF:", pdfData.length);

  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject,
    text,
    attachments: [
      {
        content: pdfData.toString('base64'),
        filename: 'factura.pdf',
        type: 'application/pdf',
        disposition: 'attachment',
      },
    ],
  };

  try {
    await sgMail.send(msg);
    console.log(`Correo enviado correctamente a ${to}`);
  } catch (err) {
    console.error('Error al enviar correo:', err?.response?.body || err.message || err);
    console.error('Stacktrace:', err);
  }
}
module.exports = { enviarFacturaPorCorreo };