require('dotenv').config();

const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const connection = new IORedis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, maxRetriesPerRequest: null });
const notificationQueue = new Queue('notifications', { connection });

async function sendMail(message, contact) {
  const payload = {
    type: 'email',
    contact: contact,
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
};

async function sendTest(req, res) {
  const { test_email, name, email_subject, email_body, emailConfig, userId } = req.body;
  const fakeMessage = {
    userId,
    emailConfig,
    template: {
      email_subject: email_subject || "Assunto de Teste",
      email_body: email_body || "Olá {{cliente}}, este é um e-mail de teste do sistema."
    }
  };

  const fakeContact = {
    name: name || "Usuário de Teste",
    email: test_email
  };

  try {
    await sendMail(fakeMessage, fakeContact);
    res.status(200).json({ success: true, message: 'E-mail de teste enviado com sucesso.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao enviar e-mail de teste.', error: err.message });
  }
}


module.exports = { sendMail, sendTest };