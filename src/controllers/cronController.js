const cron = require('node-cron');
const { Op } = require('sequelize');
const MessageConfig = require('../models/MessageConfig');
const WhatsappController = require('../controllers/whatsappController');
const { Contact } = require('../models');
require('dotenv').config();

const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const connection = new IORedis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, maxRetriesPerRequest: null });
const notificationQueue = new Queue('notifications', { connection });

const worker = new Worker('notifications', async job => {
  const { type, contact, message } = job.data;

  sendNotification(type, contact, message);
}, { connection });

async function executeScheduledMessages() {
    const now = new Date();

    try {
        now.setSeconds(0);
        now.setMinutes(0);

        const messagesToExecute = await MessageConfig.findAll({
            where: {
                nextExecutionDate: { [Op.lte]: now },
                status: 'active'
            },
            include: ['template'],
        });

        for (const message of messagesToExecute) {
            const nextExecutionDate = new Date(message.nextExecutionDate);
            nextExecutionDate.setSeconds(0);
            nextExecutionDate.setMinutes(0);
            if (nextExecutionDate <= now) {
                console.log(`Executando mensagem em ${nextExecutionDate}`);
                const contacts = await Contact.findAll({
                    where: { userId: message.userId },
                    order: [['name', 'ASC']]
                });
                message.update({ nextExecutionDate: message.updateNextExecutionDate() });
                contacts.forEach(contact => {
                    notificationQueue.add('sendNotification', {
                        type: message.channelType,
                        contact: contact,
                        message: message,
                      });
                });
            }
        }
    } catch (error) {
        console.error('Erro ao executar tarefas agendadas:', error);
    }
}

async function sendNotification(type, contact, message) {
    if (type === 'email') {

    } else if (type === 'sms') {

    } else if (type === 'whatsapp') {
        const updatedMessageTemplate = JSON.parse(JSON.stringify(message.template.components)).map(component => {
            if (component.parameters) {
                component.parameters = component.parameters.map(param => {
                if (param.type === 'contact') {
                    param.type = 'text';
                    param.text = contact.name;
                }
                return param;
                });
            }
            return component;
        });
        WhatsappController.sendFirstMessageFromCron(message.userId, contact.phone, message.template.key_wpp, message.template.template_wpp, message.template.phone_number_id, updatedMessageTemplate);
    }
}

cron.schedule('* * * * *', () => {
    executeScheduledMessages();
});
