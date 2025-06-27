const express = require('express');
const { sendTest } = require('../controllers/mailController');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect, isAdmin);

router.post('/sendTest', sendTest);

module.exports = router;