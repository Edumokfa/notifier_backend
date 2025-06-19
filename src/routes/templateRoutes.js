const express = require('express');
const { 
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = require('../controllers/templateController');

const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect, isAdmin);

router.route('/')
  .get(getTemplates)
  .post(createTemplate);

router.route('/:id')
  .get(getTemplate)
  .put(updateTemplate)
  .delete(deleteTemplate);

module.exports = router;