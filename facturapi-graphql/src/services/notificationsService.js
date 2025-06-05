const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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

async function sendSMS(to, message) {
  return await client.messages.create({
    body: message,
    from: process.env.TWILIO_SMS_NUMBER,
    to
  });
}

module.exports = {
  sendWhatsApp,
  sendSMS
};