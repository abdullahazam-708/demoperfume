const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct
} = require('../controllers/productController');
const {
    createProductReview,
    getProductReviews,
    checkPurchaseStatus
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', createProductReview);

// Protected routes (User)
router.get('/:id/purchased', protect, checkPurchaseStatus);

// Admin routes
router.post('/', protect, admin, createProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.put('/:id', protect, admin, updateProduct);

module.exports = router;
