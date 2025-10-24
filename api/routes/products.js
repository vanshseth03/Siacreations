// Product Routes - All endpoints related to products

import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/products - Get all products (with optional filters)
router.get('/', async (req, res) => {
    try {
        // Check if MongoDB is connected
        if (!Product.db || Product.db.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: 'Database connection not available',
                error: 'MongoDB is not connected. Please check environment variables and network access.'
            });
        }
        
        const { category, status, newArrival, homepage, visible, page, limit } = req.query;
        
        // Build query filters
        let query = {};
        
        if (category) query.category = category;
        if (status) query.status = status;
        if (newArrival === 'true') query.isNewArrival = true;
        if (homepage === 'true') query.showOnHomepage = true;
        if (visible === 'true') query.isVisible = true; // Filter for visible products only
        
        // Pagination
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 100;
        const skip = (pageNum - 1) * limitNum;
        
        // Get total count for pagination
        const total = await Product.countDocuments(query).maxTimeMS(30000);
        
        // Get products from database with pagination
        const products = await Product.find(query)
            .populate('category', 'name description') // Populate category with name and description
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .maxTimeMS(30000);
        
        res.json({
            success: true,
            count: products.length,
            total: total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            products
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
});

// GET /api/products/:id - Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            product
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
});

// POST /api/products - Create new product
router.post('/', async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            mrp,
            price,
            images,
            tags,
            isVisible,
            isNewArrival,
            status
        } = req.body;
        
        // Create new product
        const product = new Product({
            name,
            description,
            category,
            mrp,
            price,
            images: images || [],
            tags: tags || [],
            isVisible: isVisible !== undefined ? isVisible : true,
            isNewArrival: isNewArrival || false,
            status: status || 'published'
        });
        
        // Save to database
        await product.save();
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }  // Return updated document
        );
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Product updated successfully',
            product
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
});

// PATCH /api/products/:id/visibility - Toggle product visibility
router.patch('/:id/visibility', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Toggle visibility
        product.isVisible = !product.isVisible;
        await product.save();
        
        res.json({
            success: true,
            message: `Product ${product.isVisible ? 'shown' : 'hidden'} successfully`,
            product
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating visibility',
            error: error.message
        });
    }
});

// POST /api/products/bulk-delete - Delete multiple products
router.post('/bulk-delete', async (req, res) => {
    try {
        const { productIds } = req.body;
        
        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Product IDs array is required'
            });
        }
        
        const result = await Product.deleteMany({ _id: { $in: productIds } });
        
        res.json({
            success: true,
            message: `${result.deletedCount} products deleted successfully`,
            deletedCount: result.deletedCount
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting products',
            error: error.message
        });
    }
});

// POST /api/products/bulk-update - Update multiple products
router.post('/bulk-update', async (req, res) => {
    try {
        const { productIds, updates } = req.body;
        
        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Product IDs array is required'
            });
        }
        
        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Updates object is required'
            });
        }
        
        const result = await Product.updateMany(
            { _id: { $in: productIds } },
            { $set: updates }
        );
        
        res.json({
            success: true,
            message: `${result.modifiedCount} products updated successfully`,
            modifiedCount: result.modifiedCount
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating products',
            error: error.message
        });
    }
});

// GET /api/products/search - Search products by name or description
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query (q) is required'
            });
        }
        
        // Search in name and description
        const products = await Product.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { tags: { $regex: q, $options: 'i' } }
            ]
        }).limit(20);
        
        res.json({
            success: true,
            count: products.length,
            products
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching products',
            error: error.message
        });
    }
});

export default router;
