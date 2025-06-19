const express = require('express');
const { listUsers, listRelatedUsers, updateUserRole, addRelatedUser, removeRelatedUser } = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect, isAdmin);

router.get('/list', listUsers);
router.get('/listRelatedUsers', listRelatedUsers);
router.put('/updateRole', updateUserRole);
router.post('/addRelatedUser', addRelatedUser);
router.delete('/removeRelatedUser', removeRelatedUser);

module.exports = router;