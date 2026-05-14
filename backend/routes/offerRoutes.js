const express = require('express');
const router = express.Router();
const {
    getOffers,
    getOfferById,
    getActiveOffersByType,
    createOffer,
    updateOffer,
    deleteOffer,
    toggleOfferStatus
} = require('../controllers/offerController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getOffers);
router.get('/active/:type', getActiveOffersByType);
router.get('/:id', getOfferById);

// Admin routes
router.post('/', protect, admin, createOffer);
router.put('/:id', protect, admin, updateOffer);
router.delete('/:id', protect, admin, deleteOffer);
router.patch('/:id/toggle', protect, admin, toggleOfferStatus);

module.exports = router;
