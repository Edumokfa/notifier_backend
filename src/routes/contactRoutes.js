const express = require('express');
const { 
  getContacts, 
  getContact, 
  createContact, 
  updateContact, 
  deleteContact,
  updatePreferences,
  importContacts
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getContacts)
  .post(createContact);

router.route('/:id')
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

router.route('/:id/preferences')
  .patch(updatePreferences);

router.route('/import')
  .post(importContacts)

module.exports = router;