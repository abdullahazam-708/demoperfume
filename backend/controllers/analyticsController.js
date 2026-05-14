const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const Traffic = require('../models/Traffic');

// @desc    Get comprehensive analytics
// @route   GET /api/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        // 1. Sales over time (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const salesOverTime = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalPrice" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 2. Category Distribution
        // Note: Our Product model has a 'category' string field. 
        // We'll aggregate orders by the categories of items sold.
        const orderAggregation = await Order.aggregate([
            { $unwind: "$orderItems" },
            {
                $lookup: {
                    from: "products",
                    localField: "orderItems.product",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $group: {
                    _id: "$productDetails.category",
                    revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } },
                    count: { $sum: "$orderItems.qty" }
                }
            }
        ]);

        // 3. Order Status Distribution
        const orderStatusData = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 3b. Brand Performance
        const brandPerformance = await Order.aggregate([
            { $unwind: "$orderItems" },
            {
                $lookup: {
                    from: "products",
                    localField: "orderItems.product",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $group: {
                    _id: "$productDetails.brand",
                    revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } },
                    sold: { $sum: "$orderItems.qty" }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: 8 }
        ]);

        // 3c. Sales by Hour (Peak Hours)
        const salesByHour = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $hour: "$createdAt" },
                    revenue: { $sum: "$totalPrice" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 4. Top Products (by revenue/quantity)
        const topProducts = await Order.aggregate([
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.product",
                    name: { $first: "$orderItems.name" },
                    revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } },
                    sold: { $sum: "$orderItems.qty" }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 }
        ]);

        // 5. General Stats
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalCustomers = await User.countDocuments({ isAdmin: false });

        // 6. Traffic Stats (Impressions and Clicks)
        const totalImpressions = await Traffic.countDocuments({ type: 'impression' });
        const totalClicks = await Traffic.countDocuments({ type: 'click' });

        // Calculate unique visitors
        const uniqueVisitors = await Traffic.distinct('visitorId');
        const totalVisitors = uniqueVisitors.length;

        const trafficOverTime = await Traffic.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        type: "$type"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    impressions: {
                        $sum: { $cond: [{ $eq: ["$_id.type", "impression"] }, "$count", 0] }
                    },
                    clicks: {
                        $sum: { $cond: [{ $eq: ["$_id.type", "click"] }, "$count", 0] }
                    },
                    visitors: { $sum: 1 } // Approximate mapping of entries to days
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Specific Unique Visitors Over Time
        const visitorsOverTime = await Traffic.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        visitorId: "$visitorId"
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            salesOverTime,
            categoryDistribution: orderAggregation,
            orderStatusData,
            topProducts,
            trafficOverTime,
            brandPerformance,
            salesByHour,
            summary: {
                totalRevenue: totalRevenue[0]?.total || 0,
                totalOrders,
                totalProducts,
                totalCustomers,
                totalImpressions,
                totalClicks,
                totalVisitors,
                conversionRate: totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0,
                averageOrderValue: totalOrders > 0 ? (totalRevenue[0]?.total || 0) / totalOrders : 0
            },
            visitorsOverTime
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAnalytics
};
