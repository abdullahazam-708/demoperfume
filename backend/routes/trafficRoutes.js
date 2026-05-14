const express = require('express');
const router = express.Router();
const Traffic = require('../models/Traffic');

// @desc    Record a traffic event (impression or click)
// @route   POST /api/traffic
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { type, path, productId, visitorId } = req.body;

        await Traffic.create({
            type,
            path: path || '/',
            productId: productId || null,
            visitorId: visitorId || null
        });

        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Traffic record error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
