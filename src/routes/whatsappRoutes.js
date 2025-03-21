const express = require('express');
const { sendFirstMessage, webhook } = require('../controllers/whatsappController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/webhook', protect, webhook);
router.post('/sendFirstMessage', protect, sendFirstMessage);

module.exports = router;