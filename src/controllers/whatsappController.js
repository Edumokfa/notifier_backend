const axios = require('axios');
require('dotenv').config();

const { MessageHistory, User, Contact } = require('../models');

const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const connection = new IORedis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, maxRetriesPerRequest: null });
const notificationQueue = new Queue('notifications', { connection });

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
    var response = await sendFirstMessage(req.user.referenceUser ?? req.user.id, req.body);
    if (response.error) {
        return res.status(400).json({ error: response });
    }
    return res.status(200).json(response);
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

async function sendFirstMessage(userId, body) {
    const message = {
        userId: userId,
        template: body
    }
    
    const fullContact = {
        phone: body.phone_number,
    }
    const payload = {
        type: 'whatsapp',
        contact: fullContact,
        message: message,
    };

    try {
        await notificationQueue.add('sendNotification', payload);
        return { success: true, status: 'queued' };
    } catch (error) {
        return {
            error: 'queue_error',
            message: error.message,
        };
    }
}