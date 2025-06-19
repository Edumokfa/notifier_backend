const { Contact, User } = require('../models');

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      where: { userId: req.user.referenceUser ?? req.user.id },
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.referenceUser ?? req.user.id
      }
    });
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contato não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createContact = async (req, res) => {
  try {
    req.body.userId = req.user.referenceUser ?? req.user.id;
    
    const contact = await Contact.create(req.body);
    
    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateContact = async (req, res) => {
  try {
    let contact = await Contact.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.referenceUser ?? req.user.id
      }
    });
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contato não encontrado'
      });
    }
    
    await contact.update(req.body);
    
    contact = await Contact.findByPk(req.params.id);
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.referenceUser ?? req.user.id
      }
    });
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contato não encontrado'
      });
    }
    
    await contact.destroy();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { recebeEmail, recebeWhatsapp } = req.body;
    
    let contact = await Contact.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.referenceUser ?? req.user.id
      }
    });
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contato não encontrado'
      });
    }
    
    await contact.update({
      recebeEmail: recebeEmail !== undefined ? recebeEmail : contact.recebeEmail,
      recebeWhatsapp: recebeWhatsapp !== undefined ? recebeWhatsapp : contact.recebeWhatsapp
    });
    
    contact = await Contact.findByPk(req.params.id);
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.importContacts = async (req, res) => {
  try {
    const contacts = req.body.contacts;

    if (!Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum contato válido enviado.'
      });
    }

    const contactsWithUser = contacts.map(contact => ({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      userId: req.user.referenceUser ?? req.user.id,
    }));

    await Contact.bulkCreate(contactsWithUser);

    res.status(201).json({
      success: true,
      count: contactsWithUser.length,
      message: 'Contatos importados com sucesso.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};