const axios = require('axios');
require('dotenv').config();

const { createHistory } = require('../controllers/MessageHistoryController');
const { MessageHistory, User } = require('../models');

exports.webhook = async (req, res) => {
    const data = req.body;
    if (data.object) {
        const entry = data.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value || {};
        const statuses = value?.statuses?.[0];
        const status = statuses.status;
        const messageId = statuses.id;
        if (status && messageId) {
            const messageHistory = await MessageHistory.findOne({
                where: { messageId: messageId},
                raw: false
            });
            if (messageHistory) {
                messageHistory.messageStatus = status;
                await messageHistory.save();
            }
        }
        return res.status(200).json({ status: 'success' });
    }

    return res.status(404).json({ error: 'Not Found' });
};

exports.configureWebhook = async (req, res) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    if (mode && token) {
        const user = await User.findOne({ where: { email: token } })
        if (mode === "subscribe" && user) {
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    }
    return res.sendStatus(403);
  };

exports.sendFirstMessage = async (req, res) => {
    var response = await sendFirstMessage(req.user.referenceUser ?? req.user.id, req.body.phone_number, req.body.key_wpp, req.body.template_wpp, req.body.phone_number_id, req.body.components);
    if (response.error) {
        return res.status(400).json({ error: response });
    }
    return res.status(200).json(response);
}

exports.sendFirstMessageFromCron = async (userId, phoneNumber, keyWpp, templateWpp, phoneNumberId, components) => {
    var response = await sendFirstMessage(userId, phoneNumber, keyWpp, templateWpp, phoneNumberId, components);
    return !response.error;
}


// Função para enviar uma mensagem via WhatsApp
async function sendWhatsappMessage(phoneNumber, message, phoneNumberId, keyWpp) {
    const url = `${process.env.FACEBOOK_API_URL}${phoneNumberId}/messages?access_token=${keyWpp}`;

    const jsonApi = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        text: { body: message },
    };

    try {
        const response = await axios.post(url, jsonApi);
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

async function sendFirstMessage(userId, phoneNumber, keyWpp, templateWpp, phoneNumberId, components) {
    const url = `${process.env.FACEBOOK_API_URL}${phoneNumberId}/messages?access_token=${keyWpp}`;

    const updatedComponents = components.map(({ text, ...rest }) => rest);

    const message = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'template',
        template: {
            name: templateWpp,
            language: { code: 'pt_BR' },
            components: updatedComponents,
        },
    };

    try {
        const response = await axios.post(url, message);
        createHistory(userId, phoneNumber, message, response.data, 200, response.data.messages[0].id, 'sent', 'whatsapp');
        return response.data;
    } catch (error) {
        createHistory(userId, phoneNumber, message, error.response?.data, error.response?.status || 500, null, 'failed', 'whatsapp');
        return {
            error: error.response?.status || 500,
            message: error.message,
            details: error.response?.data || 'Sem resposta do servidor',
        };
    }
}