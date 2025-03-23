const { Contact } = require('../models');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.sendNotificationToAllUsers = async (req, res) => {
    const contacts = await Contact.findAll();

    contacts.forEach(async (contact) => {
        if (contact.recebeWhatsapp) {
            
        }
    });
};