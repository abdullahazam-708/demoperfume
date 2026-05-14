const express = require('express');
const router = express.Router();
const { submitContactForm, getContactMessages, deleteContactMessage } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', submitContactForm);
router.get('/', protect, admin, getContactMessages);
router.delete('/:id', protect, admin, deleteContactMessage);

module.exports = router;
