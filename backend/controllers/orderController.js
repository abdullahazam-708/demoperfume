const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Helper function to send email
const sendOrderEmail = async (order) => {
    try {
        // Create transporter (Note: User will need to configure real SMTP settings in .env)
        // For now, setting up a structure that uses environment variables
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Admin email
                pass: process.env.EMAIL_PASS, // App password
            },
        });

        const itemsHtml = order.orderItems.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${(item.qty * item.price).toFixed(2)}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'cursorabdullah4@gmail.com',
            subject: `New Order Received - Order ID: ${order._id}`,
            html: `
                <h2>New Order Received</h2>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Customer Name:</strong> ${order.shippingAddress.name}</p>
                <p><strong>Email:</strong> ${order.shippingAddress.email}</p>
                <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
                <p><strong>Shipping Address:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
                
                <h3>Order Items:</h3>
                <table border="1" cellpadding="10" style="border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                 </table>
                <p><strong>Shipping: $${(order.shippingPrice || 0).toFixed(2)}</strong></p>
                <p><strong>Grand Total: $${order.totalPrice.toFixed(2)}</strong></p>
                <p>Please check the admin dashboard for more details.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Order notification email sent');
    } catch (error) {
        console.error('Error sending order email:', error);
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            totalPrice,
            shippingPrice,
            user
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        } else {
            const order = new Order({
                orderItems: orderItems.map((x) => ({
                    ...x,
                    product: x.product || x.id || x._id, // Ensure we get an ID
                    _id: undefined,
                })),
                user: user || null,
                shippingAddress,
                totalPrice,
                shippingPrice: shippingPrice || 0,
            });

            const createdOrder = await order.save();

            // Send email notification
            await sendOrderEmail(createdOrder);

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});
        const totalCustomers = await User.countDocuments({ isAdmin: false });

        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);

        const recentOrders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalOrders,
            totalProducts,
            totalCustomers,
            totalRevenue,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrderItems,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getDashboardStats,
};
