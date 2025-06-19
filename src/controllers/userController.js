const User = require('../models/User');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    user.role = newRole;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Role do usuário atualizada com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.listRelatedUsers = async (req, res) => {
  try {
    var { userId } = req.query;
    if (req.user.referenceUser) {
      userId = req.user.referenceUser
    }

    const users = await User.findAll({
      where: { referenceUser: userId },
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addRelatedUser = async (req, res) => {
  try {
    var { userId, referenceUserId } = req.body;

    console.log(req.body)

    const user = await User.findByPk(userId);
    const referenceUser = await User.findByPk(referenceUserId);

    if (!user || !referenceUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário ou usuário de referência não encontrado'
      });
    }
    if (user.referenceUser) {
      userId = user.referenceUser;
    }

    referenceUser.referenceUser = userId;
    await referenceUser.save();

    res.status(200).json({
      success: true,
      message: 'Usuário relacionado com sucesso',
      user: {
        id: referenceUser.id,
        name: referenceUser.name,
        email: referenceUser.email,
        referenceUser: referenceUser.referenceUser
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.removeRelatedUser = async (req, res) => {
  try {
    const { referenceUserId } = req.query;

    const user = await User.findByPk(referenceUserId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    user.referenceUser = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Relacionamento removido com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        referenceUser: user.referenceUser
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
