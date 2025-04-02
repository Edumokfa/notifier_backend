const express = require('express');
const { sendFirstMessage, webhook, configureWebhook } = require('../controllers/whatsappController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/webhook', webhook);
router.get('/webhook', configureWebhook);
router.post('/sendFirstMessage', protect, sendFirstMessage);

module.exports = router;