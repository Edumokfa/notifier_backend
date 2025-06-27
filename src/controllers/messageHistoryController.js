const { MessageHistory } = require('../models');
const { Op, fn, col } = require('sequelize');

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

exports.getMessageStats = async (req, res) => {
  try {
    const userId = req.user.referenceUser ?? req.user.id;

    const stats = await MessageHistory.findAll({
      where: { userId },
      attributes: [
        'channelType',
        'messageStatus',
        [fn('COUNT', col('*')), 'count']
      ],
      group: ['channelType', 'messageStatus'],
      raw: true
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error('Erro ao gerar estatísticas:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// Nova função para dados de série temporal (evolução ao longo do tempo)
exports.getTimeSeriesStats = async (req, res) => {
  try {
    const userId = req.user.referenceUser ?? req.user.id;
    const { startDate, endDate } = req.query;

    // Configurar filtro de data se fornecido
    let whereClause = { userId };
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const stats = await MessageHistory.findAll({
      where: whereClause,
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        'channelType',
        [fn('COUNT', col('*')), 'count']
      ],
      group: [fn('DATE', col('createdAt')), 'channelType'],
      order: [[fn('DATE', col('createdAt')), 'ASC']],
      raw: true
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error('Erro ao gerar estatísticas temporais:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};