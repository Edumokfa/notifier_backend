const express = require('express');
const { 
  getHistories, getMessageStats, getTimeSeriesStats
} = require('../controllers/MessageHistoryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getHistories);

router.route('/messageStats').get(getMessageStats);
router.route('/timeSeriesStats').get(getTimeSeriesStats);


module.exports = router;