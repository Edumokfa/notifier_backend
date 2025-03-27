const express = require('express');
const { 
  createMessageConfig,
  getMessageConfigs,
  updateMessageConfig,
  deleteMessageConfig
} = require('../controllers/messageConfigController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createMessageConfig)
  .get(getMessageConfigs);

router.route('/:id')
  .put(updateMessageConfig)
  .delete(deleteMessageConfig);

module.exports = router;