const express = require('express');
const router = express.Router();
const { generateContent } = require('../controllers/aiController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/generate', protect, admin, generateContent);

module.exports = router;
