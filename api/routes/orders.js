// Order Routes - All endpoints related to orders

import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// GET /api/orders - Get all orders (with optional filters)
router.get('/', async (req, res) => {
    try {
        const { status, paymentMode, startDate, endDate, page, limit } = req.query;
        
        // Build query filters
        let query = {};
        
        if (status) query.orderStatus = status;
        if (paymentMode) query.paymentMode = paymentMode;
        
        // Date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }
        
        // Pagination
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 100;
        const skip = (pageNum - 1) * limitNum;
        
        // Get total count for pagination
        const total = await Order.countDocuments(query);
        
        // Get orders sorted by creation date (newest first) with pagination
        const orders = await Order.find(query)
            .populate('items.productId', 'name images')  // Populate product details
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);
        
        res.json({
            success: true,
            count: orders.length,
            total: total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            orders
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
});

// GET /api/orders/:id - Get single order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.productId', 'name images category');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            order
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
});

// GET /api/orders/orderId/:orderId - Get order by order ID
router.get('/orderId/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId })
            .populate('items.productId', 'name images category');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            order
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
    try {
        const {
            customer,
            items,
            subtotal,
            giftPackagingCharge,
            deliveryCharge,
            totalAmount,
            paymentMode,
            notes
        } = req.body;
        
        // Validate required fields
        if (!customer || !items || !items.length) {
            return res.status(400).json({
                success: false,
                message: 'Customer details and items are required'
            });
        }
        
        // Create new order
        const order = new Order({
            customer,
            items,
            subtotal,
            giftPackagingCharge: giftPackagingCharge || 0,
            deliveryCharge: deliveryCharge || 'To be confirmed',
            totalAmount,
            paymentMode,
            paymentStatus: paymentMode === 'COD' ? 'Pending' : 'Pending',
            notes: notes || ''
        });
        
        // Save order to database
        await order.save();
        
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
});

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { orderStatus } = req.body;
        
        if (!orderStatus) {
            return res.status(400).json({
                success: false,
                message: 'Order status is required'
            });
        }
        
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Update order status
        order.orderStatus = orderStatus;
        await order.save();
        
        res.json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
});

// PATCH /api/orders/:id/payment - Update payment status
router.patch('/:id/payment', async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        
        if (!paymentStatus) {
            return res.status(400).json({
                success: false,
                message: 'Payment status is required'
            });
        }
        
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Update payment status
        order.paymentStatus = paymentStatus;
        await order.save();
        
        res.json({
            success: true,
            message: 'Payment status updated successfully',
            order
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating payment status',
            error: error.message
        });
    }
});

// DELETE /api/orders/:id - Delete order (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting order',
            error: error.message
        });
    }
});

export default router;
