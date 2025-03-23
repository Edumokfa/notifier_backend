const axios = require('axios');
require('dotenv').config();

//const { createHistory } = require('./controllers/history_controller');

exports.webhook = async (req, res) => {
    const data = req.body;

    if (data.object) {
        const keyWpp = data.key_wpp;
        const botName = data.bot_name;
        const entry = data.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value || {};
        const phoneNumberId = value?.metadata?.phone_number_id;
        const messages = value?.messages?.[0];
        const fromNumber = messages?.from;

        // A função que envia a mensagem via WhatsApp pode ser chamada aqui
        // await sendWhatsappMessage(fromNumber, responseMessage, phoneNumberId, keyWpp);

        return res.status(200).json({ status: 'success' });
    }

    return res.status(404).json({ error: 'Not Found' });
};

exports.sendFirstMessage = async (req, res) => {
    var response = await sendFirstMessage(req.body.phone_number, req.body.key_wpp, req.body.template_wpp, req.body.phone_number_id, req.body.components);
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

// Função para enviar uma mensagem inicial via template
async function sendFirstMessage(phoneNumber, keyWpp, templateWpp, phoneNumberId, components) {
    const url = `${process.env.FACEBOOK_API_URL}${phoneNumberId}/messages?access_token=${keyWpp}`;
    console.log(url);
    const message = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'template',
        template: {
            name: templateWpp,
            language: { code: 'pt_BR' },
            components: components,
        },
    };

    try {
        const response = await axios.post(url, message);
        //await createHistory(phoneNumber, 'Enviou mensagem');
        return response.data;
    } catch (error) {
        return {
            error: error.response?.status || 500,
            message: error.message,
            details: error.response?.data || 'Sem resposta do servidor',
        };
    }
}