const express = require('express');
const router = express.Router();
const { subscribeNewsletter, getSubscribers, blastNewsletter } = require('../controllers/newsletterController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/subscribe', subscribeNewsletter);
router.get('/subscribers', protect, admin, getSubscribers);
router.post('/blast/:id', protect, admin, blastNewsletter);

module.exports = router;
