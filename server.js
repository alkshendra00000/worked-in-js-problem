require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;

const isTwilioConfigured = Boolean(
    accountSid &&
    accountSid.startsWith('AC') &&
    authToken &&
    whatsappFrom &&
    whatsappFrom.startsWith('whatsapp:')
);

let client;
if (!isTwilioConfigured) {
    console.warn('Twilio credentials are not fully configured or valid. WhatsApp API will not work until .env is set correctly.');
} else {
    client = twilio(accountSid, authToken);
}

app.post('/api/send-whatsapp', async (req, res) => {
    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).json({ success: false, error: 'Missing to or message' });
    }

    // If Twilio is properly configured, send real WhatsApp message
    if (isTwilioConfigured && client) {
        try {
            const msg = await client.messages.create({
                from: whatsappFrom,
                to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
                body: message
            });
            return res.json({
                success: true,
                sid: msg.sid,
                demo: false,
                message: 'WhatsApp message sent successfully via Twilio'
            });
        } catch (err) {
            console.error('Twilio send error:', err);
            return res.status(500).json({
                success: false,
                error: err.message || 'Twilio API error'
            });
        }
    }

    // Demo mode - simulate WhatsApp sending
    console.log('📱 DEMO WhatsApp Message:');
    console.log('To:', to);
    console.log('Message:', message);
    console.log('---');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return res.json({
        success: true,
        sid: 'DEMO' + Date.now(),
        demo: true,
        message: 'Demo mode: WhatsApp message logged to console'
    });
});

app.listen(port, () => {
    console.log(`Hotel website server running at http://localhost:${port}`);
});