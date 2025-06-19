const { MessageHistory } = require('../models');

exports.getHistories = async (req, res) => {
  try {
    const histories = await MessageHistory.findAll({
      where: { userId: req.user.referenceUser ?? req.user.id },
    });
    
    res.status(200).json({
      success: true,
      count: histories.length,
      data: histories
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createHistory = async (userId, contact, request, response, status, messageId, messageStatus, channelType) => {
  try {
    const history = await MessageHistory.create({
        userId,
        contact,
        requestPayload: request,
        responsePayload: response || 'Sem resposta do servidor',
        statusCode: status,
        messageId,
        messageStatus: messageStatus || 'failed',
        channelType: channelType
    });
    console.log('histórico criado')
  } catch (error) {
    console.log(error);
  }
};