const express = require('express');
const { 
  getHistories,
} = require('../controllers/MessageHistoryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getHistories);

module.exports = router;