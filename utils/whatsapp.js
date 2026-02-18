const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsApp = async (to, body) => {
  try {
    const message = await client.messages.create({
      body: body,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
    });
    console.log('WhatsApp sent:', message.sid);
  } catch (error) {
    console.error('WhatsApp error:', error);
  }
};

module.exports = sendWhatsApp;