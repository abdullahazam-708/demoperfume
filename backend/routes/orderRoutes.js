const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getDashboardStats,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', addOrderItems);
router.get('/', protect, admin, getOrders);
router.get('/stats', protect, admin, getDashboardStats);
router.get('/:id', protect, admin, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
