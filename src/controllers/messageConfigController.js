const MessageConfig = require('../models/MessageConfig');
const Template = require('../models/Template');
const { Op } = require('sequelize');

exports.createMessageConfig = async (req, res) => {
  try {
    const { 
      channelType, 
      emailConfig, 
      executionFrequency, 
      templateId,
      messageTemplate,
      status 
    } = req.body;

    // Verificar se o template existe, se um ID for fornecido
    if (templateId) {
      const template = await Template.findByPk(templateId);
      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template não encontrado'
        });
      }
    }

    const messageConfig = await MessageConfig.create({
      userId: req.user.referenceUser ?? req.user.id,
      channelType,
      emailConfig: channelType === 'email' ? emailConfig : null,
      executionFrequency,
      templateId,
      messageTemplate,
      status: status || 'active',
      nextExecutionDate: new Date() // Definido automaticamente pelo hook
    });

    res.status(201).json({
      success: true,
      data: messageConfig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMessageConfigs = async (req, res) => {
  try {
    const messageConfigs = await MessageConfig.findAll({
      where: { userId: req.user.referenceUser ?? req.user.id },
      include: [
        {
          model: Template,
          as: 'template',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: messageConfigs.length,
      data: messageConfigs
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateMessageConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      channelType, 
      emailConfig, 
      executionFrequency, 
      templateId,
      messageTemplate,
      status 
    } = req.body;

    let messageConfig = await MessageConfig.findOne({
      where: { 
        id, 
        userId: req.user.referenceUser ?? req.user.id 
      }
    });

    if (!messageConfig) {
      return res.status(404).json({
        success: false,
        message: 'Configuração de mensagem não encontrada'
      });
    }

    // Verificar se o template existe, se um ID for fornecido
    if (templateId) {
      const template = await Template.findByPk(templateId);
      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template não encontrado'
        });
      }
    }

    messageConfig = await messageConfig.update({
      channelType: channelType || messageConfig.channelType,
      emailConfig: channelType === 'email' ? emailConfig : null,
      executionFrequency: executionFrequency || messageConfig.executionFrequency,
      templateId,
      messageTemplate: messageTemplate || messageConfig.messageTemplate,
      status: status || messageConfig.status
    });

    res.status(200).json({
      success: true,
      data: messageConfig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteMessageConfig = async (req, res) => {
  try {
    const { id } = req.params;

    const messageConfig = await MessageConfig.findOne({
      where: { 
        id, 
        userId: req.user.referenceUser ?? req.user.id
      }
    });

    if (!messageConfig) {
      return res.status(404).json({
        success: false,
        message: 'Configuração de mensagem não encontrada'
      });
    }

    await messageConfig.destroy();

    res.status(200).json({
      success: true,
      message: 'Configuração de mensagem removida com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};