const cron = require('node-cron');
const { Op } = require('sequelize');
const MessageConfig = require('../models/MessageConfig');
const { Contact } = require('../models');
require('dotenv').config();

const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const connection = new IORedis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, maxRetriesPerRequest: null });
const notificationQueue = new Queue('notifications', { connection });

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
                    if ((contact.recebeEmail && message.channelType === 'email') || (contact.recebeWhatsapp && message.channelType === 'whatsapp')) {
                        notificationQueue.add('sendNotification', {
                            type: message.channelType,
                            contact: contact,
                            message: message,
                        });
                    }
                });
            }
        }
    } catch (error) {
        console.error('Erro ao executar tarefas agendadas:', error);
    }
}

cron.schedule('* * * * *', () => {
    executeScheduledMessages();
});

module.exports = { notificationQueue };
