const express = require('express');
const { 
  createMessageConfig,
  getMessageConfigs,
  updateMessageConfig,
  deleteMessageConfig
} = require('../controllers/messageConfigController');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect, isAdmin);

router.route('/')
  .post(createMessageConfig)
  .get(getMessageConfigs);

router.route('/:id')
  .put(updateMessageConfig)
  .delete(deleteMessageConfig);

module.exports = router;