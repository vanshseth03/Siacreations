// Statistics Routes - Dashboard stats for admin panel

import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Category from "../models/Category.js";

const router = express.Router();

// GET /api/stats/dashboard - Get all dashboard statistics
router.get('/dashboard', async (req, res) => {
    try {
        // Get counts
        const totalProducts = await Product.countDocuments({ status: 'published' });
        const totalOrders = await Order.countDocuments();
        const totalCategories = await Category.countDocuments();
        
        // Get revenue (sum of all order totals)
        const revenueData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' }
                }
            }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
        
        // Get recent orders (last 5)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('orderId customer.name orderStatus totalAmount createdAt');
        
        // Get new arrivals count
        const newArrivals = await Product.countDocuments({ isNewArrival: true });
        
        // Get orders by status
        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Get orders from last month for comparison
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        
        const lastMonthOrders = await Order.countDocuments({
            createdAt: { $gte: lastMonth }
        });
        
        const lastMonthRevenue = await Order.aggregate([
            {
                $match: { createdAt: { $gte: lastMonth } }
            },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: '$totalAmount' }
                }
            }
        ]);
        
        res.json({
            success: true,
            stats: {
                totalProducts,
                totalOrders,
                totalCategories,
                totalRevenue,
                newArrivals,
                recentOrders,
                ordersByStatus,
                lastMonthOrders,
                lastMonthRevenue: lastMonthRevenue.length > 0 ? lastMonthRevenue[0].revenue : 0
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
});

// GET /api/stats/products - Get product statistics
router.get('/products', async (req, res) => {
    try {
        // Products by category
        const productsByCategory = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Visible vs hidden products
        const visibleProducts = await Product.countDocuments({ isVisible: true });
        const hiddenProducts = await Product.countDocuments({ isVisible: false });
        
        // Published vs draft
        const publishedProducts = await Product.countDocuments({ status: 'published' });
        const draftProducts = await Product.countDocuments({ status: 'draft' });
        
        res.json({
            success: true,
            stats: {
                productsByCategory,
                visibleProducts,
                hiddenProducts,
                publishedProducts,
                draftProducts
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product statistics',
            error: error.message
        });
    }
});

// GET /api/stats/sales - Get sales statistics
router.get('/sales', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }
        
        // Total sales in date range
        const salesData = await Order.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                    averageOrderValue: { $avg: '$totalAmount' }
                }
            }
        ]);
        
        // Sales by payment mode
        const salesByPaymentMode = await Order.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$paymentMode',
                    totalSales: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            }
        ]);
        
        res.json({
            success: true,
            stats: salesData.length > 0 ? {
                ...salesData[0],
                salesByPaymentMode
            } : {
                totalSales: 0,
                totalOrders: 0,
                averageOrderValue: 0,
                salesByPaymentMode
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching sales statistics',
            error: error.message
        });
    }
});

export default router;
