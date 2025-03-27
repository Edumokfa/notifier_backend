const { Template, User } = require('../models');

exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.findAll({
      where: { userId: req.user.id },
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    req.body.userId = req.user.id;
    
    const template = await Template.create(req.body);
    
    res.status(201).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    let template = await Template.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template não encontrado'
      });
    }
    
    await template.update(req.body);
    
    template = await Template.findByPk(req.params.id);
    
    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template não encontrado'
      });
    }
    
    await template.destroy();
    
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