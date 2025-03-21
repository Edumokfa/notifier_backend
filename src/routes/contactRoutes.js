const express = require('express');
const { 
  getContacts, 
  getContact, 
  createContact, 
  updateContact, 
  deleteContact,
  updatePreferences
} = require('../controllers/contactcontroller');

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

module.exports = router;