require('dotenv').config();
const nodemailer = require('nodemailer');

const { createHistory } = require('./MessageHistoryController');

async function sendMail(message, contact) {
    const { username, password, smtpServer, smtpPort } = message.emailConfig;

    const transporter = nodemailer.createTransport({
      host: smtpServer,
      port: parseInt(smtpPort),
      secure: smtpPort == 465, // depende se o SMTP usa SSL/TLS. Para porta 465 geralmente é true.
      auth: {
        user: username,
        pass: password 
      }
    });

    const mailOptions = {
      from: `"Sistema" <${username}>`,
      to: contact.email,
      subject: 'Notificação do Sistema',
      text: 'Olá, esta é uma notificação do sistema.',
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email enviado:', info.response);
      createHistory(message.userId, contact.email, mailOptions, info, 200, null, 'sent', 'email');
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      createHistory(message.userId, contact.email, mailOptions, error, 400, null, 'error', 'email');
    }
};

module.exports = { sendMail };