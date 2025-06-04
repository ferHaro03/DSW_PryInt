const sgMail = require('@sendgrid/mail');
const fs = require('fs');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'kayamacedoca@ittepic.edu.mx',
  from: process.env.FROM_EMAIL,
  subject: 'Test de envío desde Node.js',
  text: 'Este es un correo de prueba usando SendGrid + Node.js.',
};

sgMail
  .send(msg)
  .then(() => console.log('Correo de prueba enviado'))
  .catch((error) => console.error('Error en prueba:', error.response?.body || error));
